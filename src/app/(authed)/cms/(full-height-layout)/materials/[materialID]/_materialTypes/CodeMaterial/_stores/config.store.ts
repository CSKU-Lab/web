import { atom } from "jotai";
import { saveStatusAtom } from "./save-status.store";

interface AllowedRunner {
  id: string;
  name: string;
  build_script: string;
  run_script: string;
}

interface CompareScript {
  id: string;
  name: string;
}

interface ConfigAtom {
  allowedRunners: AllowedRunner[];
  compareScript: CompareScript;
  cpuTime: number;
  cpuExtraTime: number;
  wallTime: number;
  memory: number;
  stack: number;
  maxOpenFiles: number;
  maxFileSizes: number;
  allowNetwork: boolean;
}

const internalConfigAtom = atom<ConfigAtom | null>(null);

export const configAtom = atom(
  (get) => get(internalConfigAtom),
  (get, set, newConfig: ConfigAtom) => {
    const currentConfig = get(internalConfigAtom);
    if (JSON.stringify(currentConfig) === JSON.stringify(newConfig)) {
      return;
    }

    set(internalConfigAtom, newConfig);
    set(saveStatusAtom, "UnSaved");
  },
);

const internalAllowedRunnersAtom = atom<AllowedRunner[]>([]);
export const allowedRunnersAtom = atom(
  (get) => get(internalAllowedRunnersAtom),
  (get, set, newAllowedRunners: AllowedRunner[]) => {
    const currentAllowedRunners = get(internalAllowedRunnersAtom);
    if (
      JSON.stringify(currentAllowedRunners) ===
      JSON.stringify(newAllowedRunners)
    ) {
      return;
    }

    set(internalAllowedRunnersAtom, newAllowedRunners);
    set(saveStatusAtom, "UnSaved");
  },
);

const internalCompareScriptAtom = atom<CompareScript | null>(null);
export const compareScriptAtom = atom(
  (get) => get(internalCompareScriptAtom),
  (get, set, newCompareScript: CompareScript | null) => {
    const currentCompareScript = get(internalCompareScriptAtom);
    if (
      JSON.stringify(currentCompareScript) === JSON.stringify(newCompareScript)
    ) {
      return;
    }

    set(internalCompareScriptAtom, newCompareScript);
    set(saveStatusAtom, "UnSaved");
  },
);
