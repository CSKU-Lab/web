import { z } from "zod";

export const userDataSchema = z.object({
  id: z.string(),
  username: z.string(),
  display_name: z.string(),
  profile_image: z.string().or(z.null()),
});
