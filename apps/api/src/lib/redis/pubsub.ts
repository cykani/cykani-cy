import type Redis from "ioredis";
import type { DomainEvent } from "../../shared/events";

export class RedisPubSub {
  private readonly subs = new Map<string, Set<(e: DomainEvent) => Promise<void>>>();
  private readonly sub: Redis;

  constructor(private readonly pub: Redis) { this.sub = pub.duplicate(); }

  async publish(event: DomainEvent) {
    await this.pub.publish(`domain:${event.eventType}`, JSON.stringify(event));
    for (const handler of this.subs.get("*") ?? []) handler(event).catch(() => {});
    for (const handler of this.subs.get(event.eventType) ?? []) handler(event).catch(() => {});
  }

  subscribe(eventType: string, handler: (e: DomainEvent) => Promise<void>): () => void {
    if (!this.subs.has(eventType)) this.subs.set(eventType, new Set());
    this.subs.get(eventType)!.add(handler);
    return () => { this.subs.get(eventType)?.delete(handler); };
  }

  async close() { await this.sub.quit(); }
}
