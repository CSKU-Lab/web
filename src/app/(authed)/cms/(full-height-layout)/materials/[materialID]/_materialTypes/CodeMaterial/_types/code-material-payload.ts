import type { CodeMaterialSolutionFile } from "./file";
import type { CodeMaterialLimit } from "./limit";
import type { TestCaseGroup } from "./testcase-group";

export interface CodeMaterialPayload {
  description: string;
  test_case_groups: TestCaseGroup[];
  allowed_runner_ids: string[];
  compare_script_id: string | null;
  solution_runner_id: string | null;
  solution_files: CodeMaterialSolutionFile[];
  limit: CodeMaterialLimit | null;
}
