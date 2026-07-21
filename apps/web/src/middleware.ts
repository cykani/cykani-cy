import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/unauthorized", "/api/health"];

// Marketing site route group — no auth, no domain prefix
const SITE_PREFIXES = ["/pricing", "/docs", "/blog"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.includes(p));
}

function isSitePath(pathname: string): boolean {
  return SITE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public paths, static assets, and internal Next.js routes
  if (
    isPublicPath(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") // static files
  ) {
    return NextResponse.next();
  }

  // Marketing site routes — no auth, no domain resolution
  if (isSitePath(pathname)) {
    return NextResponse.next();
  }

  // Extract domain segment from URL
  const segments = pathname.split("/").filter(Boolean);
  const domainSegment = segments[0];

  // If no domain segment, let it pass (root)
  if (!domainSegment) {
    return NextResponse.next();
  }

  // Dev mode: bypass auth so the dashboard is browsable without login
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  // Production: check for auth cookie (JWT or session token)
  const token = request.cookies.get("cykani_token")?.value;

  // Auth routes — allow regardless of auth state
  if (pathname.includes("/auth/")) {
    if (token) {
      return NextResponse.redirect(new URL(`/${domainSegment}/dashboard/default`, request.url));
    }
    return NextResponse.next();
  }

  // Protected routes — require auth
  if (!token) {
    const loginUrl = new URL(`/${domainSegment}/auth/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
