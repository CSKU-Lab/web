import CodeEditor from "~/components/Editor/CodeEditor";
import { solutionAtom } from "../../_stores/solution.store";
import { useAtom, useAtomValue } from "jotai";
import { isOwnerAtom } from "../../_stores/owner.store";
import type { CodeFile } from "~/types/code-material";
import { saveStatusAtom } from "../../_stores/save-status.store";
import { useCallback, useMemo } from "react";
import type { Runner } from "~/components/Editor/types/runner";
import { runnerTemplatesAtom } from "../RunnersTab/_stores/runner-templates.store";
import { resourceFilesAtom } from "../../_stores/resource-files.store";

function EditorSection() {
  const [solution, setSolution] = useAtom(solutionAtom);
  const [, setSaveStatus] = useAtom(saveStatusAtom);
  const isOwner = useAtomValue(isOwnerAtom);
  const runnerTemplates = useAtomValue(runnerTemplatesAtom);
  const resourceFiles = useAtomValue(resourceFilesAtom);

  const allowedRunners: Runner[] = runnerTemplates.map((rt) => ({
    id: rt.id,
    name: rt.name,
    initial_files: rt.initialFiles,
  }));

  const initialSelectedRunner = useMemo(() => {
    if (!solution?.runner) return null;
    return {
      id: solution.runner.id,
      name: solution.runner.name,
      initial_files: [],
    };
  }, [solution?.runner]);

  const resourceFileNames = useMemo(
    () => new Set(resourceFiles.map((f) => f.name)),
    [resourceFiles],
  );

  const solutionFileNames = useMemo(
    () => new Set((solution?.files ?? []).map((f) => f.name)),
    [solution?.files],
  );

  const isReadonlyFile = useCallback(
    (name: string) => resourceFileNames.has(name),
    [resourceFileNames],
  );

  const isRequiredFile = useCallback(
    (name: string) => !resourceFileNames.has(name) && solutionFileNames.has(name),
    [resourceFileNames, solutionFileNames],
  );

  const combinedFiles = useMemo(() => {
    const resourceFilesWithReadonly: CodeFile[] = resourceFiles.map((f) => ({
      ...f,
      readonly: true,
    }));
    return [...(solution?.files ?? []), ...resourceFilesWithReadonly];
  }, [solution?.files, resourceFiles]);

  const handleFilesChange = useCallback(
    (newFiles: CodeFile[]) => {
      const solutionFiles = newFiles.filter((f) => !resourceFileNames.has(f.name));
      setSolution(solution ? { ...solution, files: solutionFiles } : null);
      if (isOwner) setSaveStatus("UnSaved");
    },
    [setSolution, setSaveStatus, isOwner, resourceFileNames, solution],
  );

  const handleOnChangeSelectedRunner = useCallback(
    (runner: Runner) => {
      const files = solution?.runner.id === runner.id
        ? (solution?.files ?? [])
        : runner.initial_files;
      setSolution({ runner: { id: runner.id, name: runner.name }, files });
      if (isOwner) setSaveStatus("UnSaved");
    },
    [setSolution, setSaveStatus, isOwner, solution],
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
