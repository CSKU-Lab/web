import { atom } from "jotai";
import { saveStatusAtom } from "~/features/cms/materials/types/CodeMaterial/stores/save-status.store";
import { isOwnerAtom } from "~/features/cms/materials/types/CodeMaterial/stores/owner.store";
import type { CodeFile } from "~/types/code-material";
import type { SolutionRunner } from "~/types/cms-runner";

export interface Solution {
  runner: SolutionRunner;
  files: CodeFile[];
}

const internalSolutionAtom = atom<Solution | null>(null);

export const initialSolutionAtom = atom(
  null,
  (_get, set, solution: Solution | null) => {
    set(internalSolutionAtom, solution);
  },
);

export const solutionAtom = atom(
  (get) => get(internalSolutionAtom),
  (get, set, next: Solution | null) => {
    const current = get(internalSolutionAtom);
    if (
      current?.runner.id === next?.runner.id &&
      JSON.stringify(current?.files) === JSON.stringify(next?.files)
    ) {
      return;
    }

    set(internalSolutionAtom, next);
    if (get(isOwnerAtom)) {
      set(saveStatusAtom, "UnSaved");
    }
  },
);
