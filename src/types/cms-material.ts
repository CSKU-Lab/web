export interface CMSMaterial {
  id: string;
  name: string;
  tags: string[];
  type: "document" | "code" | "type";
  visibility: "public" | "private";
  created_by: string;
  created_at: Date;
}
