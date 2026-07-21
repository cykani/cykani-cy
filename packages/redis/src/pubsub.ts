import type Redis from "ioredis";

export interface DomainEvent {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly occurredAt: Date;
  readonly payload: Record<string, unknown>;
}

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  subscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>): void;
}

export class RedisEventBus implements EventBus {
  private readonly subscribers = new Map<string, Set<(event: DomainEvent) => Promise<void>>>();
  private readonly subscriber: Redis;

  constructor(private readonly publisher: Redis) {
    this.subscriber = publisher.duplicate();
  }

  async publish(event: DomainEvent): Promise<void> {
    const channel = `domain:${event.eventType}`;
    const payload = JSON.stringify(event);
    await this.publisher.publish(channel, payload);

    const wildcardHandlers = this.subscribers.get("*");
    if (wildcardHandlers) {
      for (const handler of wildcardHandlers) {
        handler(event).catch(() => {});
      }
    }

    const handlers = this.subscribers.get(event.eventType);
    if (handlers) {
      for (const handler of handlers) {
        handler(event).catch(() => {});
      }
    }
  }

  subscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType)!.add(handler);

    return () => {
      this.subscribers.get(eventType)?.delete(handler);
    };
  }

  async close(): Promise<void> {
    await this.subscriber.quit();
  }
}
