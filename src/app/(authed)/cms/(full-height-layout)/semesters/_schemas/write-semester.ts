import { z } from "zod";

export const writeSemesterSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  type: z.enum(["first", "second", "summer"], {
    required_error: "Type is required",
  }),
  started_date: z.date({ required_error: "Started date is required" }),
});

export type WriteSemester = z.infer<typeof writeSemesterSchema>;
