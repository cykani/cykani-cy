import type { Container } from "../../container";

export class EventBus {
  private readonly clients = new Map<string, Set<ReadableStreamDefaultController>>();

  subscribe(orgId: string, controller: ReadableStreamDefaultController) {
    if (!this.clients.has(orgId)) {
      this.clients.set(orgId, new Set());
    }
    this.clients.get(orgId)!.add(controller);

    return () => {
      this.clients.get(orgId)?.delete(controller);
      if (this.clients.get(orgId)?.size === 0) {
        this.clients.delete(orgId);
      }
    };
  }

  publish(orgId: string, event: string, data: Record<string, unknown>) {
    const clients = this.clients.get(orgId);
    if (!clients) return;

    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const controller of clients) {
      try {
        controller.enqueue(new TextEncoder().encode(payload));
      } catch {
        clients.delete(controller);
      }
    }
  }

  broadcast(event: string, data: Record<string, unknown>) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const [, clients] of this.clients) {
      for (const controller of clients) {
        try {
          controller.enqueue(new TextEncoder().encode(payload));
        } catch {
          clients.delete(controller);
        }
      }
    }
  }
}

export function createSSEHandler(container: Container) {
  const eventBus = new EventBus();

  container.eventBus.subscribe("*", async (event) => {
    eventBus.broadcast(event.eventType, event.payload);
  });

  return eventBus;
}
