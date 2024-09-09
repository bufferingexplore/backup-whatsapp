import { NextRequest, NextResponse } from "next/server";
import { getLoginSession } from "../../../lib/auth";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get("accessToken");
    if (!token) {
      return NextResponse.json({ isLoggedIn: false }, { status: 401 });
    }

    const session = await getLoginSession();
    if (!session) {
      return NextResponse.json({ isLoggedIn: false }, { status: 401 });
    }

    // Tambahkan validasi tambahan di sini jika diperlukan
    // Misalnya, periksa apakah token masih valid atau belum kadaluarsa

    return NextResponse.json({ isLoggedIn: true }, { status: 200 });
  } catch (error) {
    console.error("Kesalahan saat memeriksa status autentikasi:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal" },
      { status: 500 }
    );
  }
}
