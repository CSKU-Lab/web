import { atom } from "jotai";

interface CommandPaletteStore {
  isOpen: boolean;
}

export const commandPaletteAtom = atom<CommandPaletteStore>({ isOpen: false });
