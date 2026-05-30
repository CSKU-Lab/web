import type { CodeFile } from "~/components/Editor/types/editor";
import { RunnerConfigDetail } from "~/types/cms-runner";

/**
 * Transform API runner data to editor file format
 * Converts build_script, run_script, and initial_files into a flat file array
 * with folder prefixes
 */
export function runnerToEditorFiles(runner: RunnerConfigDetail): CodeFile[] {
  const files: CodeFile[] = [
    { name: "scripts/build_script.sh", content: runner.build_script },
    { name: "scripts/run_script.sh", content: runner.run_script },
  ];

  // Add initial files with "initial/" prefix
  runner.initial_files.forEach((file) => {
    files.push({
      name: `initial/${file.name}`,
      content: file.content,
    });
  });

  return files;
}

/**
 * Transform editor files back to API format
 */
export function editorFilesToRunnerPayload(files: CodeFile[]): {
  build_script: string;
  run_script: string;
  initial_files: CodeFile[];
} {
  const buildScript =
    files.find((f) => f.name === "scripts/build_script.sh")?.content ?? "";
  const runScript =
    files.find((f) => f.name === "scripts/run_script.sh")?.content ?? "";

  const initialFiles = files
    .filter((f) => f.name.startsWith("initial/"))
    .map((f) => ({
      name: f.name.replace("initial/", ""),
      content: f.content,
    }));

  return {
    build_script: buildScript,
    run_script: runScript,
    initial_files: initialFiles,
  };
}

/**
 * Check if a file is a required script file that cannot be deleted
 */
export function isRequiredFile(fileName: string): boolean {
  return (
    fileName === "scripts/build_script.sh" ||
    fileName === "scripts/run_script.sh"
  );
}

/**
 * Check if a folder is required and cannot be deleted
 */
export function isRequiredFolder(folderName: string): boolean {
  return folderName === "scripts" || folderName === "initial";
}

/**
 * Check if a file is in the scripts folder
 */
export function isScriptFile(fileName: string): boolean {
  return fileName.startsWith("scripts/");
}

/**
 * Check if a file is in the initial folder
 */
export function isInitialFile(fileName: string): boolean {
  return fileName.startsWith("initial/");
}

/**
 * Get the folder name from a file path
 */
export function getFolderName(fileName: string): string | null {
  const parts = fileName.split("/");
  if (parts.length > 1) {
    return parts[0];
  }
  return null;
}

/**
 * Get display name (without folder prefix)
 */
export function getDisplayName(fileName: string): string {
  const parts = fileName.split("/");
  return parts[parts.length - 1];
}
