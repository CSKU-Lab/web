import { atom } from "jotai";
import { saveStatusAtom } from "./save-status.store";
import { isOwnerAtom } from "./owner.store";
import type { CodeMaterialResourceFile } from "../_types/file";

const internalResourceFilesAtom = atom<CodeMaterialResourceFile[]>([]);

export const initialResourceFilesAtom = atom(
  null,
  (_get, set, files: CodeMaterialResourceFile[]) => {
    set(internalResourceFilesAtom, files);
  },
);

export const resourceFilesAtom = atom(
  (get) => get(internalResourceFilesAtom),
  (get, set, files: CodeMaterialResourceFile[]) => {
    set(internalResourceFilesAtom, files);
    const isOwner = get(isOwnerAtom);
    if (isOwner) {
      set(saveStatusAtom, "UnSaved");
    }
  },
);
