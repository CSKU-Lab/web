import type { UserDetail } from "./user";

export interface CMSMaterial {
  id: string;
  name: string;
  tag: string[];
  type: "lesson" | "lab";
  created_by: UserDetail;
}
