"use client";

import { useState, useCallback, useRef } from "react";
import { FileCode } from "lucide-react";
import { useAtom, useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import CodeMirror from "~/components/Editor/CodeMirror";
import EditorSettings from "~/components/Editor/EditorSettings";
import FileTree from "~/components/Editor/FileTree";
import { getEditorSettings } from "~/components/Editor/utils/get-editor-settings";
import type { IEditorSettings } from "~/components/Editor/types/editor";
import ComparePlayground from "./ComparePlayground";
import { compareFilesAtom } from "../../_stores/compare-files.store";
import { saveStatusAtom } from "../../_stores/save-status.store";
import useCompare from "../../_hooks/useCompare";
import {
  compareToEditorFiles,
  isRequiredFile,
  isRequiredFolder,
  getDisplayName,
} from "../../_utils/transform-files";

function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay: number,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: TArgs) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
}

function CompareEditor() {
  const { compareId } = useParams<{ compareId: string }>();
  const { data: compare, isLoading } = useCompare(compareId);

  const [files, setFiles] = useAtom(compareFilesAtom);
  const setSaveStatus = useSetAtom(saveStatusAtom);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [settings, setSettings] =
    useState<IEditorSettings>(getEditorSettings());

  const [compareHasValue, setCompareHasValue] = useState(false);

  // Initialize files from API data without useEffect
  if (compare && !compareHasValue) {
    const editorFiles = compareToEditorFiles(compare);
    setFiles(editorFiles);
    // Select first script file by default if none selected
    if (selectedFile === null && editorFiles.length > 0) {
      setSelectedFile(editorFiles[0].name);
    }
    setCompareHasValue(true);
  }

  const handleSelectFile = (name: string) => {
    setSelectedFile(name);
  };

  const currentFile = files.find((f) => f.name === selectedFile);
  const fileExtension = currentFile?.name.split(".").pop();

  const handleSettingsChange = (newSettings: IEditorSettings) => {
    setSettings(newSettings);
    localStorage.setItem("editor-settings", JSON.stringify(newSettings));
  };

  // Mark as unsaved when files change
  const handleFilesChange = useCallback(
    (newFiles: typeof files) => {
      setFiles(newFiles);
      setSaveStatus("UnSaved");
    },
    [setFiles, setSaveStatus],
  );

  // Debounced callback for code changes
  const debouncedFilesChange = useDebouncedCallback(
    (newFiles: typeof files) => {
      handleFilesChange(newFiles);
    },
    100,
  );

  const handleCodeChange = useCallback(
    (value: string) => {
      if (!currentFile) return;

      const newFiles = files.map((f) =>
        f.name === currentFile.name ? { ...f, content: value } : f,
      );
      debouncedFilesChange(newFiles);
    },
    [currentFile, files, debouncedFilesChange],
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex-1 flex min-h-0">
        <FileTree
          files={files}
          selectedFile={selectedFile}
          onSelectFile={handleSelectFile}
          onChange={handleFilesChange}
          isLoading={isLoading}
          initialExpandedFolders={["scripts", "files"]}
          isRequiredFile={isRequiredFile}
          isRequiredFolder={isRequiredFolder}
          getDisplayName={getDisplayName}
          getNewFilePath={(name) => `files/${name}`}
        />
        <div className="flex-1 min-h-0 overflow-auto flex flex-col min-w-40">
          <div className="border-b p-2 flex justify-end">
            <EditorSettings
              settings={settings}
              onChange={handleSettingsChange}
            />
          </div>
          {isLoading || currentFile === undefined ? (
            <div className="h-full flex flex-col items-center justify-center text-(--gray-11)">
              <FileCode size="3rem" className="mb-3 opacity-50" />
              <p className="text-sm">Click a file to start editing</p>
            </div>
          ) : (
            <CodeMirror
              key={currentFile.name}
              readOnly={false}
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

      <ComparePlayground compareId={compareId} />
    </div>
  );
}

export default CompareEditor;
