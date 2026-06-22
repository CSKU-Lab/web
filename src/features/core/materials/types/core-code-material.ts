export interface CoreCodeMaterial {
  description: string;
  allowed_runners: AllowedRunner[];
  resource_files: CoreCodeResourceFile[];
  limits: CodeMaterialLimits;
}

export interface RunnerFileSegment {
  content: string;
  type: string;
}

export interface AllowedRunner {
  id: string;
  name: string;
  files: { name: string; content: string; segments?: RunnerFileSegment[] }[];
}

export interface CoreCodeResourceFile {
  name: string;
  content: string;
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
