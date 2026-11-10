import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isJwtTokenValid, parseJwtPayload } from "./lib/authCookies";

function clearCookiesOnResponse(response: NextResponse) {
  response.cookies.delete("accessToken");
  response.cookies.delete("token");
  response.cookies.delete("role");
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("token")?.value;

  const isTokenValid = isJwtTokenValid(token);
  const payload = isTokenValid ? parseJwtPayload(token) : null;
  const role = (
    payload?.role ||
    request.cookies.get("role")?.value ||
    ""
  ).toUpperCase();

  // 1. Protect /admin routes (Admin & Super Admin only)
  if (pathname.startsWith("/admin")) {
    if (!isTokenValid) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return clearCookiesOnResponse(NextResponse.redirect(loginUrl));
    }

    const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 2. Protect /dashboard routes (Authenticated users only)
  if (pathname.startsWith("/dashboard")) {
    if (!isTokenValid) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return clearCookiesOnResponse(NextResponse.redirect(loginUrl));
    }
  }

  // 3. Redirect genuinely authenticated users away from /login or /signup
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/signup"
  ) {
    if (isTokenValid) {
      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If stale/invalid token exists while hitting /login, clear it cleanly
    if (token) {
      return clearCookiesOnResponse(NextResponse.next());
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
    "/signup",
  ],
};
