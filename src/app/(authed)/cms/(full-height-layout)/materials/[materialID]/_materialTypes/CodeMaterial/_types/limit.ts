export interface CodeMaterialLimit {
  cpu_time: number;
  cpu_extra_time: number;
  wall_time: number;
  mempry: number;
  stack: number;
  max_open_files: number;
  max_file_size: number;
  network_allow: boolean;
}
