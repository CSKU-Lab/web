export interface CodeExecutionResult {
  id: string;
  status: string;
  output: string;
  wall_time: number;
  memory: number;
  exit_code: number;
  compare_result: string;
}
