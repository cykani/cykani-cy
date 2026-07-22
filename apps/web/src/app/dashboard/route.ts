import type { NextRequest } from "next/server";

export function GET(_req: NextRequest) {
  return Response.redirect(new URL("/cykani/dashboard/default", _req.url), 302);
}
