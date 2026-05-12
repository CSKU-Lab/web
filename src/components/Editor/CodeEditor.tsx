import { useState, useCallback } from "react";
import { FileCode } from "lucide-react";
import CodeMirror from "~/components/Editor/CodeMirror";
import FileTree from "./FileTree";
import RunnerSelect from "./RunnerSelect";
import EditorSettings from "./EditorSettings";
import { getEditorSettings } from "./utils/get-editor-settings";
import type { Runner } from "./types/runner";
import Playground from "./Playground";
import type { CodeFile, IEditorSettings } from "./types/editor";
import { useDebouncedCallback } from "~/hooks/useDebouncedCallback";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import MarkdownRenderer from "~/components/ui/markdown-renderer";

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
  initialSelectedRunner?: Runner | null;
  onChangeSelectedRunner?: (runner: Runner) => void;
  isLoading?: boolean;
  queryFn?: (query: string) => Promise<Runner[]>;
  isReadonlyFile?: (name: string) => boolean;
  isRequiredFile?: (name: string) => boolean;
}

function CodeEditor({
  files,
  onFilesChange,
  permissions,
  allowedRunners,
  initialSelectedRunner,
  onChangeSelectedRunner,
  isLoading,
  queryFn,
  isReadonlyFile,
  isRequiredFile,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [settings, setSettings] =
    useState<IEditorSettings>(getEditorSettings());
  const [runnerSelectError, setRunnerSelectError] = useState(false);
  const [selectedRunner, setSelectedRunner] = useState<Runner | null>(null);
  const [mdTab, setMdTab] = useState("edit");

  const [previousFiles, setPreviousFiles] = useState<CodeFile[]>([]);
  if (previousFiles.length === 0 && files.length > 0) {
    setSelectedFile(files[0].name);
    setPreviousFiles(files);
  }

  if (initialSelectedRunner && selectedRunner === null) {
    setSelectedRunner(initialSelectedRunner);
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

  const handleSelectRunner = (runner: Runner) => {
    setSelectedRunner(runner);
    onChangeSelectedRunner?.(runner);
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
          isReadonlyFile={isReadonlyFile}
          isRequiredFile={isRequiredFile}
        />
        <Tabs
          value={mdTab}
          onValueChange={setMdTab}
          className="flex-1 min-h-0 flex flex-col min-w-40 gap-0"
        >
          <div className="border-b p-1 flex justify-between items-center shrink-0">
            <RunnerSelect
              runners={allowedRunners}
              selectedRunner={selectedRunner}
              onSelect={handleSelectRunner}
              isError={runnerSelectError}
              isLoading={isLoading}
              disabled={!permissions?.selectRunner}
              queryFn={queryFn}
            />
            <div className="flex items-center gap-2">
              {fileExtension === "md" && (
                <TabsList className="w-fit">
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
              )}
              <EditorSettings
                settings={settings}
                onChange={handleSettingsChange}
              />
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-auto">
            {isLoading || currentFile === undefined ? (
              <div className="h-full flex flex-col items-center justify-center text-(--gray-11)">
                <FileCode size="3rem" className="mb-3 opacity-50" />
                <p className="text-sm">Click a file to start editing</p>
              </div>
            ) : fileExtension === "md" ? (
              mdTab === "edit" ? (
                <CodeMirror
                  key={currentFile.name}
                  readOnly={
                    (permissions ? !permissions.writeFiles : true) ||
                    (currentFile.readonly ?? false)
                  }
                  className="h-full"
                  extension={fileExtension}
                  fontSize={settings.fontSize}
                  vimMode={settings.vimMode}
                  value={currentFile.content}
                  onChange={handleCodeChange}
                />
              ) : (
                <div className="p-4">
                  <MarkdownRenderer>{currentFile.content}</MarkdownRenderer>
                </div>
              )
            ) : (
              <CodeMirror
                key={currentFile.name}
                readOnly={
                  (permissions ? !permissions.writeFiles : true) ||
                  (currentFile.readonly ?? false)
                }
                className="h-full"
                extension={fileExtension}
                fontSize={settings.fontSize}
                vimMode={settings.vimMode}
                value={currentFile.content}
                onChange={handleCodeChange}
              />
            )}
          </div>
        </Tabs>
      </div>

      <Playground
        files={files}
        runnerID={selectedRunner?.id ?? ""}
        onError={() => setRunnerSelectError(true)}
        disabled={!permissions?.codeExecution}
      />
    </div>
  );
}

export default CodeEditor;
