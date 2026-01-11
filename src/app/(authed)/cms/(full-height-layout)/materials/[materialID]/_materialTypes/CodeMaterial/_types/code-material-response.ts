import type { CodeMaterialSolutionFile } from "./file";
import type { CodeMaterialLimit } from "./limit";

interface CodeMaterialTestCaseResponse {
  order: number;
  input: string;
  output: string;
}

interface CodeMaterialAllowedRunner {
  id: string;
  name: string;
  run_script: string;
  build_script: string;
}

interface CodeMaterialCompareScript {
  id: string;
  name: string;
}

export interface CodeMaterialResponse {
  description: string | null;
  test_cases: CodeMaterialTestCaseResponse[];
  allowed_runners: CodeMaterialAllowedRunner[];
  compare_script: CodeMaterialCompareScript | null;
  solution_runner_id: string | null;
  solution_files: CodeMaterialSolutionFile[];
  limit: CodeMaterialLimit;
}
