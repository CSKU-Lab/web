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

export interface SubmissionDetailFile extends CodeFile {
  /**
   * The student's per-slot editable input, indexed to the runner template
   * segments. Present for submissions saved after the backend started
   * persisting it; absent for older submissions (fall back to flat content).
   */
  editable_segments?: SubmittedFileSegment[];
}

export interface CodeSubmissionDetail {
  files: SubmissionDetailFile[];
  /** Runner used for this submission; absent on older submissions. */
  runner_id?: string;
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
  name: string;
  score: number;
  results: TestCaseResult[];
}
