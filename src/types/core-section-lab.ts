export interface SectionLab {
  id: string;
  name: string;
  section_id: string;
  position: number;
  created_at: Date;
  updated_at: Date;

  status: "open" | "readonly" | "disabled";
  student_status: "passed" | "not_passed" | "in_progress" | "not_started";
  closed_at: Date;

  total_materials: number;
  completed_materials: number;
}
