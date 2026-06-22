import type { CodeFile } from "~/types/code-material";

export interface SubmittedFileSegment {
  index: number;
  content: string;
}

export interface SubmittedFile {
  name: string;
  editable_segments: SubmittedFileSegment[];
}

export interface CodeSubmissionPayload {
  files: SubmittedFile[];
  runner_id: string;
}

export interface CodeSubmissionOverview {
  passed_test_cases: number;
  total_test_cases: number;
}

export interface CodeSubmissionDetail {
  files: CodeFile[];
  status: "RUN_PASSED" | "RUN_FAILED" | "COMPILE_ERROR" | "GRADER_ERROR";
  avg_wall_time: number;
  avg_memory: number;
  test_case_groups: TestCaseGroup[];
}

export type CodeSubmissionResultStatus =
  | "COMPILE_FAILED"
  | "RUN_PASSED"
  | "RUN_FAILED"
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "RUNTIME_ERROR"
  | "SIGNAL_ERROR"
  | "GRADER_ERROR";

export interface TestCaseResult {
  id: string;
  status: CodeSubmissionResultStatus;
  input: string;
  output: string;
  message: string;
  wall_time: number;
  memory: number;
}

export interface TestCaseGroup {
  id: string;
  score: number;
  results: TestCaseResult[];
}
