import { useState, useCallback, useRef } from "react";
import { FileCode } from "lucide-react";
import CodeMirror from "~/components/Editor/CodeMirror";
import FileTree from "./FileTree";
import RunnerSelect from "./RunnerSelect";
import EditorSettings from "./EditorSettings";
import { getEditorSettings } from "./utils/get-editor-settings";
import type { Runner } from "./types/runner";
import Playground from "./Playground";
import type { CodeFile, IEditorSettings } from "./types/editor";

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

interface Permission {
  modifyFiles?: boolean;
  writeFiles?: boolean;
  codeExecution?: boolean;
  selectRunner?: boolean;
}

interface Props {
  files: CodeFile[];
  onFilesChange: (files: CodeFile[]) => void;
  permissions?: Permission;
  allowedRunners: Runner[];
  initialSelectedRunnerID?: string;
  onChangeSelectedRunnerID?: (runnerID: string) => void;
  isLoading?: boolean;
}

function CodeEditor({
  files,
  onFilesChange,
  permissions,
  allowedRunners,
  initialSelectedRunnerID,
  onChangeSelectedRunnerID,
  isLoading,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [settings, setSettings] =
    useState<IEditorSettings>(getEditorSettings());
  const [runnerSelectError, setRunnerSelectError] = useState(false);
  const [selectedRunnerID, setSelectedRunnerID] = useState<string>("");

  const [previousFiles, setPreviousFiles] = useState<CodeFile[]>([]);
  if (previousFiles.length === 0 && files.length > 0) {
    setSelectedFile(files[0].name);
    setPreviousFiles(files);
  }

  if (initialSelectedRunnerID && selectedRunnerID === "") {
    setSelectedRunnerID(initialSelectedRunnerID);
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

  const handleSelectRunner = (runnerID: string) => {
    setSelectedRunnerID(runnerID);
    onChangeSelectedRunnerID?.(runnerID);
    setRunnerSelectError(false);
  };

  // Debounced callback to notify parent of changes
  const debouncedOnFilesChange = useDebouncedCallback(
    (newFiles: CodeFile[]) => {
      onFilesChange(newFiles);
    },
    100,
  );

  const handleCodeChange = useCallback(
    (value: string) => {
      if (!currentFile) return;

      // Debounce the parent update - typing stays responsive
      const newFiles = files.map((f) =>
        f.name === currentFile.name ? { ...f, content: value } : f,
      );
      debouncedOnFilesChange(newFiles);
    },
    [currentFile, files, debouncedOnFilesChange],
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex-1 flex min-h-0">
        <FileTree
          allowModify={permissions?.modifyFiles ?? false}
          files={files}
          selectedFile={selectedFile}
          onSelectFile={handleSelectFile}
          onChange={onFilesChange}
        />
        <div className="flex-1 min-h-0 overflow-auto flex flex-col min-w-40">
          <div className="border-b p-1 flex justify-between">
            <RunnerSelect
              runners={allowedRunners}
              selectedRunnerID={selectedRunnerID}
              onSelect={handleSelectRunner}
              isError={runnerSelectError}
              isLoading={isLoading}
              disabled={!permissions?.selectRunner}
            />
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
              readOnly={permissions ? !permissions.writeFiles : true}
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

      <Playground
        files={files}
        runnerID={selectedRunnerID}
        onError={() => setRunnerSelectError(true)}
        disabled={!permissions?.codeExecution}
      />
    </div>
  );
}

export default CodeEditor;
