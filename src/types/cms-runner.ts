import { ConfigFile } from "./cms-config";

export interface RunnerConfigDetail {
  id: string;
  name: string;
  description: string;
  build_script: string;
  run_script: string;
  initial_files: ConfigFile[];
  created_at: string;
  updated_at: string;
}

export interface UpdateRunnerConfig {
  name?: string;
  description?: string;
  build_script?: string;
  run_script?: string;
  initial_files?: ConfigFile[];
}

export interface RunnerConfig {
  id: string;
  name: string;
  description: string;
}
