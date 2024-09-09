import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();

    allCookies.forEach((cookie) => {
      cookieStore.delete(cookie.name);
    });

    return NextResponse.json({ message: "Berhasil logout" }, { status: 200 });
  } catch (error) {
    console.error("Kesalahan saat logout:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat logout" },
      { status: 500 }
    );
  }
}
