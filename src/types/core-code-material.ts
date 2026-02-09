export interface CoreCodeMaterial {
  description: string;
  allowed_runners: AllowedRunner[];
  limits: CodeMaterialLimits;
}

export interface AllowedRunner {
  id: string;
  name: string;
}

export interface CodeMaterialLimits {
  cpu_time: number;
  cpu_extra_time: number;
  wall_time: number;
  memory: number;
  stack: number;
  max_open_files: number;
  max_file_size: number;
  network_allow: boolean;
}
