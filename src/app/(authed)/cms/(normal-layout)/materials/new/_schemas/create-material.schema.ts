import { z } from "zod";

export const createMaterialSchema = z
  .object({
    name: z.string().min(1, "Material title is required"),
    type: z
      .enum(["document", "code", "typing"], {
        errorMap: () => ({ message: "Material type is required" }),
      })
      .nullable(),
    tags: z.array(z.object({ id: z.string(), display: z.string() })),
    visibility: z.enum(["public", "private"]).default("public"),
    manual_score: z
      .number()
      .int("Manual score must be an integer")
      .min(0, "Manual score must be non-negative")
      .default(0)
      .optional(),
  })
  .refine((data) => data.type !== null, {
    message: "Material type is required",
  });

export type CreateMaterialSchema = z.infer<typeof createMaterialSchema>;
