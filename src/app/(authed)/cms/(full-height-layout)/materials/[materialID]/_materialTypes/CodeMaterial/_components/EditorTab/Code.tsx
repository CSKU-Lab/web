import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { FileCode, Settings } from "lucide-react";
import CodeMirror from "~/components/Editor/CodeMirror";
import { filesAtom, selectedFileAtom } from "../../_stores/editor.store";
import { saveStatusAtom } from "../../_stores/save-status.store";
import FileTree from "./FileTree";
import RunnerSelect from "./RunnerSelect";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/commons/Dialog";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";

const fontSizes = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

function Code() {
  const [files, setFiles] = useAtom(filesAtom);
  const [selectedFile, setSelectedFile] = useAtom(selectedFileAtom);
  const setSaveStatus = useSetAtom(saveStatusAtom);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [vimMode, setVimMode] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isLoading =
    files.length === 1 &&
    files[0].name === "main.go" &&
    files[0].content === "";

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
  const fileExtension = currentFile?.name.split(".").pop();

  const codeMirrorValue = currentFile?.content ?? "";

  return (
    <div className="flex-1 min-h-0 flex flex-col relative">
      <div className="flex-1 flex min-h-0">
        <FileTree
          files={files}
          selectedFile={selectedFile}
          onSelectFile={handleSelectFile}
          onCreateFile={handleCreateFile}
          onDeleteFile={handleDeleteFile}
        />
        <RunnerSelect />
        <div className="flex-1 min-h-0 overflow-auto flex flex-col min-w-40">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-(--gray-11)">
              <FileCode size="3rem" className="mb-3 opacity-50" />
              <p className="text-sm">Click a file to start editing</p>
            </div>
          ) : (
            <CodeMirror
              className="flex-1 min-h-0"
              extension={fileExtension}
              vimMode={vimMode}
              fontSize={fontSize}
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
                }
              }}
            />
          )}

          <div className="border-t p-1 flex justify-end">
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Settings size="1rem" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader className="p-4">
                  <DialogTitle>Editor Settings</DialogTitle>
                </DialogHeader>
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select
                      value={fontSize.toString()}
                      onValueChange={(value) => setFontSize(parseInt(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Font size" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontSizes.map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size}px
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Vim Mode</Label>
                    <Switch checked={vimMode} onCheckedChange={setVimMode} />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Code;
