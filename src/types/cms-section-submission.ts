import type { CodeFile } from "./code-material";
import type { TestCaseGroup } from "./core-code-submission";

export type SubmissionStatus =
  | "passed"
  | "failed"
  | "queued"
  | "running"
  | "not_submitted";

export interface CMSSectionStudentSubmission<T = unknown> {
  student: {
    id: string;
    username: string;
    display_name: string;
    profile_image: string | null;
  };
  auto_score: number;
  manual_score: number;
  ip: string | null;
  submission_status: SubmissionStatus;
  created_at: string;
  payload: T | null;
}

export interface CodeSubmissionData {
  submission_id: string;
  files: CodeFile[];
  avg_wall_time: number;
  avg_memory: number;
  test_case_groups: TestCaseGroup[];
}
