import { atom } from "jotai";
import { saveStatusAtom } from "./save-status.store";
import { isOwnerAtom } from "./owner.store";
import type { JSONContent } from "@tiptap/react";

const internalContentAtom = atom<JSONContent | null>(null);

export const initialContentAtom = atom(
  null,
  (_get, set, content: JSONContent) => {
    set(internalContentAtom, content);
  },
);

export const contentAtom = atom(
  (get) => get(internalContentAtom),
  (get, set, newContent: JSONContent) => {
    const current = get(internalContentAtom);
    if (JSON.stringify(current) === JSON.stringify(newContent)) {
      return;
    }
    set(internalContentAtom, newContent);
    const isOwner = get(isOwnerAtom);
    if (isOwner) {
      set(saveStatusAtom, "UnSaved");
    }
  },
);
