import { type User } from "./user";

export type Instructor = Pick<
  User,
  "id" | "username" | "display_name" | "profile_image"
>;

export interface Section {
  id: string;
  name: string;
  course_name: string;
  banner: string;
  instructors: Instructor[];
  semester: { id: string; name: string; type: string };
  created_at: string;
}
