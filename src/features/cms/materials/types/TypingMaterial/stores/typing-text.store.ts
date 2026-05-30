import { atom } from "jotai";

type SaveStatus = "UnSaved" | "Saved" | "Saving" | "SaveFailed" | "Offline";
export type TypingView = "editor" | "preview";

export const typingTextAtom = atom<string>("");
export const saveStatusAtom = atom<SaveStatus>("Saved");
export const viewAtom = atom<TypingView>("editor");
