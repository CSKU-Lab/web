import { z } from "zod";

export const updateLabSchema = z.object({
  display_name: z.string().min(1, "lab name is required"),
});

export type updateLabSchema = z.infer<typeof updateLabSchema>;
