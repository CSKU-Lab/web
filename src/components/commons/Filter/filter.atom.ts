import { atom } from "jotai";
import type { IFilter } from "~/types/filter";

export const filterAtom = atom<IFilter[]>([]);
