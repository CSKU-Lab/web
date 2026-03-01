import { atom } from "jotai";

export type Tab = "Runners" | "Files" | "Solution" | "Test Cases" | "Config";
export const tabAtom = atom<Tab>("Runners");
