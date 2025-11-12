import { atom } from "jotai";

interface EditorStore {
  input: string;
  output: string;
}

export const playgroundAtom = atom<EditorStore>({
  input: "",
  output: "",
});

export const playgroundStore = atom(
  (get) => {
    const { input, output } = get(playgroundAtom);
    return { input, output };
  },
  (get, set, update: { type: "input" | "output"; value: string }) => {
    const current = get(playgroundAtom);
    if (update.type === "input") {
      set(playgroundAtom, { ...current, input: update.value });
    } else if (update.type === "output") {
      set(playgroundAtom, { ...current, output: update.value });
    }
  },
);

export const codeStore = atom("");
export const runnerStore = atom("");
