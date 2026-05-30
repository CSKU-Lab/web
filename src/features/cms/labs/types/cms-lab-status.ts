import { Student } from "~/types/cms-section";

export type CMSSubmissionStatus = "passed" | "failed" | "not_submitted";

export interface CMSLabStatusMaterial {
  material_id: string;
  material_name: string;
}

export interface CMSLabStatusSubmission {
  status: CMSSubmissionStatus;
  submitted_at?: string;
}

export interface CMSLabStatusStudent extends Student {
  material_statuses: Record<string, CMSLabStatusSubmission>;
}

export interface CMSLabStatus {
  material_cols: CMSLabStatusMaterial[];
  student_rows: CMSLabStatusStudent[];
}
