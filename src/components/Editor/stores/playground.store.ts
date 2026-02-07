import { atom } from "jotai";

interface PlaygroundAtom {
  input: string;
  output: string;
}

const playgroundAtomConfig = atom<PlaygroundAtom>({
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
