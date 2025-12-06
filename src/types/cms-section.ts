import { type User } from "./user";

type Instructor = Pick<
  User,
  "id" | "username" | "display_name" | "profile_image"
>;

export interface Section {
  id: string;
  name: string;
  banner: string;
  instructors: Instructor[];
}

export interface CMSSection {
  semester: { name: string; type: string };
  sections: Section[];
}
