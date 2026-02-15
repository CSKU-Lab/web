import { z } from "zod";

export const createDefaultLabSchema = z.object({
  lab_id: z.string().uuid(),
  position: z.number().int().positive().nullable().optional(),
});

export type CreateDefaultLabSchema = z.infer<typeof createDefaultLabSchema>;
