import { atom } from "jotai";
import type { CodeFile } from "~/components/Editor/types/editor";

// All files in the runner editor (scripts + initial files)
// Files are stored with their full path: "scripts/build.sh", "scripts/run.sh", "initial/main.py"
export const runnerFilesAtom = atom<CodeFile[]>([]);

// Derived atom for script files only
export const scriptFilesAtom = atom((get) =>
  get(runnerFilesAtom).filter((f) => f.name.startsWith("scripts/"))
);

// Derived atom for initial files only
export const initialFilesAtom = atom((get) =>
  get(runnerFilesAtom).filter((f) => f.name.startsWith("initial/"))
);

// Get build script content
export const buildScriptAtom = atom((get) => {
  const files = get(runnerFilesAtom);
  return files.find((f) => f.name === "scripts/build.sh")?.content ?? "";
});

// Get run script content
export const runScriptAtom = atom((get) => {
  const files = get(runnerFilesAtom);
  return files.find((f) => f.name === "scripts/run.sh")?.content ?? "";
});

// Get initial files without the "initial/" prefix
export const initialFilesWithoutPrefixAtom = atom((get) => {
  const files = get(initialFilesAtom);
  return files.map((f) => ({
    name: f.name.replace("initial/", ""),
    content: f.content,
  }));
});
