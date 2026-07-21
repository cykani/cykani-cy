import { z } from "zod";

export const createProxySchema = z.object({
  name: z.string().min(1).max(100),
  url: z.string().url(),
  username: z.string().optional(),
  password: z.string().optional(),
  country: z.string().optional(),
  protocol: z.enum(["http", "https", "socks5"]).optional(),
});

export const listProxiesSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});
