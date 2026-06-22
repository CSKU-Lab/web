import type { CodeMaterialLimit } from "~/features/cms/materials/types/CodeMaterial/types/limit";
import type { TestCaseGroup } from "~/features/cms/materials/types/CodeMaterial/types/testcase-group";
import type { CodeMaterialResourceFile } from "~/features/cms/materials/types/CodeMaterial/types/file";

interface CodeMaterialAllowedRunner {
  id: string;
  name: string;
  build_script: string;
  run_script: string;
  files: { name: string; content: string; segments?: { content: string; type: string }[] }[];
}

interface CodeMaterialCompareScript {
  id: string;
  name: string;
}

interface CodeMaterialSolutionRunner {
  id: string;
  name: string;
}

interface CodeMaterialSolution {
  runner: CodeMaterialSolutionRunner;
  files: { name: string; content: string }[];
}

export interface CodeMaterialResponse {
  description: string | null;
  test_case_groups: TestCaseGroup[];
  allowed_runners: CodeMaterialAllowedRunner[];
  compare_script: CodeMaterialCompareScript | null;
  solution: CodeMaterialSolution | null;
  resource_files: CodeMaterialResourceFile[];
  limits: CodeMaterialLimit;
  hide_test_cases?: boolean;
}
