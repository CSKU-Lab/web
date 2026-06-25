"use client";

import CodeEditor from "~/components/Editor/CodeEditor";
import { solutionAtom } from "~/features/cms/materials/types/CodeMaterial/stores/solution.store";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { isOwnerAtom } from "~/features/cms/materials/types/CodeMaterial/stores/owner.store";
import type { CodeFile } from "~/types/code-material";
import { saveStatusAtom } from "~/features/cms/materials/types/CodeMaterial/stores/save-status.store";
import { useCallback, useMemo } from "react";
import type { Runner } from "~/components/Editor/types/runner";
import { templateFileToCodeFile } from "~/components/Editor/utils/segments";
import {
  runnerTemplatesAtom,
  runnerChangedSinceLoadAtom,
} from "~/features/cms/materials/types/CodeMaterial/components/RunnersTab/stores/runner-templates.store";
import { resourceFilesAtom } from "~/features/cms/materials/types/CodeMaterial/stores/resource-files.store";
import { RefreshCw, X } from "lucide-react";
import { Button } from "~/components/commons/Button";
import type { TemplateFile } from "~/components/Editor/types/editor";

/**
 * Given the current solution files and the new runner template's initial files,
 * produce an updated set of solution files applying the new templates.
 *
 * Backup logic for initial files:
 *   - If the solution already has a file with the same name, and its content
 *     differs from the new template's flattened content, save a backup as
 *     "<filename>.bak" before overwriting.
 *   - Scripts (buildScript / runScript) do not appear in the solution files
 *     directly, so no handling needed here.
 */
function applyRunnerFilesWithBackup(
  currentFiles: CodeFile[],
  newInitialFiles: TemplateFile[],
): CodeFile[] {
  const result: CodeFile[] = [...currentFiles];

  for (const templateFile of newInitialFiles) {
    const newCodeFile = templateFileToCodeFile(templateFile);
    const existingIndex = result.findIndex((f) => f.name === newCodeFile.name);

    if (existingIndex === -1) {
      // New file — just add it
      result.push(newCodeFile);
    } else {
      const existing = result[existingIndex];
      const existingContent = existing.content ?? "";
      const newContent = newCodeFile.content ?? "";

      if (existingContent !== newContent) {
        // User has a different version — back it up
        const bakName = `${existing.name}.bak`;
        const bakIndex = result.findIndex((f) => f.name === bakName);
        const bakFile: CodeFile = { name: bakName, content: existingContent };

        if (bakIndex === -1) {
          result.splice(existingIndex, 0, bakFile); // insert backup before original
          // existingIndex is now shifted by 1
          result[existingIndex + 1] = newCodeFile;
        } else {
          result[bakIndex] = bakFile;
          result[existingIndex] = newCodeFile;
        }
      }
      // If content is the same, no backup needed — just keep it (already same)
    }
  }

  return result;
}

function RunnerChangedBanner({ onReload, onDismiss }: { onReload: () => void; onDismiss: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-(--amber-2) border-b border-(--amber-6) text-(--amber-11) text-xs shrink-0">
      <RefreshCw size="0.875rem" className="shrink-0" />
      <span className="flex-1">
        The Runner code has been updated. Please reload to apply the latest changes.
      </span>
      <Button variant="action" onClick={onReload} className="text-xs py-1 px-3 shrink-0">
        Reload
      </Button>
      <button
        onClick={onDismiss}
        className="p-0.5 rounded hover:bg-(--amber-4) transition-colors shrink-0"
        title="Dismiss"
      >
        <X size="0.875rem" />
      </button>
    </div>
  );
}

function EditorSection() {
  const [solution, setSolution] = useAtom(solutionAtom);
  const [, setSaveStatus] = useAtom(saveStatusAtom);
  const isOwner = useAtomValue(isOwnerAtom);
  const runnerTemplates = useAtomValue(runnerTemplatesAtom);
  const resourceFiles = useAtomValue(resourceFilesAtom);
  const runnerChanged = useAtomValue(runnerChangedSinceLoadAtom);
  const setRunnerChanged = useSetAtom(runnerChangedSinceLoadAtom);

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
        : runner.initial_files.map(templateFileToCodeFile);
      setSolution({ runner: { id: runner.id, name: runner.name }, files });
      if (isOwner) setSaveStatus("UnSaved");
    },
    [setSolution, setSaveStatus, isOwner, solution],
  );

  // Find the current runner's template to use for reload
  const currentRunnerTemplate = useMemo(() => {
    if (!solution?.runner) return null;
    return runnerTemplates.find((rt) => rt.id === solution.runner.id) ?? null;
  }, [solution?.runner, runnerTemplates]);

  // Banner is only shown if the changed flag is set AND we have a runner selected
  // that exists in the current runner templates
  const showBanner = runnerChanged && currentRunnerTemplate !== null;

  const handleReload = useCallback(() => {
    if (!currentRunnerTemplate || !solution) return;

    const updatedFiles = applyRunnerFilesWithBackup(
      solution.files,
      currentRunnerTemplate.initialFiles,
    );

    setSolution({ runner: solution.runner, files: updatedFiles });
    if (isOwner) setSaveStatus("UnSaved");
    setRunnerChanged(false);
  }, [currentRunnerTemplate, solution, setSolution, setSaveStatus, isOwner, setRunnerChanged]);

  const handleDismiss = useCallback(() => {
    setRunnerChanged(false);
  }, [setRunnerChanged]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {showBanner && (
        <RunnerChangedBanner onReload={handleReload} onDismiss={handleDismiss} />
      )}
      <CodeEditor
        files={combinedFiles}
        onFilesChange={handleFilesChange}
        permissions={{
          writeFiles: isOwner,
          modifyFiles: false,
          codeExecution: isOwner,
          selectRunner: isOwner,
        }}
        allowedRunners={allowedRunners}
        initialSelectedRunner={initialSelectedRunner}
        onChangeSelectedRunner={handleOnChangeSelectedRunner}
        isReadonlyFile={isReadonlyFile}
        isRequiredFile={isRequiredFile}
        canDeleteFile={(name) => isOwner && name.endsWith(".bak")}
        runnerSelectAddon={
          showBanner ? (
            <button
              onClick={handleReload}
              className="flex items-center gap-1 px-2 py-1 text-xs rounded-md text-(--amber-11) bg-(--amber-3) hover:bg-(--amber-4) border border-(--amber-6) transition-colors"
              title="Reload runner files"
            >
              <RefreshCw size="0.75rem" />
              Reload
            </button>
          ) : undefined
        }
      />
    </div>
  );
}

export default EditorSection;
