import { nanoid } from "nanoid";

export interface Webhook {
  id: string;
  orgId: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  createdAt: Date;
}

export interface WebhookEvent {
  id: string;
  webhookId: string;
  event: string;
  payload: Record<string, unknown>;
  status: "pending" | "delivered" | "failed";
  attempts: number;
  lastAttemptAt: Date | null;
  createdAt: Date;
}

export class WebhookService {
  private readonly webhooks = new Map<string, Webhook>();
  private readonly events = new Map<string, WebhookEvent[]>();

  create(orgId: string, url: string, events: string[]): Webhook {
    const webhook: Webhook = {
      id: nanoid(),
      orgId,
      url,
      events,
      secret: nanoid(32),
      active: true,
      createdAt: new Date(),
    };
    this.webhooks.set(webhook.id, webhook);
    return webhook;
  }

  listByOrg(orgId: string): Webhook[] {
    return Array.from(this.webhooks.values()).filter((w) => w.orgId === orgId);
  }

  delete(id: string): boolean {
    return this.webhooks.delete(id);
  }

  async dispatch(event: string, payload: Record<string, unknown>) {
    const matching = Array.from(this.webhooks.values()).filter(
      (w) => w.active && w.events.includes(event)
    );

    for (const webhook of matching) {
      const webhookEvent: WebhookEvent = {
        id: nanoid(),
        webhookId: webhook.id,
        event,
        payload,
        status: "pending",
        attempts: 0,
        lastAttemptAt: null,
        createdAt: new Date(),
      };

      if (!this.events.has(webhook.id)) {
        this.events.set(webhook.id, []);
      }
      this.events.get(webhook.id)!.push(webhookEvent);

      await this.deliver(webhook, webhookEvent);
    }
  }

  private async deliver(webhook: Webhook, event: WebhookEvent) {
    try {
      const response = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Id": webhook.id,
          "X-Webhook-Secret": webhook.secret,
          "X-Event-Type": event.event,
        },
        body: JSON.stringify(event),
        signal: AbortSignal.timeout(10000),
      });

      event.status = response.ok ? "delivered" : "failed";
      event.attempts++;
      event.lastAttemptAt = new Date();
    } catch {
      event.status = "failed";
      event.attempts++;
      event.lastAttemptAt = new Date();
    }
  }

  getEvents(webhookId: string): WebhookEvent[] {
    return this.events.get(webhookId) ?? [];
  }
}
