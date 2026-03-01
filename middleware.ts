import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/infrastructure/security/auth-middleware.service";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
  const session = sessionToken ? await verifySession(sessionToken) : null;

  if (pathname.startsWith("/admin")) {
    if (!session?.isAdmin) {
      if (!session?.isAuthenticated) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/configurations")) {
    if (!session?.isAuthenticated) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  if (pathname.startsWith("/checkout") || pathname.startsWith("/order-details")) {
    if (!session?.isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/checkout/:path*",
    "/order-details/:path*",
    "/configurations/:path*",
  ],
};
