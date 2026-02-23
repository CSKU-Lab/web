import type { CodeFile } from "~/components/Editor/types/editor";

export interface Runner {
  id: string;
  name: string;
  description?: string;
  build_script: string;
  run_script: string;
  initial_files: CodeFile[];
  created_at: string;
  updated_at: string;
}

export interface RunnerListItem {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface WriteRunner {
  name: string;
  description?: string;
  build_script: string;
  run_script: string;
  initial_files: CodeFile[];
}
