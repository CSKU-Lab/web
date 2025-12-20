export type AffectedType = "semester" | "course" | "section";

export interface AffectedEntities {
  type: string;
  data: EntityDetail[];
}

export interface EntityDetail {
  name: string;
  children: AffectedEntities[] | null;
}
