import { NextRequest, NextResponse } from "next/server";
import { getLoginSession } from "../../../lib/auth";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get("accessToken");
    if (token) {
      const session = await getLoginSession();
      if (session) {
        return NextResponse.json({ isLoggedIn: true }, { status: 200 });
      }
    }
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  } catch (error) {
    console.error("Kesalahan saat memeriksa status autentikasi:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal" },
      { status: 500 }
    );
  }
}
