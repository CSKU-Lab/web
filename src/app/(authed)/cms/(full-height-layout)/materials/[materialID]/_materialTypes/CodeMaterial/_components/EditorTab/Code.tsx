import { useAtom } from "jotai";
import { useState } from "react";
import CodeMirror from "~/components/Editor/CodeMirror";
import {
  codeAtom,
  filesAtom,
  runnerAtom,
  selectedFileAtom,
} from "../../_stores/editor.store";
import { saveStatusAtom } from "../../_stores/save-status.store";
import FileTree from "./FileTree";
import RunnerSelect from "./RunnerSelect";

function Code() {
  const [code, setCode] = useAtom(codeAtom);
  const [files, setFiles] = useAtom(filesAtom);
  const [selectedFile, setSelectedFile] = useAtom(selectedFileAtom);
  const [runner] = useAtom(runnerAtom);
  const [, setSaveStatus] = useAtom(saveStatusAtom);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleSelectFile = (name: string) => {
    setSelectedFile(name);
  };

  const handleCreateFile = (name: string) => {
    const newFiles = [...files, { name, content: "" }];
    setFiles(newFiles);
    setSelectedFile(name);
    setSaveStatus("UnSaved");
  };

  const handleDeleteFile = (name: string) => {
    const newFiles = files.filter((f) => f.name !== name);
    setFiles(newFiles);
    if (selectedFile === name) {
      setSelectedFile(newFiles[0]?.name || null);
    }
    setSaveStatus("UnSaved");
  };

  const currentFile = files.find((f) => f.name === selectedFile);
  const fileExtension = currentFile?.name.split(".").pop() || runner || "go";

  const codeMirrorValue = currentFile?.content ?? code ?? "";

  return (
    <div className="flex-1 min-h-0 flex relative">
      <FileTree
        files={files}
        selectedFile={selectedFile}
        onSelectFile={handleSelectFile}
        onCreateFile={handleCreateFile}
        onDeleteFile={handleDeleteFile}
      />
      <RunnerSelect />
      <div className="flex-1 min-h-0 overflow-auto">
        <CodeMirror
          className="h-full"
          extension={fileExtension}
          vimMode
          value={codeMirrorValue}
          onChange={(value) => {
            if (isInitialLoad) {
              setIsInitialLoad(false);
              return;
            }
            if (currentFile) {
              const newFiles = files.map((f) =>
                f.name === currentFile.name ? { ...f, content: value } : f,
              );
              setFiles(newFiles);
              if (currentFile.content !== value) {
                setSaveStatus("UnSaved");
              }
            } else {
              setCode(value);
            }
          }}
        />
      </div>
    </div>
  );
}

export default Code;
