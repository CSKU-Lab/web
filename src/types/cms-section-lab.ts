export type LabStatus = "hidden" | "open" | "readonly" | "disabled" | "closed";

export interface CMSSectionLab {
  id: string;
  lab_name: string;
  section_id: string;
  lab_id: string;
  position: number;
  status: LabStatus;
  created_at: Date;
  updated_at: Date;
}
