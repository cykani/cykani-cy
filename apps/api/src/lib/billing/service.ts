import { eq } from "drizzle-orm";
import { subscriptions } from "../db/schema";
import type { DB } from "../db/client";
import { Subscription } from "./entity";
import type { OrgPlan } from "../organization/entity";

export class BillingService {
  constructor(private readonly db: DB, private readonly lemonSqueezyApiKey?: string) {}

  async getOrCreateSubscription(orgId: string, plan: OrgPlan): Promise<Subscription> {
    const [ex] = await this.db.select().from(subscriptions).where(eq(subscriptions.orgId, orgId));
    if (ex) return Subscription.reconstitute({ id: ex.id, orgId: ex.orgId, plan: ex.plan as OrgPlan, stripeSubscriptionId: ex.stripeSubscriptionId, currentPeriodStart: ex.currentPeriodStart, currentPeriodEnd: ex.currentPeriodEnd, createdAt: ex.createdAt, updatedAt: ex.updatedAt });
    const sub = Subscription.create(orgId, plan);
    await this.db.insert(subscriptions).values({ id: sub.id, orgId: sub.orgId, plan: sub.plan, stripeSubscriptionId: sub.stripeSubscriptionId, currentPeriodStart: sub.currentPeriodStart, currentPeriodEnd: sub.currentPeriodEnd, createdAt: sub.createdAt, updatedAt: sub.updatedAt });
    return sub;
  }

  async createCheckoutSession(orgId: string, plan: OrgPlan, customerEmail: string): Promise<{ sessionId: string; url: string }> {
    const existing = await this.getOrCreateSubscription(orgId, plan);

    if (this.lemonSqueezyApiKey) {
      const checkout = await createLemonSqueezyCheckout(this.lemonSqueezyApiKey, {
        email: customerEmail,
        plan,
        orgId,
      });

      await this.db.update(subscriptions).set({ stripeSubscriptionId: checkout.data.id }).where(eq(subscriptions.id, existing.id));

      return { sessionId: checkout.data.id, url: checkout.data.attributes.checkout_url ?? "" };
    }

    throw new Error("No payment provider configured. Set LEMON_SQUEEZY_API_KEY.");
  }
}

async function createLemonSqueezyCheckout(apiKey: string, params: { email: string; plan: OrgPlan; orgId: string }): Promise<any> {
  const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: params.email,
            custom: {
              orgId: params.orgId,
              plan: params.plan,
            },
          },
          product_options: {
            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001"}/${params.orgId}/dashboard/settings?success=true`,
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LemonSqueezy checkout failed: ${error}`);
  }

  return response.json();
}
