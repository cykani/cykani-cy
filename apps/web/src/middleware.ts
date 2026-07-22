import { auth } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/unauthorized", "/api/health"];

const SITE_PREFIXES = ["/pricing", "/docs", "/blog"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.includes(p));
}

function isSitePath(pathname: string): boolean {
  return SITE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (
    isPublicPath(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (isSitePath(pathname)) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const domainSegment = segments[0];

  if (!domainSegment) {
    return NextResponse.next();
  }

  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const isLoggedIn = !!req.auth;

  if (pathname.includes("/auth/")) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(`/${domainSegment}/dashboard/default`, req.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL(`/${domainSegment}/auth/login`, req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
