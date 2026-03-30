import { atom } from "jotai";

export type SaveStatus = "Saved" | "UnSaved" | "Saving" | "SaveFailed";

export const saveStatusAtom = atom<SaveStatus>("Saved");
