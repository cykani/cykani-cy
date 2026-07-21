import { serve } from "@hono/node-server";
import { createApp } from "./http";
import { createContainer } from "./container";

const container = createContainer();
const app = createApp(container);

console.log(`cykani API → http://0.0.0.0:${container.env.PORT}`);
serve({ fetch: app.fetch, port: container.env.PORT, hostname: "0.0.0.0" });
