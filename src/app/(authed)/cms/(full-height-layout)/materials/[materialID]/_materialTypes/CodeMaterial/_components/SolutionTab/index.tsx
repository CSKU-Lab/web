import CodeEditor from "~/components/Editor/CodeEditor";
import { filesAtom, solutionRunnerAtom } from "../../_stores/editor.store";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { isOwnerAtom } from "../../_stores/owner.store";
import type { CodeFile } from "~/types/code-material";
import { saveStatusAtom } from "../../_stores/save-status.store";
import { useCallback, useMemo } from "react";
import type { Runner } from "~/components/Editor/types/runner";
import { runnerTemplatesAtom } from "../RunnersTab/_stores/runner-templates.store";
import { resourceFilesAtom } from "../../_stores/resource-files.store";

function EditorSection() {
  const [files, setFiles] = useAtom(filesAtom);
  const setSaveStatus = useSetAtom(saveStatusAtom);
  const isOwner = useAtomValue(isOwnerAtom);
  const [selectedRunner, setSelectedRunner] = useAtom(solutionRunnerAtom);
  const runnerTemplates = useAtomValue(runnerTemplatesAtom);
  const resourceFiles = useAtomValue(resourceFilesAtom);

  const allowedRunners: Runner[] = runnerTemplates.map((rt) => ({
    id: rt.id,
    name: rt.name,
    initial_files: rt.initialFiles,
  }));

  const initialSelectedRunner = useMemo(() => {
    if (!selectedRunner) return null;
    const matchedTemplate = runnerTemplates.find((rt) => rt.id === selectedRunner.id);
    if (matchedTemplate) {
      return {
        id: matchedTemplate.id,
        name: matchedTemplate.name,
        initial_files: matchedTemplate.initialFiles,
      };
    }
    return {
      id: selectedRunner.id,
      name: selectedRunner.name,
      initial_files: [],
    };
  }, [selectedRunner, runnerTemplates]);

  const resourceFileNames = useMemo(
    () => new Set(resourceFiles.map((f) => f.name)),
    [resourceFiles],
  );

  const runnerFileNames = useMemo(
    () => new Set(files.map((f) => f.name)),
    [files],
  );

  const isReadonlyFile = useCallback(
    (name: string) => resourceFileNames.has(name),
    [resourceFileNames],
  );

  const isRequiredFile = useCallback(
    (name: string) => !resourceFileNames.has(name) && runnerFileNames.has(name),
    [resourceFileNames, runnerFileNames],
  );

  const combinedFiles = useMemo(() => {
    const resourceFilesWithReadonly: CodeFile[] = resourceFiles.map((f) => ({
      ...f,
      readonly: true,
    }));
    return [...files, ...resourceFilesWithReadonly];
  }, [files, resourceFiles]);

  const handleFilesChange = useCallback(
    (newFiles: CodeFile[]) => {
      const solutionFiles = newFiles.filter(
        (f) => !resourceFileNames.has(f.name)
      );
      setFiles(solutionFiles);
      if (isOwner) {
        setSaveStatus("UnSaved");
      }
    },
    [setFiles, setSaveStatus, isOwner, resourceFileNames],
  );

  const handleOnChangeSelectedRunner = useCallback(
    (runner: Runner) => {
      setSelectedRunner(runner);
      console.log(runner);
      if (isOwner) {
        setSaveStatus("UnSaved");
        setFiles(
          runner.initial_files.map((file) => ({
            ...file,
            readonly: true,
          })),
        );
      }
    },
    [setSelectedRunner, setSaveStatus, setFiles, isOwner],
  );

  return (
    <CodeEditor
      files={combinedFiles}
      onFilesChange={handleFilesChange}
      permissions={{
        writeFiles: isOwner,
        modifyFiles: isOwner,
        codeExecution: isOwner,
        selectRunner: isOwner,
      }}
      allowedRunners={allowedRunners}
      initialSelectedRunner={initialSelectedRunner}
      onChangeSelectedRunner={handleOnChangeSelectedRunner}
      isReadonlyFile={isReadonlyFile}
      isRequiredFile={isRequiredFile}
    />
  );
}

export default EditorSection;
