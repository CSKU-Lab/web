import { z } from "zod";
import { userDataSchema } from "~/schemas/user-data.schema";

const isServer = typeof window === "undefined";

export const createSectionSchema = z.object({
  name: z.string().min(1, "Section name is required"),
  instructors: z
    .array(userDataSchema)
    .min(1, "At least one instructor is required"),
  semester: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .refine((data) => data.id !== "" && data.name !== "", {
      message: "Semester is required",
    }),
  bannerImage: z.object({
    file: isServer ? z.any() : z.instanceof(File).nullable(),
    preview: z.string().url().nullable(),
  }),
  students_input: z.array(userDataSchema),
  students_upload: z.array(z.string()),
});

export type CreateSectionSchema = z.infer<typeof createSectionSchema>;

export type CreateSectionBannerImage = z.infer<
  typeof createSectionSchema.shape.bannerImage
>;
