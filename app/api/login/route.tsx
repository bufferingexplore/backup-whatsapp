import bcrypt from "bcrypt";
import { setLoginSession } from "../../lib/auth";
import prisma from "../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password, rememberMe } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: decodeURIComponent(email) },
    });

    if (
      user &&
      (await bcrypt.compare(decodeURIComponent(password), user.password))
    ) {
      const response = NextResponse.json(
        { message: "Login berhasil" },
        { status: 200 }
      );
      await setLoginSession(response, user, rememberMe);
      return response;
    } else {
      return NextResponse.json(
        { message: "Email atau kata sandi tidak valid" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Kesalahan saat login:", error);
    return NextResponse.json(
      { message: "Gagal melakukan login" },
      { status: 500 }
    );
  }
}
