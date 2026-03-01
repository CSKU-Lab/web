import type { CodeFile } from "~/components/Editor/types/editor";

export interface RunnerTemplate {
  id: string;
  name: string;
  description?: string;
  buildScript: string;
  runScript: string;
  initialFiles: CodeFile[];
}

export interface RunnerTemplatePayload {
  runner_id: string;
  build_script: string;
  run_script: string;
  initial_files: { name: string; content: string }[];
}
