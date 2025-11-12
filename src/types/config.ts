export interface RunnerConfigDetail {
  id: string;
  name: string;
  build_script: string;
  run_script: string;
}

export interface RunnerConfig {
  id: string;
  name: string;
}

export interface CompareScriptConfig {
  id: string;
  name: string;
}

// will be right back later
export interface CompareScriptDetail {
  id: string;
  name: string;
}
