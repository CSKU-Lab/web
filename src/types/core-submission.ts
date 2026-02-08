import type { CodeFile } from "./code-material";

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

export interface SubmissionResult<T> {
  id: string;
  status: "queued" | "running" | "passed" | "failed";
  created_at: string;
  payload: T;
}
