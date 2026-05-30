export interface LabMaterial {
  id: string;
  lab_id: string;
  name: string;
  type: string;
  student_status: "passed" | "not_passed" | "in_progress" | "not_started";
  created_at: Date;
}
