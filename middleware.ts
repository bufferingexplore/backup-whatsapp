import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./app/lib/auth";
import { getLoginSession } from "./app/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken");
  const path = request.nextUrl.pathname;
  if (token) {
    try {
      const user = await getLoginSession();
      if (user) {
        if (path === "/login") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        const response = NextResponse.next();
        response.headers.set("X-User-ID", user.id as string);
        return response;
      }
    } catch (error) {
      console.error("Kesalahan verifikasi token:", error);
    }
  }

  if (path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
