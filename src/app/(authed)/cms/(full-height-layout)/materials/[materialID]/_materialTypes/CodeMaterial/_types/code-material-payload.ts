import type { CodeMaterialResourceFile } from "./file";
import type { CodeMaterialLimit } from "./limit";
import type { TestCaseGroup } from "./testcase-group";

interface AllowedRunner {
  runner_id: string;
  files: { name: string; content: string }[];
}

interface Solution {
  runner_id: string;
  files: { name: string; content: string }[];
}

export interface CodeMaterialPayload {
  description: string;
  test_case_groups: TestCaseGroup[];
  allowed_runners: AllowedRunner[];
  compare_script_id: string | null;
  solution: Solution | null;
  resource_files: CodeMaterialResourceFile[];
  limit: CodeMaterialLimit | null;
  hide_test_cases?: boolean;
}
