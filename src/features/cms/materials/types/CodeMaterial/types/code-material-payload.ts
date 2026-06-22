import type { CodeMaterialResourceFile } from "~/features/cms/materials/types/CodeMaterial/types/file";
import type { CodeMaterialLimit } from "~/features/cms/materials/types/CodeMaterial/types/limit";
import type { TestCaseGroup } from "~/features/cms/materials/types/CodeMaterial/types/testcase-group";

interface AllowedRunner {
  runner_id: string;
  files: { name: string; content: string; segments?: { content: string; type: string }[] }[];
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
  limits: CodeMaterialLimit | null;
  hide_test_cases?: boolean;
}
