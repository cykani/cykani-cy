import type { Context, Next } from "hono";
import { createHmac, timingSafeEqual } from "crypto";
import { jwtVerify } from "jose";

function base64UrlDecode(str: string): Buffer {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64 + "=".repeat((4 - (base64.length % 4)) % 4), "base64");
}

async function verifyJwt(token: string, secret: string): Promise<{ sub: string; orgId: string; exp: number } | null> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as unknown as { sub: string; orgId: string; exp: number };
  } catch {
    return null;
  }
}

function verifyApiKey(rawKey: string, apiSecret: string): { orgId: string; keyId: string } | null {
  try {
    const parts = rawKey.split("_");
    if (parts.length < 3 || parts[0] !== "ck") return null;

    const keyId = parts[1]!;
    const signature = parts.slice(2).join("_");

    const expected = createHmac("sha256", apiSecret).update(keyId).digest("hex");
    if (!timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"))) return null;

    return { orgId: keyId, keyId };
  } catch {
    return null;
  }
}

export function authMiddleware(secret: string, apiSecret: string) {
  return async (c: Context, next: Next) => {
    const apiKey = c.req.header("x-api-key");
    const authHeader = c.req.header("authorization");
    const cookieToken = c.req.header("cookie")?.split(";").find((c) => c.trim().startsWith("cykani_token="))?.split("=")[1];

    if (apiKey) {
      const result = verifyApiKey(apiKey, apiSecret);
      if (!result) {
        return c.json({ error: { code: "UNAUTHORIZED", message: "Invalid API key" } }, 401);
      }
      c.set("orgId", result.orgId);
      c.set("userId", "api_" + result.orgId);
      return next();
    }

    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : cookieToken;
    if (token) {
      const payload = await verifyJwt(token, secret);
      if (!payload) return c.json({ error: { code: "UNAUTHORIZED", message: "Invalid token" } }, 401);
      c.set("userId", payload.sub);
      c.set("orgId", payload.orgId);
      return next();
    }

    return c.json({ error: { code: "UNAUTHORIZED", message: "Auth required" } }, 401);
  };
}
