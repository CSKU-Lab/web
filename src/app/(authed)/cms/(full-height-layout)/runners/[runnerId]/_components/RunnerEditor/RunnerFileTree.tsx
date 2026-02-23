"use client";

import { useState, useMemo } from "react";
import {
  FilePlus,
  File as FileIcon,
  Folder,
  FolderOpen,
  Trash2,
  MoreHorizontal,
  GripVertical,
  Pencil,
  ChevronRight,
  ChevronDown,
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
import type { CodeFile } from "~/components/Editor/types/editor";
import { cn } from "~/lib/utils";
import {
  isRequiredFile,
  isScriptFile,
  getDisplayName,
} from "../../_utils/transform-files";

interface FolderStructure {
  [folderName: string]: CodeFile[];
}

interface RunnerFileTreeProps {
  files: CodeFile[];
  selectedFile: string | null;
  onSelectFile: (name: string) => void;
  onChange: (newFiles: CodeFile[]) => void;
  isLoading?: boolean;
}

function RunnerFileTree({
  files,
  selectedFile,
  onChange,
  onSelectFile,
  isLoading,
}: RunnerFileTreeProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["scripts", "initial"])
  );

  const { buttonRef, containerRef, size, events } = useDrag({
    initialSize: 240,
    direction: "horizontal",
  });

  // Group files by folder
  const folderStructure = useMemo<FolderStructure>(() => {
    const structure: FolderStructure = {
      scripts: [],
      initial: [],
    };

    files.forEach((file) => {
      const parts = file.name.split("/");
      if (parts.length > 1) {
        const folder = parts[0];
        if (!structure[folder]) {
          structure[folder] = [];
        }
        structure[folder].push(file);
      }
    });

    return structure;
  }, [files]);

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderName)) {
        newSet.delete(folderName);
      } else {
        newSet.add(folderName);
      }
      return newSet;
    });
  };

  // Validate new file name (only for initial folder)
  const existingNames = files.map((f) => f.name.toLowerCase());
  const fullNewFileName = `initial/${newFileName}`;
  const isDuplicateName = existingNames.includes(fullNewFileName.toLowerCase());
  const isInvalid = !newFileName.trim() || isDuplicateName;

  const handleCreateFile = () => {
    if (!isInvalid) {
      const newFiles = [
        ...files,
        { name: fullNewFileName, content: "" },
      ];
      onChange(newFiles);
      setNewFileName("");
      setIsDialogOpen(false);
      onSelectFile(fullNewFileName);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setNewFileName("");
    }
    setIsDialogOpen(open);
  };

  const handleDeleteClick = (fileName: string) => {
    if (isRequiredFile(fileName)) return;
    setFileToDelete(fileName);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (fileToDelete) {
      const newFiles = files.filter((f) => f.name !== fileToDelete);
      onChange(newFiles);
      setFileToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleRenameClick = (fileName: string) => {
    if (isRequiredFile(fileName)) return;
    setFileToRename(fileName);
    setRenameValue(getDisplayName(fileName));
    setRenameDialogOpen(true);
  };

  const handleConfirmRename = () => {
    if (fileToRename && renameValue.trim()) {
      const folder = fileToRename.split("/")[0];
      const newFullName = `${folder}/${renameValue.trim()}`;
      
      if (newFullName !== fileToRename) {
        const newFiles = files.map((f) =>
          f.name === fileToRename ? { ...f, name: newFullName } : f
        );
        onChange(newFiles);
      }
      setFileToRename(null);
      setRenameValue("");
      setRenameDialogOpen(false);
    }
  };

  const renderFile = (file: CodeFile, isScript: boolean) => {
    const displayName = getDisplayName(file.name);
    const isRequired = isRequiredFile(file.name);
    const canModify = !isRequired;

    return (
      <div
        key={file.name}
        className={cn(
          "group relative flex items-center gap-2 rounded text-sm transition-colors ml-4",
          selectedFile === file.name
            ? "bg-(--gray-4) text-(--gray-12) font-medium"
            : "hover:bg-(--gray-4) text-(--gray-11)"
        )}
      >
        <button
          className="flex-1 pl-2 pr-1 py-1 text-left flex items-center gap-2 w-full"
          onClick={() => onSelectFile(file.name)}
        >
          <FileIcon className="w-4 h-4 shrink-0" />
          <span className="truncate">{displayName}</span>
          {isRequired && (
            <span className="text-xs text-(--gray-9)">(required)</span>
          )}
        </button>
        {canModify && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="absolute right-1 p-1 opacity-0 group-hover:opacity-100 hover:bg-(--gray-6) rounded transition-opacity">
                <MoreHorizontal size="1rem" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  handleRenameClick(file.name);
                }}
              >
                <Pencil size="1rem" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
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
        )}
      </div>
    );
  };

  const renderFolder = (folderName: string, folderFiles: CodeFile[]) => {
    const isExpanded = expandedFolders.has(folderName);
    const isScriptsFolder = folderName === "scripts";
    const FolderIcon = isExpanded ? FolderOpen : Folder;
    const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;

    return (
      <div key={folderName} className="mb-1">
        <button
          className="flex items-center gap-1 w-full px-1 py-1 text-sm hover:bg-(--gray-4) rounded"
          onClick={() => toggleFolder(folderName)}
        >
          <ChevronIcon size="0.875rem" className="text-(--gray-9)" />
          <FolderIcon size="1rem" className="text-(--gray-11)" />
          <span className="font-medium">{folderName}</span>
        </button>
        {isExpanded && (
          <div className="space-y-0.5">
            {folderFiles.map((file) => renderFile(file, isScriptsFolder))}
          </div>
        )}
      </div>
    );
  };

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
                  <button className="text-(--gray-11) hover:text-(--gray-12)">
                    <FilePlus size="1rem" />
                  </button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Add initial file</TooltipContent>
            </Tooltip>
            <DialogContent>
              <DialogHeader className="p-4">
                <DialogTitle>Create New Initial File</DialogTitle>
              </DialogHeader>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fileName">File Name</Label>
                  <Input
                    id="fileName"
                    placeholder="e.g., main.py"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isInvalid) {
                        handleCreateFile();
                      }
                    }}
                  />
                  <p className="text-xs text-(--gray-10)">
                    File will be created in the <code>initial/</code> folder
                  </p>
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

      <div className="px-1 space-y-1">
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </>
        ) : (
          <>
            {renderFolder("scripts", folderStructure.scripts || [])}
            {renderFolder("initial", folderStructure.initial || [])}
          </>
        )}
      </div>

      <button
        {...events}
        ref={buttonRef}
        className="w-4 h-8 bg-(--gray-1) border rounded absolute -right-2 z-10 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing active:bg-(--gray-1)/90 flex items-center justify-center"
      >
        <GripVertical size="0.9rem" />
      </button>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader className="p-4">
            <DialogTitle>Delete File</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-(--gray-12)">
              Are you sure you want to delete{" "}
              <span className="font-medium">
                {fileToDelete ? getDisplayName(fileToDelete) : ""}
              </span>
              ?
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

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader className="p-4">
            <DialogTitle>Rename File</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="renameFile">New Name</Label>
              <Input
                id="renameFile"
                placeholder="e.g., main.py"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleConfirmRename();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="p-4">
            <Button
              className="px-6"
              variant="primary"
              onClick={() => setRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="px-6"
              variant="action"
              onClick={handleConfirmRename}
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RunnerFileTree;
