import { atom } from "jotai";

export type Tab = "Editor" | "Test Cases" | "Config";
export const tabAtom = atom<Tab>("Editor");
