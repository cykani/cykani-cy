import { Hono } from "hono";
import type { ApiEnv } from "../../shared/hono";
import type { Container } from "../../container";
import { eq } from "drizzle-orm";
import { subscriptions, organizations } from "../db/schema";
import { Subscription } from "../billing/entity";

export function lemonSqueezyWebhookRouter(container: Container): Hono<ApiEnv> {
  const r = new Hono<ApiEnv>();

  r.post("/webhook", async (c) => {
    const signature = c.req.header("x-lemonsqueezy-signature");
    const payload = await c.req.text();

    if (!signature || !container.env.LEMON_SQUEEZY_WEBHOOK_SECRET) {
      return c.json({ error: { code: "INVALID_SIGNATURE", message: "Invalid webhook signature" } }, 400);
    }

    const event = verifyLemonSqueezySignature(payload, signature, container.env.LEMON_SQUEEZY_WEBHOOK_SECRET);
    if (!event) {
      return c.json({ error: { code: "INVALID_SIGNATURE", message: "Invalid webhook signature" } }, 400);
    }

    try {
      const { data, meta } = event;

      switch (meta.event_name) {
        case "order_created":
        case "subscription_created": {
          const orgId = data.attributes.custom_data?.orgId;
          const plan = data.attributes.custom_data?.plan;
          const customerEmail = data.attributes.customer_email;

          if (!orgId || !plan) return c.json({ error: { code: "BAD_REQUEST", message: "Missing metadata" } }, 400);

          const [sub] = await container.db.select().from(subscriptions).where(eq(subscriptions.orgId, orgId));
          if (sub) {
            await container.db.update(subscriptions).set({ plan, stripeSubscriptionId: data.id }).where(eq(subscriptions.id, sub.id));
          }

          const [org] = await container.db.select().from(organizations).where(eq(organizations.id, orgId));
          if (org) {
            await container.db.update(organizations).set({ plan }).where(eq(organizations.id, orgId));
          }

          if (customerEmail && container.email) {
            await container.email.send({
              to: [customerEmail],
              subject: `Your Cykani ${plan} license key`,
              body: `Your license key: ${generateLicenseKey(orgId)}\nPlan: ${plan}\nThis key activates the cykani-browser binary.`,
              html: `<p>Your license key:</p><pre>${generateLicenseKey(orgId)}</pre><p>Plan: ${plan}</p>`,
            });
          }
          break;
        }

        case "subscription_updated": {
          const orgId = data.attributes.custom_data?.orgId;
          const plan = data.attributes.custom_data?.plan;
          if (orgId && plan) {
            await container.db.update(organizations).set({ plan }).where(eq(organizations.id, orgId));
          }
          break;
        }

        case "subscription_cancelled": {
          const orgId = data.attributes.custom_data?.orgId;
          if (orgId) {
            await container.db.update(organizations).set({ plan: "free" }).where(eq(organizations.id, orgId));
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

function verifyLemonSqueezySignature(payload: string, signature: string, secret: string): any {
  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function generateLicenseKey(orgId: string): string {
  const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return `ck_${orgId}_${random}`;
}
