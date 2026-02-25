import { atom } from "jotai";
import { saveStatusAtom } from "./save-status.store";
import { isOwnerAtom } from "./owner.store";
import type { CodeFile } from "~/types/code-material";
import type { Runner } from "~/components/Editor/types/runner";
import { SolutionRunner } from "~/types/cms-runner";

const internalSolutionRunnerAtom = atom<SolutionRunner | null>(null);
export const initialSolutionRunnerAtom = atom(
  null,
  (_get, set, runner: SolutionRunner | null) => {
    set(internalSolutionRunnerAtom, runner);
  },
);
export const solutionRunnerAtom = atom(
  (get) => get(internalSolutionRunnerAtom),
  (get, set, newRunner: Runner) => {
    const currentRunner = get(internalSolutionRunnerAtom);
    if (currentRunner?.id === newRunner.id) {
      return;
    }

    set(internalSolutionRunnerAtom, newRunner);
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
