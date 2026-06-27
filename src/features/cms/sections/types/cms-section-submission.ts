import type { CodeFile } from "~/types/code-material";
import type { TestCaseGroup } from "~/types/core-code-submission";

export type SubmissionStatus =
  | "passed"
  | "failed"
  | "queued"
  | "running"
  | "not_submitted"
  | "partial";

export interface CMSSectionSubmissionStudent {
  id: string;
  username: string;
  display_name: string;
  profile_image: string | null;
}

export interface CMSSectionSubmission<T = unknown> {
  id: string;
  order: number;
  auto_score: number;
  manual_score: number;
  ip: string | null;
  status: SubmissionStatus;
  created_at: string;
  updated_at: string;
  payload: T | null;
}

export interface CMSSectionStudentLatestSubmission<T = unknown>
  extends CMSSectionSubmission<T> {
  student: CMSSectionSubmissionStudent;
}

export interface CodeSubmissionData {
  submission_id: string;
  files: CodeFile[];
  avg_wall_time: number;
  avg_memory: number;
  test_case_groups: TestCaseGroup[];
}

export interface TypingSubmissionData {
  raw_wpm: number;
  adjusted_wpm: number;
  error_rate: number;
  duration: number;
}
