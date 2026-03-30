import { atom } from "jotai";
import type { RunnerConfig } from "~/types/cms-runner";

// Selected runners for comparison
export const leftRunnerAtom = atom<RunnerConfig | null>(null);
export const rightRunnerAtom = atom<RunnerConfig | null>(null);

// Search queries for runner selection
export const leftSearchAtom = atom<string>("");
export const rightSearchAtom = atom<string>("");
