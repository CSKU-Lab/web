import { ConfigFile } from "~/types/cms-config";

export interface CompareConfig {
  id: string;
  name: string;
  description: string;
}

export interface CompareConfigDetail {
  id: string;
  name: string;
  description: string;
  build_script: string;
  run_script: string;
  run_name: string;
  files: ConfigFile[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateCompareConfig {
  name: string;
  description: string;
  build_script: string;
  run_script: string;
  run_name: string;
  files?: ConfigFile[];
}

export interface UpdateCompareConfig {
  name?: string;
  description?: string;
  build_script?: string;
  run_script?: string;
  run_name?: string;
  files?: ConfigFile[];
}
