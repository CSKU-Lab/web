import type { CodeMaterialSolutionFile } from "./file";
import type { CodeMaterialLimit } from "./limit";

interface CodeMaterialTestCase {
  order: number;
  input: string;
}

export interface CodeMaterialPayload {
  description: string;
  test_cases: CodeMaterialTestCase[];
  allowed_runner_ids: string[];
  compare_script_id: string | null;
  solution_runner_id: string | null;
  solution_files: CodeMaterialSolutionFile[];
  limit: CodeMaterialLimit | null;
}
