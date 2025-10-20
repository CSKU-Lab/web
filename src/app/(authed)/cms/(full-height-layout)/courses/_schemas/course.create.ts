import { z } from "zod";
import { userDataSchema } from "~/schemas/user-data.schema";

export const createCourseSchame = z.object({
  name: z.string().min(1, "Course name is required"),
  creators: z.array(userDataSchema).min(1, "Creator is required"),
  type: z.enum(["public", "private"]).default("public"),
});

export type CreateCourseSchema = z.infer<typeof createCourseSchame>;
