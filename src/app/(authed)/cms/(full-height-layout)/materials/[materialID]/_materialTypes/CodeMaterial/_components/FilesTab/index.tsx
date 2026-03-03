"use client";

import { useState, useCallback, useMemo } from "react";
import { FileCode, FileImage, FileText } from "lucide-react";
import CodeMirror from "~/components/Editor/CodeMirror";
import EditorSettings from "~/components/Editor/EditorSettings";
import { getEditorSettings } from "~/components/Editor/utils/get-editor-settings";
import type { IEditorSettings } from "~/components/Editor/types/editor";
import FileTree from "~/components/Editor/FileTree";
import type { CodeFile } from "~/components/Editor/types/editor";
import { useDebouncedCallback } from "~/hooks/useDebouncedCallback";
import { useAtom, useAtomValue } from "jotai";
import { resourceFilesAtom } from "../../_stores/resource-files.store";
import { isOwnerAtom } from "../../_stores/owner.store";
import { isLoadingAtom } from "../../_stores/loading.store";

const TEXT_EXTENSIONS = new Set([
  "txt", "md", "json", "xml", "csv", "yaml", "yml", "toml", "ini", "cfg",
  "conf", "sh", "bash", "zsh", "fish", "ps1", "bat", "cmd", "py", "js",
  "ts", "jsx", "tsx", "java", "c", "cpp", "h", "hpp", "cs", "go", "rs",
  "rb", "php", "swift", "kt", "scala", "html", "css", "scss", "sass",
  "less", "sql", "graphql", "proto", "r", "m", "lua", "pl", "pm", "sh",
  "dockerfile", "makefile", "cmake", "gradle", "properties", "env",
]);

const BINARY_EXTENSIONS = new Set([
  "png", "jpg", "jpeg", "gif", "bmp", "ico", "webp", "svg",
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
  "zip", "tar", "gz", "rar", "7z",
  "mp3", "wav", "ogg", "flac", "mp4", "avi", "mkv", "mov",
  "exe", "dll", "so", "dylib", "a", "o", "obj",
  "class", "jar", "war", "ear",
]);

function isTextFile(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (TEXT_EXTENSIONS.has(ext)) return true;
  if (BINARY_EXTENSIONS.has(ext)) return false;
  return true;
}

function FilesTab() {
  const [files, setFiles] = useAtom(resourceFilesAtom);
  const isOwner = useAtomValue(isOwnerAtom);
  const isLoading = useAtomValue(isLoadingAtom);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [settings, setSettings] = useState<IEditorSettings>(getEditorSettings());

  const handleSettingsChange = (newSettings: IEditorSettings) => {
    setSettings(newSettings);
    localStorage.setItem("editor-settings", JSON.stringify(newSettings));
  };

  const handleFilesChange = useCallback(
    (newFiles: CodeFile[]) => {
      const transformedFiles = newFiles.map((f) => ({
        name: f.name,
        content: f.content,
      }));
      setFiles(transformedFiles);
    },
    [setFiles],
  );

  const codeFiles: CodeFile[] = useMemo(
    () => files.map((f) => ({ name: f.name, content: f.content })),
    [files],
  );

  const currentFile = codeFiles.find((f) => f.name === selectedFile);
  const fileExtension = currentFile?.name.split(".").pop();

  const handleCodeChange = useDebouncedCallback((value: string) => {
    if (!currentFile) return;

    const newFiles = files.map((f) =>
      f.name === currentFile.name ? { ...f, content: value } : f,
    );
    setFiles(newFiles);
  }, 100);

  const isText =
    currentFile && currentFile.content
      ? isTextFile(currentFile.name)
      : true;

  if (files.length > 0 && selectedFile === null) {
    setSelectedFile(files[0].name);
  }

  return (
    <div className="flex-1 flex h-full">
      <FileTree
        files={codeFiles}
        selectedFile={selectedFile}
        onSelectFile={setSelectedFile}
        onChange={handleFilesChange}
        allowModify={isOwner && !isLoading}
      />
      <div className="flex-1 flex flex-col min-h-0 min-w-40">
        <div className="border-b p-1 flex justify-end">
          <EditorSettings
            settings={settings}
            onChange={handleSettingsChange}
          />
        </div>
        {currentFile === undefined ? (
          <div className="h-full flex flex-col items-center justify-center text-(--gray-11)">
            <FileCode size="3rem" className="mb-3 opacity-50" />
            <p className="text-sm">Click a file to start editing</p>
          </div>
        ) : !isText ? (
          <div className="h-full flex flex-col items-center justify-center text-(--gray-11)">
            {currentFile.name.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i) ? (
              <>
                <FileImage size="3rem" className="mb-3 opacity-50" />
                <p className="text-sm">Image preview not available</p>
              </>
            ) : (
              <>
                <FileText size="3rem" className="mb-3 opacity-50" />
                <p className="text-sm">Binary file - preview not available</p>
              </>
            )}
            <p className="text-xs text-(--gray-9) mt-2">{currentFile.name}</p>
          </div>
        ) : (
          <CodeMirror
            key={currentFile.name}
            readOnly={!isOwner || isLoading}
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

export default FilesTab;
