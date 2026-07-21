import { Hono } from "hono";
import type { ApiEnv } from "../../shared/hono";
import type { Container } from "../../container";
import { errorResponse } from "../../shared/http";
import { createHmac, timingSafeEqual } from "crypto";

async function verifyStripeEvent(payload: string, sigHeader: string, secret: string): Promise<any> {
  const parts = sigHeader.split(",");
  const timestamp = parts.find((p) => p.trim().startsWith("t="))?.split("=")[1];
  const signature = parts.find((p) => p.trim().startsWith("v1="))?.split("=")[1];
  if (!timestamp || !signature) return null;

  const signedPayload = `${timestamp}.${payload}`;
  const expected = createHmac("sha256", secret).update(signedPayload).digest("hex");
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function customerEmail(session: any): string | null {
  return session.customer_email ?? session.customer_details?.email ?? null;
}

export function stripeWebhookRouter(container: Container): Hono<ApiEnv> {
  const r = new Hono<ApiEnv>();

  r.post("/webhook", async (c) => {
    const sig = c.req.header("stripe-signature");
    if (!sig) return c.json({ error: { code: "MISSING_SIGNATURE", message: "Missing Stripe signature" } }, 400);

    const body = await c.req.text();
    const event = await verifyStripeEvent(body, sig, (c.env as any).STRIPE_WEBHOOK_SECRET);
    if (!event) return c.json({ error: { code: "INVALID_SIGNATURE", message: "Invalid webhook signature" } }, 400);

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as any;
          const orgId = session.metadata?.orgId;
          const plan = session.metadata?.plan;
          const customerId = session.customer;

          if (!orgId || !plan) return c.json({ error: { code: "BAD_REQUEST", message: "Missing metadata" } }, 400);

          const existing = await container.billingService.getOrCreateSubscription(orgId, plan);
          const org = await container.orgService.getById(orgId);
          if (org.ok) {
            org.value.changePlan(plan);
            await container.orgService.save(org.value);
          }

          const license = await container.licenseKeyService.createForOrg(orgId, plan, customerId, existing.stripeSubscriptionId ?? undefined);

          const email = customerEmail(session);
          if (email) {
            await container.email.send({
              to: [email],
              subject: `Your Cykani ${plan} license key`,
              body: `Your license key: ${license.raw}\nPlan: ${plan}\nThis key activates the cykani-browser binary.`,
              html: `<p>Your license key:</p><pre>${license.raw}</pre><p>Plan: ${plan}</p><p>Activate with: cykani-browser --license-key=${license.raw}</p>`,
            });
          }
          break;
        }

        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const sub = event.data.object as any;
          const customerId = sub.customer as string;
          const org = await container.orgService.getById(customerId);
          if (org.ok) {
            const newPlan = sub.status === "active" ? sub.metadata?.plan ?? "free" : "free";
            org.value.changePlan(newPlan);
            await container.orgService.save(org.value);
          }
          break;
        }

        default:
          break;
      }

      return c.json({ received: true });
    } catch (e) {
      return c.json({ error: { code: "INTERNAL", message: "Webhook processing failed" } }, 500);
    }
  });

  return r;
}
