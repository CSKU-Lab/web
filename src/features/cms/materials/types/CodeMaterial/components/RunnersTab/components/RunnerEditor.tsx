"use client";

import { useState, useCallback, useMemo } from "react";
import { FileCode } from "lucide-react";
import CodeMirror from "~/components/Editor/CodeMirror";
import EditorSettings from "~/components/Editor/EditorSettings";
import { getEditorSettings } from "~/components/Editor/utils/get-editor-settings";
import type { IEditorSettings, TemplateFile, CodeFile } from "~/components/Editor/types/editor";
import FileTree from "~/components/Editor/FileTree";
import SegmentedFileEditor from "./SegmentedFileEditor";

interface RunnerEditorProps {
  buildScript: string;
  runScript: string;
  initialFiles: TemplateFile[];
  onInitialFilesChange: (files: TemplateFile[]) => void;
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
  const [settings, setSettings] = useState<IEditorSettings>(getEditorSettings());

  // FileTree needs CodeFile[]; derive flat content from segments.
  const allFiles = useMemo<CodeFile[]>(() => {
    const files: CodeFile[] = [
      { name: "scripts/build_script.sh", content: buildScript },
      { name: "scripts/run_script.sh", content: runScript },
    ];
    for (const f of initialFiles) {
      files.push({
        name: `initial/${f.name}`,
        content: f.segments.map((s) => s.content).join(""),
      });
    }
    return files;
  }, [buildScript, runScript, initialFiles]);

  const handleSettingsChange = (newSettings: IEditorSettings) => {
    setSettings(newSettings);
    localStorage.setItem("editor-settings", JSON.stringify(newSettings));
  };

  const isReadonlyFile = (name: string) => name.startsWith("scripts/");
  const getDisplayName = (name: string) => name.replace(/^(scripts|initial)\//, "");
  const isInitialFile = (name: string) => name.startsWith("initial/");

  const currentFile = allFiles.find((f) => f.name === selectedFile);
  const fileExtension = currentFile?.name.split(".").pop();

  // Find matching TemplateFile for current initial/ file.
  const currentTemplateFile = useMemo(() => {
    if (!currentFile || !isInitialFile(currentFile.name)) return null;
    const rawName = currentFile.name.replace("initial/", "");
    return initialFiles.find((f) => f.name === rawName) ?? null;
  }, [currentFile, initialFiles]);

  const handleTemplateFileChange = useCallback(
    (updated: TemplateFile) => {
      onInitialFilesChange(
        initialFiles.map((f) => (f.name === updated.name ? updated : f)),
      );
    },
    [initialFiles, onInitialFilesChange],
  );

  return (
    <div className="flex-1 flex h-full">
      <FileTree
        files={allFiles}
        selectedFile={selectedFile}
        onSelectFile={setSelectedFile}
        onChange={() => {}}
        allowModify={false}
        initialExpandedFolders={["scripts", "initial"]}
        isReadonlyFile={isReadonlyFile}
        getDisplayName={getDisplayName}
      />
      <div className="flex-1 flex flex-col min-h-0 min-w-40">
        <div className="border-b p-1 flex justify-end">
          <EditorSettings settings={settings} onChange={handleSettingsChange} />
        </div>
        {currentFile === undefined ? (
          <div className="h-full flex flex-col items-center justify-center text-(--gray-11)">
            <FileCode size="3rem" className="mb-3 opacity-50" />
            <p className="text-sm">Click a file to start editing</p>
          </div>
        ) : currentTemplateFile !== null ? (
          <SegmentedFileEditor
            key={currentTemplateFile.name}
            file={currentTemplateFile}
            onChange={handleTemplateFileChange}
            extension={fileExtension}
            fontSize={settings.fontSize}
            disabled={disabled}
          />
        ) : (
          <CodeMirror
            key={currentFile.name}
            readOnly
            className="flex-1 min-h-0"
            extension={fileExtension}
            fontSize={settings.fontSize}
            vimMode={settings.vimMode}
            value={currentFile.content}
          />
        )}
      </div>
    </div>
  );
}

export default RunnerEditor;
