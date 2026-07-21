import { z } from "zod";

export const createAgentSchema = z.object({
  sessionId: z.string().min(1),
  profileId: z.string().min(1),
  task: z.object({
    goal: z.string().min(1),
    steps: z.array(z.object({ action: z.string().min(1), target: z.string().optional(), value: z.string().optional() })).min(1),
    maxSteps: z.number().int().min(1).max(100).optional(),
    llmModel: z.string().optional(),
  }),
});

export const listAgentsSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});
