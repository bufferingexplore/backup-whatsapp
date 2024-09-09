import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
} from "@whiskeysockets/baileys";
import prisma from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Boom } from "@hapi/boom";
import pino from "pino";
let sock: any;

const connectToWhatsApp = async (res?: NextApiResponse) => {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino(
      {
        level: "silent",
      },
      pino.destination({ sync: false })
    ),
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, qr, lastDisconnect } = update;
    if (qr && res) {
      res.status(200).json({ qr });
    }
    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      if (shouldReconnect) {
        connectToWhatsApp(res);
      }
    } else if (connection === "open") {
      console.log("WhatsApp connection opened");
    }
  });

  sock.ev.on("messages.upsert", async (messageUpdate) => {
    const message = messageUpdate.messages[0];

    // Fetch chat's backup status from the database
    const chat = await prisma.chat.findFirst({
      where: {
        chatId: message.key.remoteJid!,
      },
    });

    // If backup is enabled for the chat, store it in the database
    if (chat?.backup || chat == null) {
      await prisma.chat.create({
        data: {
          chatId: message.key.remoteJid!,
          message: message.message?.conversation || "",
          mediaUrl: message.message?.imageMessage?.url || null, // Handle media
          timestamp: new Date(),
          backup: true, // This field can be toggled
        },
      });
    }
  });

  sock.ev.on("creds.update", saveCreds);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!sock) {
    await connectToWhatsApp(res);
  }

  if (req.method === "POST") {
    const { action, chatId } = req.body;
    if (action === "toggle-backup") {
      // Toggle backup status for a specific chat
      const chat = await prisma.chat.findFirst({
        where: { chatId },
      });
      if (chat) {
        await prisma.chat.update({
          where: { chatId },
          data: { backup: !chat.backup },
        });
      } else {
        await prisma.chat.create({
          data: {
            chatId,
            backup: true, // Default to backup enabled when new chat is created
          },
        });
      }
      res.status(200).json({ status: "Backup toggled" });
    }
  } else if (req.method === "GET") {
    // Handle QR code generation for WhatsApp login
    await connectToWhatsApp(res);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
