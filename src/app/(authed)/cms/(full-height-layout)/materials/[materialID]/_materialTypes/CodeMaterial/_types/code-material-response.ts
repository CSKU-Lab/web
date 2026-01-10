import type { CodeMaterialSolutionFile } from "./file";
import type { CodeMaterialLimit } from "./limit";

interface CodeMaterialTestCaseResponse {
  order: number;
  input: string;
  output: string;
}

export interface CodeMaterialResponse {
  description: string;
  test_cases: CodeMaterialTestCaseResponse[];
  allowed_runner_ids: string[];
  compare_script_id: string | null;
  solution_runner_id: string | null;
  solution_files: CodeMaterialSolutionFile[];
  limit: CodeMaterialLimit | null;
}
