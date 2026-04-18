import { z } from "zod";

export const createLabSchema = z.object({
  display_name: z.string().min(1, "Lab name is required"),
});

export type CreateLabSchema = z.infer<typeof createLabSchema>;