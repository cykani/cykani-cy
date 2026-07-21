import { z } from "zod";

export const createProfileSchema = z.object({
  name: z.string().min(1).max(100),
  fingerprintSeed: z.number().int().min(0).max(99999).optional(),
  platform: z.enum(["windows", "macos", "linux", "android"]).optional(),
  proxyUrl: z.string().url().optional(),
  viewportWidth: z.number().int().min(320).max(7680).optional(),
  viewportHeight: z.number().int().min(240).max(4320).optional(),
  locale: z.string().optional(),
  timezone: z.string().optional(),
  extensions: z.array(z.string()).optional(),
});

export const listProfilesSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});
