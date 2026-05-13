import type { CodeFile } from "~/components/Editor/types/editor";
import { CompareConfigDetail } from "~/types/cms-compare";

/**
 * Transform API compare data to editor file format
 * Converts build_script, run_script, and files into a flat file array
 * with folder prefixes
 */
export function compareToEditorFiles(compare: CompareConfigDetail): CodeFile[] {
  const files: CodeFile[] = [
    { name: "scripts/build_script.sh", content: compare.build_script },
    { name: "scripts/run_script.sh", content: compare.run_script },
  ];

  // Add files with "sandbox/" prefix
  compare.files.forEach((file) => {
    files.push({
      name: `sandbox/${file.name}`,
      content: file.content,
    });
  });

  return files;
}

/**
 * Transform editor files back to API format
 */
export function editorFilesToComparePayload(files: CodeFile[]): {
  build_script: string;
  run_script: string;
  files: CodeFile[];
} {
  const buildScript =
    files.find((f) => f.name === "scripts/build_script.sh")?.content ?? "";
  const runScript =
    files.find((f) => f.name === "scripts/run_script.sh")?.content ?? "";

  const compareFiles = files
    .filter((f) => f.name.startsWith("sandbox/") && f.name !== "sandbox/compare_result.txt")
    .map((f) => ({
      name: f.name.replace("sandbox/", ""),
      content: f.content,
    }));

  return {
    build_script: buildScript,
    run_script: runScript,
    files: compareFiles,
  };
}

/**
 * Check if a file is a required script file that cannot be deleted
 */
export function isRequiredFile(fileName: string): boolean {
  return (
    fileName === "scripts/build_script.sh" ||
    fileName === "scripts/run_script.sh" ||
    fileName === "sandbox/compare_result.txt"
  );
}

/**
 * Check if a folder is required and cannot be deleted
 */
export function isRequiredFolder(folderName: string): boolean {
  return folderName === "scripts" || folderName === "sandbox";
}

/**
 * Check if a file is in the scripts folder
 */
export function isScriptFile(fileName: string): boolean {
  return fileName.startsWith("scripts/");
}

/**
 * Check if a file is in the files folder
 */
export function isFilesFile(fileName: string): boolean {
  return fileName.startsWith("sandbox/");
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
