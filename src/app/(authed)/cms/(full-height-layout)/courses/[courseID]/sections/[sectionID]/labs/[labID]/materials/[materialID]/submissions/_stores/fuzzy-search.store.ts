import { atom } from "jotai";

export const fuzzySearchOpenAtom = atom<boolean>(false);

export const fuzzySearchQueryAtom = atom<string>("");
