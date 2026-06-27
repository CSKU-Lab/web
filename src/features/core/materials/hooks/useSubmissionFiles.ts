import { useAtom, useSetAtom } from "jotai";
import type { Runner } from "~/components/Editor/types/runner";
import type { CodeFile } from "~/components/Editor/types/editor";
import {
  submissionFilesAtom,
  submissionFilesEpochAtom,
  submissionTemplateFilesAtom,
  selectedRunnerAtom,
} from "~/features/core/materials/stores/submission.store";
import { templateFileToCodeFile } from "~/components/Editor/utils/segments";

function useSubmissionFiles() {
  const [files, setFiles] = useAtom(submissionFilesAtom);
  const [filesEpoch, setFilesEpoch] = useAtom(submissionFilesEpochAtom);
  const [selectedRunner, setSelectedRunner] = useAtom(selectedRunnerAtom);
  const setTemplateFiles = useSetAtom(submissionTemplateFilesAtom);

  function initRunner(runner: Runner): void {
    setSelectedRunner(runner);
    setTemplateFiles(runner.initial_files);
    setFiles(runner.initial_files.map(templateFileToCodeFile));
    setFilesEpoch((e) => e + 1);
  }

  // Keystroke-driven update — must not bump the epoch (no remount mid-typing).
  function persistFiles(newFiles: CodeFile[]): void {
    setFiles(newFiles);
  }

  function handleRunnerChange(newRunner: Runner): void {
    setSelectedRunner(newRunner);
    setTemplateFiles(newRunner.initial_files);
    setFiles(newRunner.initial_files.map(templateFileToCodeFile));
    setFilesEpoch((e) => e + 1);
  }

  return {
    files,
    filesEpoch,
    selectedRunner,
    initRunner,
    persistFiles,
    handleRunnerChange,
  };
}

export default useSubmissionFiles;
