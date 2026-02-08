import type { CodeFile } from "./code-material";

export type SubmissionStatus = "queued" | "running" | "passed" | "failed";

export interface CodeSubmissionPayload {
  files: CodeFile[];
  runner_id: string;
}

export interface CodeSubmissionResult {
  files: CodeFile[];
  status: "RUN_PASSED" | "RUN_FAILED" | "COMPILE_ERROR" | "GRADER_ERROR";
  avg_wall_time: number;
  avg_memory: number;
  test_case_groups: null;
}

export interface SubmissionOverviewResult<T> {
  id: string;
  status: SubmissionStatus;
  created_at: string;
  payload: T;
}

export interface CodeSubmissionOverview {
  passed_test_cases: number;
  total_test_cases: number;
}
