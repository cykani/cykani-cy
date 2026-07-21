import { triggerClient } from "@trigger.dev/sdk";

export const trigger = triggerClient({
  apiKey: process.env.TRIGGER_SECRET_KEY!,
  baseURL: process.env.TRIGGER_API_URL ?? "https://api.trigger.dev",
});
