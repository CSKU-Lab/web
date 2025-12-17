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
  semester: { id: string; name: string; type: string };
}

export interface CMSSection {
  semester: { name: string; type: string };
  sections: Section[];
}

export interface Student {
  id: string;
  username: string;
  display_name: string;
  profile_image: string | null;
}
