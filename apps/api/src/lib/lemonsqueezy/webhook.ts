import { Hono } from "hono";
import type { ApiEnv } from "../../shared/hono";
import type { Container } from "../../container";
import { eq } from "drizzle-orm";
import { subscriptions, organizations } from "../db/schema";
import { createHmac, timingSafeEqual } from "crypto";
import { randomBytes } from "crypto";

function verifyLemonSqueezySignature(payload: string, signature: string, secret: string): any {
  try {
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    const sigBuf = Buffer.from(signature, "hex");
    const expectedBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expectedBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expectedBuf)) return null;
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function generateLicenseKey(orgId: string): string {
  const random = randomBytes(24).toString("hex");
  return `cykani-${orgId.slice(0, 8)}-${random}`;
}

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
            const licenseKey = generateLicenseKey(orgId);
            await container.email.send({
              to: [customerEmail],
              subject: `Your Cykani ${plan} license key`,
              body: `Your license key: ${licenseKey}\nPlan: ${plan}\nThis key activates the cykani-browser binary.\n\nActivate with: cykani-stealth --license-key=${licenseKey}`,
              html: `<p>Your license key:</p><pre style="background:#f4f4f4;padding:8px;border-radius:4px;font-size:14px">${licenseKey}</pre><p>Plan: <strong>${plan}</strong></p><p>Activate with: <code>cykani-stealth --license-key=${licenseKey}</code></p>`,
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
