import type { User } from "./user";

export interface CMSMaterial {
  id: string;
  name: string;
  tags: string[];
  type: MaterialType;
  visibility: "public" | "private";
  created_by: User;
  created_at: Date;
  payload: Record<string, any>;
  max_auto_score: number;
  max_manual_score: number;
}

export enum MaterialType {
  DOCUMENT = "document",
  CODE = "code",
  TYPE = "type",
}
