import { Hono } from "hono";
import type { ApiEnv } from "../../shared/hono";
import { OrgPlan, PLAN_LIMITS } from "../organization/entity";
import type { Container } from "../../container";

export function billingRouter(container: Container): Hono<ApiEnv> {
  const r = new Hono<ApiEnv>();
  r.get("/plans", (c) => c.json({ plans: Object.entries(PLAN_LIMITS).map(([id, limits]) => ({ id, name: id.charAt(0).toUpperCase() + id.slice(1), limits, price: id === "free" ? 0 : id === "pro" ? 49 : 199 })) }));

  r.post("/checkout", async (c) => {
    const orgId = c.get("orgId");
    const userId = c.get("userId");
    const { plan } = await c.req.json<{ plan: string }>();
    if (!Object.values(OrgPlan).includes(plan as OrgPlan)) return c.json({ error: { code: "INVALID_PLAN", message: "Invalid plan" } }, 400);

    const result = await container.billingService.createCheckoutSession(orgId as string, plan as OrgPlan, `${userId}@local`);
    return c.json({ checkoutUrl: result.url, sessionId: result.sessionId, provider: "lemonsqueezy" });
  });

  return r;
}
