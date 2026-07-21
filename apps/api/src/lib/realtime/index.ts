import { Hono } from "hono";
import type { ApiEnv } from "../../shared/hono";
import type { Container } from "../../container";
import { EventBus } from "../events";

export function realtimeRouter(container: Container, eventBus: EventBus): Hono<ApiEnv> {
  const r = new Hono<ApiEnv>();

  r.get("/stream", async (c) => {
    const orgId = c.get("orgId");

    const stream = new ReadableStream({
      start(controller) {
        const unsubscribe = eventBus.subscribe(orgId, controller);

        controller.enqueue(new TextEncoder().encode(`event: connected\ndata: ${JSON.stringify({ orgId })}\n\n`));

        c.req.raw.signal.addEventListener("abort", () => {
          unsubscribe();
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  });

  r.get("/sessions/:id/events", async (c) => {
    const sessionId = c.req.param("id");
    const orgId = c.get("orgId");

    const stream = new ReadableStream({
      start(controller) {
        const unsub = eventBus.subscribe(orgId, controller);
        controller.enqueue(new TextEncoder().encode(`event: connected\ndata: ${JSON.stringify({ sessionId })}\n\n`));
        c.req.raw.signal.addEventListener("abort", () => { unsub(); controller.close(); });
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "Connection": "keep-alive" },
    });
  });

  return r;
}
