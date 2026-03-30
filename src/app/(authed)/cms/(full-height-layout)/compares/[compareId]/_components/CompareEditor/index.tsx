"use client";

import { useState, useCallback, useRef } from "react";
import { FileCode, MoreVertical, FileCheck } from "lucide-react";
import { useAtom, useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import CodeMirror from "~/components/Editor/CodeMirror";
import EditorSettings from "~/components/Editor/EditorSettings";
import FileTree from "~/components/Editor/FileTree";
import { getEditorSettings } from "~/components/Editor/utils/get-editor-settings";
import type { IEditorSettings } from "~/components/Editor/types/editor";
import ComparePlayground from "./ComparePlayground";
import { compareFilesAtom } from "../../_stores/compare-files.store";
import { saveStatusAtom } from "../../_stores/save-status.store";
import { compareRunNameAtom } from "../../_stores/compare-info.store";
import useCompare from "../../_hooks/useCompare";
import {
  compareToEditorFiles,
  isRequiredFile,
  isRequiredFolder,
  getDisplayName,
} from "../../_utils/transform-files";
import { queryKeys } from "~/queryKeys";
import { cmsCompareService } from "~/services/cms-compare.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/commons/Button";

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
  const queryClient = useQueryClient();

  const [files, setFiles] = useAtom(compareFilesAtom);
  const setSaveStatus = useSetAtom(saveStatusAtom);
  const [, setRunName] = useAtom(compareRunNameAtom);
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

  // Mutation to update compare run name
  const updateCompare = useMutation({
    mutationFn: (runName: string) =>
      cmsCompareService.updateById(compareId, { run_name: runName }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.compare.getById(compareId),
      });
      toast.success("Run name updated successfully");
    },
    onError: () => {
      toast.error("Failed to update run name");
    },
  });

  // Handle "Save as Run Name" menu option
  const handleSaveAsRunName = () => {
    if (!currentFile) return;

    // Only allow for files in the files/ folder
    if (!currentFile.name.startsWith("files/")) {
      toast.error("Can only set files from the files folder as run name");
      return;
    }

    // Extract file name without the "files/" prefix
    const fileName = currentFile.name.replace("files/", "");

    // Update the atom
    setRunName(fileName);

    // Persist to backend
    updateCompare.mutate(fileName);
  };

  // Check if current file is in the files folder (eligible for "Save as Run Name")
  const canSaveAsRunName = currentFile?.name.startsWith("files/") ?? false;

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
          <div className="border-b p-2 flex justify-between items-center">
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <EditorSettings
                settings={settings}
                onChange={handleSettingsChange}
              />
              {/* 3-dots menu for additional options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical size="1rem" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleSaveAsRunName}
                    disabled={!canSaveAsRunName || updateCompare.isPending}
                  >
                    <FileCheck size="1rem" className="mr-2" />
                    Save as Run Name
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
