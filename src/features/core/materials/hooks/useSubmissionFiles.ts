import { useAtom, useSetAtom } from "jotai";
import type { Runner } from "~/components/Editor/types/runner";
import type { CodeFile } from "~/components/Editor/types/editor";
import {
  submissionFilesAtom,
  submissionTemplateFilesAtom,
  selectedRunnerAtom,
} from "~/features/core/materials/stores/submission.store";
import { templateFileToCodeFile } from "~/components/Editor/utils/segments";

function useSubmissionFiles() {
  const [files, setFiles] = useAtom(submissionFilesAtom);
  const [selectedRunner, setSelectedRunner] = useAtom(selectedRunnerAtom);
  const setTemplateFiles = useSetAtom(submissionTemplateFilesAtom);

  function initRunner(runner: Runner): void {
    setSelectedRunner(runner);
    setTemplateFiles(runner.initial_files);
    setFiles(runner.initial_files.map(templateFileToCodeFile));
  }

  function persistFiles(newFiles: CodeFile[]): void {
    setFiles(newFiles);
  }

  function handleRunnerChange(newRunner: Runner): void {
    setSelectedRunner(newRunner);
    setTemplateFiles(newRunner.initial_files);
    setFiles(newRunner.initial_files.map(templateFileToCodeFile));
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
