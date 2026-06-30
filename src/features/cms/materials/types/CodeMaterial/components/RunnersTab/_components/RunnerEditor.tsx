"use client";

import { useState, useCallback, useMemo } from "react";
import { FileCode } from "lucide-react";
import CodeMirror from "~/components/Editor/CodeMirror";
import { useEditorSettings } from "~/globalStore/settings";
import FileTree from "~/components/Editor/FileTree";
import type { CodeFile } from "~/components/Editor/types/editor";
import { useDebouncedCallback } from "~/hooks/useDebouncedCallback";

interface RunnerEditorProps {
  buildScript: string;
  runScript: string;
  initialFiles: CodeFile[];
  onInitialFilesChange: (files: CodeFile[]) => void;
  disabled?: boolean;
}

function RunnerEditor({
  buildScript,
  runScript,
  initialFiles,
  onInitialFilesChange,
  disabled = false,
}: RunnerEditorProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [settings] = useEditorSettings();

  const allFiles = useMemo<CodeFile[]>(() => {
    const files: CodeFile[] = [
      { name: "scripts/build_script.sh", content: buildScript },
      { name: "scripts/run_script.sh", content: runScript },
    ];
    initialFiles.forEach((f) => {
      files.push({ ...f, name: `initial/${f.name}` });
    });
    return files;
  }, [buildScript, runScript, initialFiles]);


  const handleInitialFilesChange = useCallback(
    (newFiles: CodeFile[]) => {
      const filesWithoutScripts = newFiles.filter(
        (f) => !f.name.startsWith("scripts/"),
      );
      onInitialFilesChange(
        filesWithoutScripts.map((f) => ({
          ...f,
          name: f.name.replace(/^initial\//, ""),
        })),
      );
    },
    [onInitialFilesChange],
  );

  const currentFile = allFiles.find((f) => f.name === selectedFile);
  const fileExtension = currentFile?.name.split(".").pop();

  const isReadonlyFile = (name: string): boolean => {
    return name.startsWith("scripts/");
  };

  const getDisplayName = (name: string): string => {
    return name.replace(/^(scripts|initial)\//, "");
  };

  const isEditable = (name: string): boolean => {
    return name.startsWith("initial/");
  };

  const handleCodeChange = useDebouncedCallback((value: string) => {
    if (!currentFile || !isEditable(currentFile.name)) return;

    const newInitialFiles = initialFiles.map((f) =>
      f.name === currentFile.name.replace("initial/", "")
        ? { ...f, content: value }
        : f,
    );
    onInitialFilesChange(newInitialFiles);
  }, 100);

  return (
    <div className="flex-1 flex h-full">
      <FileTree
        files={allFiles}
        selectedFile={selectedFile}
        onSelectFile={setSelectedFile}
        onChange={handleInitialFilesChange}
        allowModify={false}
        initialExpandedFolders={["scripts", "initial"]}
        isReadonlyFile={isReadonlyFile}
        getDisplayName={getDisplayName}
      />
      <div className="flex-1 flex flex-col min-h-0 min-w-40">
        {currentFile === undefined ? (
          <div className="h-full flex flex-col items-center justify-center text-(--gray-11)">
            <FileCode size="3rem" className="mb-3 opacity-50" />
            <p className="text-sm">Click a file to start editing</p>
          </div>
        ) : (
          <CodeMirror
            key={currentFile.name}
            readOnly={disabled || !isEditable(currentFile.name)}
            className="flex-1 min-h-0"
            extension={fileExtension}
            fontSize={settings.fontSize}
            vimMode={settings.vimMode}
            value={currentFile.content}
            onChange={handleCodeChange}
          />
        )}
      </div>
    </div>
  );
}

export default RunnerEditor;
