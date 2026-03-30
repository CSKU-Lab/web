export type LabStatus = "hidden" | "open" | "readonly" | "disabled" | "closed";

export interface CMSSectionLab {
  lab_name: string;
  lab_id: string;
  position: number;
  status: LabStatus;
  opened_at: string | null;
  closed_at: string | null;
}

export type CMSSectionLabDetail = Omit<CMSSectionLab, "position" | "lab_id"> & {
  completed_students: number;
  total_students: number;
};
