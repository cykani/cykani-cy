import { type NextRequest, NextResponse } from "next/server";

// Marketing site is fully public
const PUBLIC_PREFIXES = [
  "/",
  "/pricing",
  "/docs",
  "/blog",
  "/changelog",
  "/about",
  "/contact",
  "/faq",
  "/products",
  "/clients",
  "/integrations",
  "/terms",
  "/privacy",
];

function isPublic(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static assets and internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") ||
    pathname === "/api/health"
  ) {
    return NextResponse.next();
  }

  // Allow marketing pages
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Block everything else — redirect to coming-soon
  return NextResponse.redirect(new URL("/coming-soon", req.url));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
