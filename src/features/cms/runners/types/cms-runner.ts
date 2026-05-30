import { ConfigFile } from "~/types/cms-config";

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

export interface RunnerPaginationData {
  id: string;
  name: string;
  initial_files: ConfigFile[];
}

export interface CreateRunnerConfig {
  name: string;
  description: string;
}

export interface UpdateRunnerConfig {
  name?: string;
  description?: string;
  build_script?: string;
  run_script?: string;
  initial_files?: ConfigFile[];
}

export interface SolutionRunner {
  id: string;
  name: string;
}

export interface RunnerConfig {
  id: string;
  name: string;
  description: string;
}
