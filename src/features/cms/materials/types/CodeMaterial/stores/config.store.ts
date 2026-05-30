import { atom } from "jotai";
import { saveStatusAtom } from "~/features/cms/materials/types/CodeMaterial/stores/save-status.store";
import { isOwnerAtom } from "~/features/cms/materials/types/CodeMaterial/stores/owner.store";
import type { CodeMaterialLimit } from "~/features/cms/materials/types/CodeMaterial/types/limit";

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

const internalAllowedRunnersAtom = atom<AllowedRunner[]>([]);
export const initialAllowedRunnersAtom = atom(
  null,
  (_get, set, allowedRunners: AllowedRunner[]) => {
    set(internalAllowedRunnersAtom, allowedRunners);
  },
);
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
    const isOwner = get(isOwnerAtom);
    if (isOwner) {
      set(saveStatusAtom, "UnSaved");
    }
  },
);

const internalCompareScriptAtom = atom<CompareScript | null>(null);
export const initialCompareScriptAtom = atom(
  null,
  (_get, set, compareScript: CompareScript | null) => {
    set(internalCompareScriptAtom, compareScript);
  },
);
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
    const isOwner = get(isOwnerAtom);
    if (isOwner) {
      set(saveStatusAtom, "UnSaved");
    }
  },
);

const internalLimitAtom = atom<CodeMaterialLimit>({
  cpu_time: 0,
  cpu_extra_time: 0,
  wall_time: 0,
  memory: 0,
  stack: 0,
  max_open_files: 0,
  max_file_size: 0,
  network_allow: false,
});
export const initialLimitAtom = atom(
  null,
  (_get, set, limit: CodeMaterialLimit) => {
    set(internalLimitAtom, limit);
  },
);
export const limitAtom = atom(
  (get) => get(internalLimitAtom),
  (get, set, newLimit: CodeMaterialLimit) => {
    const currentLimit = get(internalLimitAtom);
    if (JSON.stringify(currentLimit) === JSON.stringify(newLimit)) {
      return;
    }

    set(internalLimitAtom, newLimit);
    const isOwner = get(isOwnerAtom);
    if (isOwner) {
      set(saveStatusAtom, "UnSaved");
    }
  },
);
