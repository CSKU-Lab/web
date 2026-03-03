import type { CodeMaterialSolutionFile } from "./file";
import type { CodeMaterialLimit } from "./limit";
import type { TestCaseGroup } from "./testcase-group";
import type { CodeMaterialResourceFile } from "./file";

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

interface CodeMaterialSolutionRunner {
  id: string;
  name: string;
}

export interface CodeMaterialResponse {
  description: string | null;
  test_case_groups: TestCaseGroup[];
  allowed_runners: CodeMaterialAllowedRunner[];
  compare_script: CodeMaterialCompareScript | null;
  solution_runner: CodeMaterialSolutionRunner | null;
  solution_files: CodeMaterialSolutionFile[];
  resource_files: CodeMaterialResourceFile[];
  limit: CodeMaterialLimit;
}
