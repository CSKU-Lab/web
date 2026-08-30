export type CodeExecutionStatus =
  | "STATUS_UNSPECIFIED"
  | "STATUS_COMPILE_FAILED"
  | "STATUS_RUN_PASSED"
  | "STATUS_RUN_FAILED"
  | "STATUS_TIME_LIMIT_EXCEEDED"
  | "STATUS_MEMORY_LIMIT_EXCEEDED"
  | "STATUS_RUNTIME_ERROR"
  | "STATUS_SIGNAL_ERROR"
  | "STATUS_GRADER_ERROR"
  | "STATUS_QUEUED"
  | "STATUS_RUNNING";

export interface CodeExecutionResult {
  execution_id?: string;
  id?: string;
  status: CodeExecutionStatus;
  output: string;
  wall_time: number;
  memory: number;
  exit_code: number;
  compare_result: string;
}
