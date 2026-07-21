import { errorResponse } from "../../shared/http";
import { Hono } from "hono";
import type { ApiEnv } from "../../shared/hono";
import { OrgPlan, PLAN_LIMITS } from "../organization/entity";
import type { Container } from "../../container";

export function billingRouter(container: Container): Hono<ApiEnv> {
  const r = new Hono<ApiEnv>();
  r.get("/plans", (c) => c.json({ plans: Object.entries(PLAN_LIMITS).map(([id, limits]) => ({ id, name: id.charAt(0).toUpperCase() + id.slice(1), limits, price: id === "free" ? 0 : id === "pro" ? 10 : 50 })) }));

  r.post("/checkout", async (c) => {
    const orgId = c.get("orgId");
    const userId = c.get("userId");
    const { plan, provider = "lemonsqueezy" } = await c.req.json<{ plan: string; provider?: "stripe" | "kofi" | "lemonsqueezy" }>();
    if (!Object.values(OrgPlan).includes(plan as OrgPlan)) return c.json({ error: { code: "INVALID_PLAN", message: "Invalid plan" } }, 400);

    const result = await container.billingService.createCheckoutSession(orgId as string, plan as OrgPlan, `${userId}@local`, provider);
    return c.json({ checkoutUrl: result.url, sessionId: result.sessionId, provider });
  });

  return r;
}
