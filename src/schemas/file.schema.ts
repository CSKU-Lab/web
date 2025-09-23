import { z } from "zod";

export const fileSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
});
