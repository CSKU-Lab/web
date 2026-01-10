import { atom } from "jotai";
import { saveStatusAtom } from "./save-status.store";

interface CodeMaterialSolutionFile {
  name: string;
  content: string;
}

interface EditorStore {
  input: string;
  output: string;
}

const playgroundAtomConfig = atom<EditorStore>({
  input: "",
  output: "",
});

export const playgroundAtom = atom(
  (get) => {
    const { input, output } = get(playgroundAtomConfig);
    return { input, output };
  },
  (get, set, update: { type: "input" | "output"; value: string }) => {
    const current = get(playgroundAtomConfig);
    if (update.type === "input") {
      set(playgroundAtomConfig, { ...current, input: update.value });
    } else if (update.type === "output") {
      set(playgroundAtomConfig, { ...current, output: update.value });
    }
  },
);

const internalCodeAtom = atom("");

export const initialCodeAtom = atom(null, (_get, set, code: string) => {
  set(internalCodeAtom, code);
});

export const codeAtom = atom(
  (get) => get(internalCodeAtom),
  (get, set, newCode: string) => {
    const currentCode = get(internalCodeAtom);
    if (currentCode === newCode) {
      return;
    }

    set(internalCodeAtom, newCode);
    set(saveStatusAtom, "UnSaved");
  },
);

export const runnerAtom = atom("");
export const errorAtom = atom<"NO_RUNNER" | null>(null);

const filesAtomConfig = atom<CodeMaterialSolutionFile[]>([
  { name: "main.go", content: "" },
]);

export const filesAtom = atom(
  (get) => get(filesAtomConfig),
  (get, set, files: CodeMaterialSolutionFile[]) => {
    set(filesAtomConfig, files);
  },
);

const selectedFileAtomConfig = atom<string | null>("main.go");

export const selectedFileAtom = atom(
  (get) => get(selectedFileAtomConfig),
  (get, set, fileName: string) => {
    set(selectedFileAtomConfig, fileName);
  },
);
