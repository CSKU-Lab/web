"use client";

import { useState } from "react";
import {
  FilePlus,
  File as FileIcon,
  Trash2,
  MoreHorizontal,
  GripVertical,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/commons/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Input from "~/components/commons/Input";
import Label from "~/components/commons/Label";
import { Button } from "~/components/commons/Button";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import useDrag from "~/hooks/useDrag";

export interface CodeMaterialSolutionFile {
  name: string;
  content: string;
}

interface FileTreeProps {
  files: CodeMaterialSolutionFile[];
  selectedFile: string | null;
  onSelectFile: (name: string) => void;
  onCreateFile: (name: string) => void;
  onDeleteFile: (name: string) => void;
}

function FileTree({
  files,
  selectedFile,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
}: FileTreeProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const { buttonRef, containerRef, size, events } = useDrag({
    initialSize: 240,
    direction: "horizontal",
  });

  const isDuplicateName = files.some(
    (f) => f.name.toLowerCase() === newFileName.toLowerCase(),
  );
  const isInvalid = !newFileName.trim() || isDuplicateName;

  const handleCreateFile = () => {
    if (!isInvalid) {
      onCreateFile(newFileName.trim());
      setNewFileName("");
      setIsDialogOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setNewFileName("");
    }
    setIsDialogOpen(open);
  };

  const handleDeleteClick = (fileName: string) => {
    setFileToDelete(fileName);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (fileToDelete) {
      onDeleteFile(fileToDelete);
      setFileToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const isLoading =
    files.length === 1 &&
    files[0].name === "main.go" &&
    files[0].content === "";

  return (
    <div
      ref={containerRef}
      style={{ width: size }}
      className="relative border-r h-full"
    >
      <div className="flex justify-between items-center mb-3 border-b p-2">
        <h6 className="text-xs">Files</h6>
        {isLoading ? (
          <Skeleton className="h-5 w-16" />
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
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
                      if (e.key === "Enter" && !isInvalid) {
                        handleCreateFile();
                      }
                    }}
                  />
                  {isDuplicateName && (
                    <p className="text-(--red-9) text-sm">
                      File name already exists
                    </p>
                  )}
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
                  disabled={isInvalid}
                  onClick={handleCreateFile}
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="space-y-1.5 px-1">
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </>
        ) : (
          files.map((file) => (
            <div
              key={file.name}
              className={`group relative flex items-center gap-2 rounded text-sm transition-colors ${
                selectedFile === file.name
                  ? "bg-(--gray-4) text-(--gray-12) font-medium"
                  : "hover:bg-(--gray-4) text-(--gray-11)"
              }`}
            >
              <button
                className="flex-1 pl-2 pr-1 py-1 text-left flex items-center gap-2 w-full"
                onClick={() => onSelectFile(file.name)}
              >
                <FileIcon className="w-4 h-4 shrink-0" />
                <span className="truncate">{file.name}</span>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="absolute right-1 p-1 opacity-0 group-hover:opacity-100 hover:bg-(--gray-6) rounded transition-opacity">
                    <MoreHorizontal size="1rem" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-(--red-11) focus:text-(--red-11)"
                    onSelect={(e) => {
                      e.preventDefault();
                      handleDeleteClick(file.name);
                    }}
                  >
                    <Trash2 size="1rem" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </div>
      <button
        {...events}
        ref={buttonRef}
        className="w-4 h-8 bg-white border rounded absolute -right-2 z-10 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing active:bg-white/90 flex items-center justify-center"
      >
        <GripVertical size="0.9rem" />
      </button>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader className="p-4">
            <DialogTitle>Delete File</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-(--gray-12)">
              Are you sure you want to delete{" "}
              <span className="font-medium">{fileToDelete}</span>?
            </p>
          </div>
          <DialogFooter className="p-4">
            <Button
              className="px-6"
              variant="primary"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="px-6"
              variant="action"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FileTree;
