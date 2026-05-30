"use client";

import { useEffect, useMemo } from "react";
import CodeEditor from "~/components/Editor/CodeEditor";
import useGetCoreMaterial from "~/features/core/materials/hooks/useGetCoreMaterial";
import useSubmissionFiles from "~/features/core/materials/hooks/useSubmissionFiles";
import { useIsLabReadonly } from "~/features/core/sections/hooks/labs/useIsLabReadonly";
import type { CoreCodeMaterial } from "~/types/core-code-material";

function RightSection() {
  const { data: material, isLoading } = useGetCoreMaterial<CoreCodeMaterial>();
  const isReadonly = useIsLabReadonly();
  const { files, selectedRunner, initRunner, persistFiles, handleRunnerChange } =
    useSubmissionFiles();

  // Build the Runner[] list with real initial_files from the API.
  const allowedRunners = useMemo(
    () =>
      material?.payload.allowed_runners.map((runner) => ({
        id: runner.id,
        name: runner.name,
        initial_files: runner.files,
      })) ?? [],
    [material],
  );

  // Build a set of resource file names for fast lookup.
  const resourceFileNames = useMemo(
    () => new Set((material?.payload.resource_files ?? []).map((f) => f.name)),
    [material],
  );

  // Resource files merged into the editor as read-only entries.
  const resourceFiles = useMemo(
    () =>
      (material?.payload.resource_files ?? []).map((f) => ({
        ...f,
        readonly: true,
      })),
    [material],
  );

  // Auto-select the first runner (and load its files) once material arrives.
  useEffect(() => {
    if (!material || selectedRunner !== null || allowedRunners.length === 0) {
      return;
    }
    initRunner(allowedRunners[0]);
  }, [material, selectedRunner, allowedRunners, initRunner]);

  // Merge submission files with read-only resource files for the editor.
  const editorFiles = useMemo(
    () => [...files, ...resourceFiles],
    [files, resourceFiles],
  );

  // When the editor calls onFilesChange, strip resource files before persisting.
  function handleFilesChange(newFiles: typeof editorFiles) {
    const submissionOnly = newFiles.filter(
      (f) => !resourceFileNames.has(f.name),
    );
    persistFiles(submissionOnly);
  }

  return (
    <div className="flex-1 border-t-0 border-l-0 border flex flex-col min-h-0 min-w-[300px] overflow-hidden">
      <div className="flex-1 min-h-0 overflow-auto flex flex-col">
        <CodeEditor
          files={editorFiles}
          onFilesChange={handleFilesChange}
          permissions={{
            writeFiles: !isReadonly,
            modifyFiles: false,
            codeExecution: !isReadonly,
            selectRunner: !isReadonly,
          }}
          allowedRunners={allowedRunners}
          initialSelectedRunner={selectedRunner}
          onChangeSelectedRunner={handleRunnerChange}
          isLoading={isLoading}
          isReadonlyFile={(name) => resourceFileNames.has(name)}
        />
      </div>
    </div>
  );
}

export default RightSection;
