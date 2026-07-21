import { z } from "zod";

export const createOrgSchema = z.object({ name: z.string().min(1).max(100), ownerId: z.string().optional() });
export const addMemberSchema = z.object({ userId: z.string().min(1), role: z.enum(["owner", "admin", "member"]).optional() });
