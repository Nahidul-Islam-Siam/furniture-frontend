import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value?.toUpperCase();

  // 1. Protect /admin routes (Admin & Super Admin only)
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
    if (!isAdmin) {
      // Non-admin user trying to access admin panel -> redirect to user dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 2. Protect /dashboard routes (Any logged-in user)
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Redirect logged-in users away from /login or /register
  if (
    (pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/signup") &&
    token
  ) {
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
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
