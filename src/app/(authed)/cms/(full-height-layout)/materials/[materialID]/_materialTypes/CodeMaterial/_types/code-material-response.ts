import type { CodeMaterialLimit } from "./limit";
import type { TestCaseGroup } from "./testcase-group";
import type { CodeMaterialResourceFile } from "./file";

interface CodeMaterialAllowedRunner {
  id: string;
  name: string;
  build_script: string;
  run_script: string;
  files: { name: string; content: string }[];
}

interface CodeMaterialCompareScript {
  id: string;
  name: string;
}

interface CodeMaterialSolution {
  id: string;
  name: string;
  files: { name: string; content: string }[];
}

export interface CodeMaterialResponse {
  description: string | null;
  test_case_groups: TestCaseGroup[];
  allowed_runners: CodeMaterialAllowedRunner[];
  compare_script: CodeMaterialCompareScript | null;
  solution: CodeMaterialSolution | null;
  resource_files: CodeMaterialResourceFile[];
  limit: CodeMaterialLimit;
  hide_test_cases?: boolean;
}
