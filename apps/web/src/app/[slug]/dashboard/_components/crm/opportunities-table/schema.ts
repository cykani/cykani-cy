import z from "zod";

export const profileSchema = z.object({
  id: z.string(),
  profile: z.string(),
  status: z.string(),
  region: z.string(),
  health: z.string(),
  uptime: z.string(),
});

export const profilesSchema = z.array(profileSchema);

export type ProfileRow = z.infer<typeof profileSchema>;
