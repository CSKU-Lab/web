import { atom } from "jotai";
import { saveStatusAtom } from "./save-status.store";
import { isOwnerAtom } from "./owner.store";
import type { Editor, JSONContent } from "@tiptap/react";

const internalDescriptionAtom = atom<JSONContent | null>(null);

export const editorAtom = atom<Editor | null>(null);

export const initialDescriptionAtom = atom(
  null,
  (_get, set, description: JSONContent) => {
    set(internalDescriptionAtom, description);
  },
);

export const descriptionAtom = atom(
  (get) => get(internalDescriptionAtom),
  (get, set, newDescription: JSONContent) => {
    const currentDescription = get(internalDescriptionAtom);
    if (JSON.stringify(currentDescription) === JSON.stringify(newDescription)) {
      return;
    }
    set(internalDescriptionAtom, newDescription);
    const isOwner = get(isOwnerAtom);
    if (isOwner) {
      set(saveStatusAtom, "UnSaved");
    }
  },
);
