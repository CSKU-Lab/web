"use client";

import { useState } from "react";
import { FilePlus, File as FileIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/commons/Dialog";
import Input from "~/components/commons/Input";
import Label from "~/components/commons/Label";
import { Button } from "~/components/commons/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export interface CodeMaterialSolutionFile {
  name: string;
  content: string;
}

interface FileTreeProps {
  files: CodeMaterialSolutionFile[];
  selectedFile: string | null;
  onSelectFile: (name: string) => void;
  onCreateFile: (name: string) => void;
}

function FileTree({
  files,
  selectedFile,
  onSelectFile,
  onCreateFile,
}: FileTreeProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      onCreateFile(newFileName.trim());
      setNewFileName("");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="min-w-[240px] border-r">
      <div className="flex justify-between items-center mb-3 border-b p-2">
        <h6 className="text-xs">Files</h6>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <button className="text-(--gray-11)">
                  <FilePlus size="1rem" />
                </button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Add a file</TooltipContent>
          </Tooltip>
          <DialogContent>
            <DialogHeader className="p-4">
              <DialogTitle>Create New File</DialogTitle>
            </DialogHeader>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fileName">File Name</Label>
                <Input
                  id="fileName"
                  placeholder="e.g., main.go"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateFile();
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter className="p-4">
              <Button
                className="px-6"
                variant="primary"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="px-6"
                variant="action"
                onClick={handleCreateFile}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-1.5 px-1">
        {files.map((file) => (
          <button
            key={file.name}
            className={`pl-2 pr-4 py-1 flex items-center gap-2 rounded text-sm w-full transition-colors ${
              selectedFile === file.name
                ? "bg-(--gray-4) text-(--gray-12) font-medium"
                : "hover:bg-(--gray-4) text-(--gray-11)"
            }`}
            onClick={() => onSelectFile(file.name)}
          >
            <FileIcon className="w-4 h-4" />
            {file.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FileTree;
