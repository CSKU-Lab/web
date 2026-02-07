import { atom } from "jotai";
import { saveStatusAtom } from "./save-status.store";
import { isOwnerAtom } from "./owner.store";
import type { CodeFile } from "~/types/code-material";

const internalSolutionRunnerIDAtom = atom("");
export const initialSolutionRunnerIDAtom = atom(
  null,
  (_get, set, runnerID: string) => {
    set(internalSolutionRunnerIDAtom, runnerID);
  },
);
export const solutionRunnerIDAtom = atom(
  (get) => get(internalSolutionRunnerIDAtom),
  (get, set, newID: string) => {
    const currentLimit = get(internalSolutionRunnerIDAtom);
    if (currentLimit === newID) {
      return;
    }

    set(internalSolutionRunnerIDAtom, newID);
    const isOwner = get(isOwnerAtom);
    if (isOwner) {
      set(saveStatusAtom, "UnSaved");
    }
  },
);

const filesAtomConfig = atom<CodeFile[]>([]);

export const filesAtom = atom(
  (get) => get(filesAtomConfig),
  (_, set, files: CodeFile[]) => {
    set(filesAtomConfig, files);
  },
);
