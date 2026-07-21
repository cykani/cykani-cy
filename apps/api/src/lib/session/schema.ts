import { z } from "zod";

export const createSessionSchema = z.object({
  profileId: z.string().min(1),
  ttlMinutes: z.number().min(1).max(1440).optional(),
});

export const listSessionsSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});
