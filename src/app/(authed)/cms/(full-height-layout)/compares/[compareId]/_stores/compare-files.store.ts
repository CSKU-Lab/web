import { atom } from "jotai";
import type { CodeFile } from "~/components/Editor/types/editor";

// All files in the compare editor (scripts + files)
// Files are stored with their full path: "scripts/build.sh", "scripts/run.sh", "files/main.py"
export const compareFilesAtom = atom<CodeFile[]>([]);

// Derived atom for script files only
export const scriptFilesAtom = atom((get) =>
  get(compareFilesAtom).filter((f) => f.name.startsWith("scripts/"))
);

// Derived atom for files only
export const filesAtom = atom((get) =>
  get(compareFilesAtom).filter((f) => f.name.startsWith("files/"))
);

// Get build script content
export const buildScriptAtom = atom((get) => {
  const files = get(compareFilesAtom);
  return files.find((f) => f.name === "scripts/build_script.sh")?.content ?? "";
});

// Get run script content
export const runScriptAtom = atom((get) => {
  const files = get(compareFilesAtom);
  return files.find((f) => f.name === "scripts/run_script.sh")?.content ?? "";
});

// Get files without the "files/" prefix
export const filesWithoutPrefixAtom = atom((get) => {
  const files = get(filesAtom);
  return files.map((f) => ({
    name: f.name.replace("files/", ""),
    content: f.content,
  }));
});
