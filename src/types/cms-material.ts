import type { UserDetail } from "./user";

export interface CMSMaterial {
  id: string;
  name: string;
  tags: string[];
  type: "document" | "code" | "type";
  created_by: UserDetail;
  created_at: Date;
}
