import { atom } from "jotai";

type MaterialStatus = "UnSaved" | "Saved" | "Saving" | "SaveFailed" | "Offline";

export const saveStatusAtom = atom<MaterialStatus>("Saved");
