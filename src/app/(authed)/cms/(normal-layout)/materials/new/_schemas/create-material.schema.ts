import { z } from "zod";

export const createMaterialSchema = z
  .object({
    name: z.string().min(1, "Material title is required"),
    type: z
      .enum(["document", "code", "type"], {
        errorMap: () => ({ message: "Material type is required" }),
      })
      .nullable(),
    tags: z.array(z.object({ id: z.string(), display: z.string() })),
    visibility: z.enum(["public", "private"]).default("public"),
  })
  .refine((data) => data.type !== null, {
    message: "Material type is required",
  });

export type CreateMaterialSchema = z.infer<typeof createMaterialSchema>;
