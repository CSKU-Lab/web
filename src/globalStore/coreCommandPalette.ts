import { atom } from "jotai";

interface CoreCommandPaletteStore {
  isOpen: boolean;
}

export const coreCommandPaletteAtom = atom<CoreCommandPaletteStore>({ isOpen: false });
