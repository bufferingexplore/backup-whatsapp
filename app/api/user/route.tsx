import { NextRequest, NextResponse } from "next/server";
import { getLoginSession } from "../../lib/auth";
import prisma from "../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getLoginSession();

    if (!session || !session.id) {
      return NextResponse.json(
        { message: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(session.id) },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Kesalahan saat mengambil data pengguna:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal" },
      { status: 500 }
    );
  }
}
