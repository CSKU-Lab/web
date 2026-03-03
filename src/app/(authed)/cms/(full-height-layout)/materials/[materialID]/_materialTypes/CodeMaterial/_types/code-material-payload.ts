import type { CodeMaterialSolutionFile, CodeMaterialResourceFile } from "./file";
import type { CodeMaterialLimit } from "./limit";
import type { TestCaseGroup } from "./testcase-group";
import type { RunnerTemplatePayload } from "../_components/RunnersTab/_types/runner-template";

export interface CodeMaterialPayload {
  description: string;
  test_case_groups: TestCaseGroup[];
  allowed_runner_ids: string[];
  allowed_runner_templates: RunnerTemplatePayload[];
  compare_script_id: string | null;
  solution_runner_id: string | null;
  solution_files: CodeMaterialSolutionFile[];
  resource_files: CodeMaterialResourceFile[];
  limit: CodeMaterialLimit | null;
}
