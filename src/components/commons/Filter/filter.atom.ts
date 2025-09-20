import { atom } from "jotai";
import type { Filter } from "~/types/filter";

export const filterAtom = atom<Filter[]>([]);
