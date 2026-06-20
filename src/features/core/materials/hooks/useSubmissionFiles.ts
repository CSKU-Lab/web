import { useAtom } from "jotai";
import type { Runner } from "~/components/Editor/types/runner";
import type { CodeFile } from "~/components/Editor/types/editor";
import {
  submissionFilesAtom,
  selectedRunnerAtom,
} from "~/features/core/materials/stores/submission.store";

function useSubmissionFiles() {
  const [files, setFiles] = useAtom(submissionFilesAtom);
  const [selectedRunner, setSelectedRunner] = useAtom(selectedRunnerAtom);

  function initRunner(runner: Runner): void {
    setSelectedRunner(runner);
    setFiles(runner.initial_files);
  }

  function persistFiles(newFiles: CodeFile[]): void {
    setFiles(newFiles);
  }

  function handleRunnerChange(newRunner: Runner): void {
    setSelectedRunner(newRunner);
    setFiles(newRunner.initial_files);
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
