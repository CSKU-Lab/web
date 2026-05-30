import { z } from "zod";
import { isServer } from "~/lib/is-server";
import { userDataSchema } from "~/schemas/user-data.schema";

export const updateSectionSchema = z.object({
  banner: isServer
    ? z.any()
    : z.instanceof(File).nullable().or(z.string().url()).nullable(),
  name: z.string().min(1, "Section name is required"),
  instructors: z
    .array(userDataSchema)
    .min(1, "At least one instructor is required"),
  semester: z
    .object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
    })
    .refine((data) => data.id !== "" && data.name !== "", {
      message: "Semester is required",
    }),
});

export type UpdateSectionSchema = z.infer<typeof updateSectionSchema>;
