import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROLE_COOKIE_NAME, normalizeRole, getDashboardPath } from "./lib/auth";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Only protect dashboard routes
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const roleCookie = req.cookies.get(ROLE_COOKIE_NAME)?.value ?? null;
  const role = normalizeRole(roleCookie);

  if (!role) {
    // Not logged in — send to login page
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Prevent role from accessing other dashboards
  if (pathname.startsWith("/dashboard/admin-web") && role !== "admin-web") {
    return NextResponse.redirect(new URL(getDashboardPath(role), req.url));
  }

  if (pathname.startsWith("/dashboard/admin-resto") && role !== "admin-resto") {
    return NextResponse.redirect(new URL(getDashboardPath(role), req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
