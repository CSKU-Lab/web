import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import type { Runner } from "~/components/Editor/types/runner";
import type { CodeFile } from "~/components/Editor/types/editor";
import {
  submissionFilesAtom,
  selectedRunnerAtom,
} from "../_stores/submission.store";

function getStorageKey(
  sectionID: string,
  slug: string,
  runnerID: string,
): string {
  return `submission-files:${sectionID}:${slug}:${runnerID}`;
}

function loadFiles(
  sectionID: string,
  slug: string,
  runnerID: string,
  fallback: CodeFile[],
): CodeFile[] {
  try {
    const raw = localStorage.getItem(getStorageKey(sectionID, slug, runnerID));
    if (raw) {
      return JSON.parse(raw) as CodeFile[];
    }
  } catch {
    // ignore parse errors
  }
  return fallback;
}

function saveFiles(
  sectionID: string,
  slug: string,
  runnerID: string,
  files: CodeFile[],
): void {
  try {
    localStorage.setItem(
      getStorageKey(sectionID, slug, runnerID),
      JSON.stringify(files),
    );
  } catch {
    // ignore storage errors (e.g. private browsing quota)
  }
}

function useSubmissionFiles() {
  const { sectionID, slug } = useParams<{ sectionID: string; slug: string }>();
  const [files, setFiles] = useAtom(submissionFilesAtom);
  const [selectedRunner, setSelectedRunner] = useAtom(selectedRunnerAtom);

  /** Call this when the material first loads to auto-select the first runner. */
  function initRunner(runner: Runner): void {
    const loaded = loadFiles(sectionID, slug, runner.id, runner.initial_files);
    setSelectedRunner(runner);
    setFiles(loaded);
  }

  /** Persist current files to localStorage (call on every editor change). */
  function persistFiles(newFiles: CodeFile[]): void {
    setFiles(newFiles);
    if (selectedRunner) {
      saveFiles(sectionID, slug, selectedRunner.id, newFiles);
    }
  }

  /** Call when the student explicitly picks a different runner. */
  function handleRunnerChange(newRunner: Runner): void {
    // Save the current work under the departing runner's key.
    if (selectedRunner) {
      saveFiles(sectionID, slug, selectedRunner.id, files);
    }

    // Restore saved files for the new runner, falling back to its initial_files.
    const restored = loadFiles(
      sectionID,
      slug,
      newRunner.id,
      newRunner.initial_files,
    );
    setSelectedRunner(newRunner);
    setFiles(restored);
  }

  return {
    files,
    selectedRunner,
    initRunner,
    persistFiles,
    handleRunnerChange,
  };
}

export default useSubmissionFiles;
