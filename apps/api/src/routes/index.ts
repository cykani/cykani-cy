import { Hono } from "hono";
import type { ApiEnv } from "../shared/hono";
import { sessionRouter } from "../lib/session";
import { profileRouter } from "../lib/profile";
import { agentRouter } from "../lib/agent";
import { orgRouter } from "../lib/organization";
import { billingRouter } from "../lib/billing";
import { proxyRouter } from "../lib/proxy";
import { analyticsRouter } from "../lib/analytics";
import { realtimeRouter } from "../lib/realtime";
import { apiKeyRouter } from "../lib/api-keys";
import { lemonSqueezyWebhookRouter } from "../lib/lemonsqueezy/webhook";
import { authRouter } from "../lib/auth/routes";
import { authMiddleware } from "../lib/auth/middleware";
import { AppOpenAPI } from "../lib/openapi";
import type { Container } from "../container";

export function createRouter(c: Container): Hono<ApiEnv> {
  const r = new Hono<ApiEnv>();

  r.route("/v1/auth", authRouter(c));
  r.route("/v1/lemonsqueezy", lemonSqueezyWebhookRouter(c));

  r.use("/v1/*", authMiddleware(c.env.JWT_SECRET, c.env.API_KEY_SECRET));

  r.use("/v1/*", async (ctx, next) => {
    const userId = ctx.get("userId") as string | undefined;
    const orgId = ctx.get("orgId") as string | undefined;
    const key = userId ?? orgId ?? ctx.req.header("x-forwarded-for") ?? "anonymous";
    const result = await c.rateLimiter.check(key, c.redis);
    ctx.header("X-RateLimit-Limit", String(c.env.MAX_SESSIONS_PER_ORG * 10));
    ctx.header("X-RateLimit-Remaining", String(result.remaining));
    ctx.header("X-RateLimit-Reset", String(result.resetMs));
    if (!result.allowed) {
      return ctx.json({ error: { code: "RATE_LIMITED", message: "Too many requests" } }, 429);
    }
    return next();
  });

  r.route("/v1/sessions", sessionRouter(c));
  r.route("/v1/profiles", profileRouter(c));
  r.route("/v1/agents", agentRouter(c));
  r.route("/v1/orgs", orgRouter(c));
  r.route("/v1/billing", billingRouter(c));
  r.route("/v1/proxies", proxyRouter(c));
  r.route("/v1/analytics", analyticsRouter());
  r.route("/v1/realtime", realtimeRouter(c, c.sseBus));
  r.route("/v1/api-keys", apiKeyRouter(c));

  AppOpenAPI.route("/v1", sessionRouter(c));
  AppOpenAPI.route("/v1", profileRouter(c));
  AppOpenAPI.route("/v1", agentRouter(c));

  return r;
}
