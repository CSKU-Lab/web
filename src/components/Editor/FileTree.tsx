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
  UnfoldHorizontal,
  UnfoldVertical,
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
import type { CodeFile } from "./types/editor";
import { cn } from "~/lib/utils";

interface FileTreeProps {
  files: CodeFile[];
  selectedFile: string | null;
  onSelectFile: (name: string) => void;
  onChange: (newFiles: CodeFile[]) => void;
  isLoading?: boolean;
  allowModify?: boolean;
  initialExpandedFolders?: string[];
  isReadonlyFile?: (name: string) => boolean;
  isRequiredFile?: (name: string) => boolean;
  isRequiredFolder?: (name: string) => boolean;
  getDisplayName?: (name: string) => string;
  getNewFilePath?: (name: string) => string;
}

type TreeNode =
  | { type: "folder"; name: string; path: string; children: TreeNode[] }
  | { type: "file"; name: string; path: string; file: CodeFile };

function buildTree(files: CodeFile[]): TreeNode[] {
  const root: TreeNode[] = [];

  files.forEach((file) => {
    const parts = file.name.split("/");
    const pathParts: string[] = [];

    let currentLevel = root;

    parts.forEach((part, index) => {
      pathParts.push(part);
      const path = pathParts.join("/");
      const isLast = index === parts.length - 1;

      const existingNode = currentLevel.find(
        (n) => n.type === (isLast ? "file" : "folder") && n.name === part
      );

      if (existingNode) {
        if (!isLast) {
          currentLevel = (existingNode as { type: "folder"; children: TreeNode[] }).children;
        }
      } else {
        const newNode: TreeNode = isLast
          ? { type: "file", name: part, path, file }
          : { type: "folder", name: part, path, children: [] };

        currentLevel.push(newNode);

        if (!isLast) {
          currentLevel = (newNode as { type: "folder"; children: TreeNode[] }).children;
        }
      }
    });
  });

  const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.sort((a, b) => {
      if (a.type === "folder" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "folder") return 1;
      return a.name.localeCompare(b.name);
    }).map((node) => {
      if (node.type === "folder") {
        return { ...node, children: sortNodes(node.children) };
      }
      return node;
    });
  };

  return sortNodes(root);
}

function FileTree({
  files,
  selectedFile,
  onChange,
  onSelectFile,
  isLoading,
  allowModify = true,
  initialExpandedFolders = [],
  isReadonlyFile,
  isRequiredFile,
  isRequiredFolder,
  getDisplayName,
  getNewFilePath,
}: FileTreeProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [folderForNewFile, setFolderForNewFile] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [isFolderToDelete, setIsFolderToDelete] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(initialExpandedFolders)
  );

  const { buttonRef, containerRef, size, events } = useDrag({
    initialSize: 240,
    direction: "horizontal",
  });

  const tree = useMemo(() => buildTree(files), [files]);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allFolders = new Set<string>();
    const collectFolders = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        if (node.type === "folder") {
          allFolders.add(node.path);
          collectFolders(node.children);
        }
      });
    };
    collectFolders(tree);
    setExpandedFolders(allFolders);
  };

  const collapseAll = () => {
    setExpandedFolders(new Set());
  };

  const isDuplicateName = files.some((f) => {
    const targetPath = folderForNewFile
      ? `${folderForNewFile}/${newFileName.toLowerCase()}`
      : newFileName.toLowerCase();
    return f.name.toLowerCase() === targetPath;
  });
  const isInvalid = !newFileName.trim() || isDuplicateName;

  const handleCreateFile = () => {
    if (!isInvalid) {
      let fileName: string;
      if (folderForNewFile) {
        fileName = `${folderForNewFile}/${newFileName.trim()}`;
      } else if (getNewFilePath) {
        fileName = getNewFilePath(newFileName.trim());
      } else {
        fileName = newFileName.trim();
      }
      const newFiles = [
        ...files,
        { name: fileName, content: "", readonly: false },
      ];
      onChange(newFiles);
      setNewFileName("");
      setFolderForNewFile(null);
      setIsDialogOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setNewFileName("");
      setFolderForNewFile(null);
    }
    setIsDialogOpen(open);
  };

  const handleAddFileInFolder = (folderPath: string) => {
    setFolderForNewFile(folderPath);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (fileName: string) => {
    if (isReadonlyFile?.(fileName) || isRequiredFile?.(fileName)) return;
    setFileToDelete(fileName);
    setIsFolderToDelete(false);
    setDeleteDialogOpen(true);
  };

  const handleDeleteFolder = (folderPath: string) => {
    if (isRequiredFolder?.(folderPath)) return;
    setFileToDelete(folderPath);
    setIsFolderToDelete(true);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (fileToDelete) {
      let newFiles: CodeFile[];
      if (isFolderToDelete) {
        newFiles = files.filter((f) => !f.name.startsWith(fileToDelete + "/"));
      } else {
        newFiles = files.filter((f) => f.name !== fileToDelete);
      }
      onChange(newFiles);
      setFileToDelete(null);
      setIsFolderToDelete(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleRenameClick = (fileName: string) => {
    if (isReadonlyFile?.(fileName)) return;
    setFileToRename(fileName);
    setRenameValue(getDisplayName ? getDisplayName(fileName) : fileName);
    setRenameDialogOpen(true);
  };

  const handleConfirmRename = () => {
    if (fileToRename && renameValue.trim()) {
      const parts = fileToRename.split("/");
      const isInFolder = parts.length > 1;
      const newFullName = isInFolder
        ? `${parts.slice(0, -1).join("/")}/${renameValue.trim()}`
        : renameValue.trim();

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

  const renderNode = (node: TreeNode, depth: number = 0): React.ReactNode => {
    if (node.type === "folder") {
      const isExpanded = expandedFolders.has(node.path);
      const FolderIcon = isExpanded ? FolderOpen : Folder;
      const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;
      const isRequired = isRequiredFolder?.(node.path);
      const canModify = allowModify && !isRequired;

      return (
        <div key={node.path} className="mb-0.5 group">
          <div className="flex items-center gap-1 w-full px-1 py-1 text-sm hover:bg-(--gray-4) rounded">
            <button
              className="flex items-center gap-1 flex-1"
              onClick={() => toggleFolder(node.path)}
            >
              <ChevronIcon size="0.875rem" className="text-(--gray-9) shrink-0" />
              <FolderIcon size="1rem" className="text-(--gray-11) shrink-0" />
              <span className="font-medium truncate">{node.name}</span>
              {isRequired && (
                <span className="text-xs text-(--gray-9)">(required)</span>
              )}
            </button>
            {canModify && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="p-1 opacity-0 group-hover:opacity-100 hover:bg-(--gray-6) rounded transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddFileInFolder(node.path);
                      }}
                    >
                      <FilePlus size="1rem" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Add file to this folder</TooltipContent>
                </Tooltip>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-(--gray-6) rounded transition-opacity">
                      <MoreHorizontal size="1rem" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      variant="destructive"
                      className="text-(--red-11) focus:text-(--red-11)"
                      onSelect={(e) => {
                        e.preventDefault();
                        handleDeleteFolder(node.path);
                      }}
                    >
                      <Trash2 size="1rem" />
                      Delete Folder
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
          {isExpanded && (
            <div className="space-y-0.5">
              {node.children.map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    const displayName = getDisplayName
      ? getDisplayName(node.path)
      : node.name;
    const isReadonly = isReadonlyFile?.(node.path);
    const isRequired = isRequiredFile?.(node.path);
    const canModify = allowModify && !isReadonly && !isRequired;

    return (
      <div
        key={node.path}
        className={cn(
          "group relative flex items-center gap-2 rounded text-sm transition-colors",
          selectedFile === node.path
            ? "bg-(--gray-4) text-(--gray-12) font-medium"
            : "hover:bg-(--gray-4) text-(--gray-11)"
        )}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        <button
          className="flex-1 pl-2 pr-1 py-1 text-left flex items-center gap-2 w-full"
          onClick={() => onSelectFile(node.path)}
        >
          <FileIcon className="w-4 h-4 shrink-0" />
          <span className="truncate">{displayName}</span>
          {isReadonly && (
            <span className="text-xs text-(--gray-9)">(readonly)</span>
          )}
          {isRequired && !isReadonly && (
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
                  handleRenameClick(node.path);
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
                  handleDeleteClick(node.path);
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

  return (
    <div
      ref={containerRef}
      style={{ width: size }}
      className="relative border-r h-full"
    >
      <div className="flex justify-between items-center mb-3 border-b p-2 gap-2">
        <h6 className="text-xs">Files</h6>
        <div className="flex items-center gap-1">
          {isLoading ? (
            <Skeleton className="h-5 w-16" />
          ) : allowModify ? (
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
                  <DialogTitle>
                    {folderForNewFile
                      ? `Create File in ${folderForNewFile}`
                      : "Create New File"}
                  </DialogTitle>
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
                    {folderForNewFile && (
                      <p className="text-xs text-(--gray-10)">
                        File will be created in the <code>{folderForNewFile}/</code> folder
                      </p>
                    )}
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
          ) : null}
          {!isLoading && files.length > 0 && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="text-(--gray-11) hover:text-(--gray-12) p-1"
                    onClick={expandAll}
                  >
                    <UnfoldVertical size="1rem" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Expand All</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="text-(--gray-11) hover:text-(--gray-12) p-1"
                    onClick={collapseAll}
                  >
                    <UnfoldHorizontal size="1rem" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Collapse All</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </div>
      <div className="space-y-1.5 px-1 overflow-auto max-h-[calc(100%-3rem)]">
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </>
        ) : (
          tree.map((node) => renderNode(node))
        )}
      </div>
      <button
        {...events}
        ref={buttonRef}
        className="w-4 h-8 bg-(--gray-1) border rounded absolute -right-2 z-10 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing active:bg-(--gray-1)/90 flex items-center justify-center"
      >
        <GripVertical size="0.9rem" />
      </button>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader className="p-4">
            <DialogTitle>{isFolderToDelete ? "Delete Folder" : "Delete File"}</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {isFolderToDelete ? (
              <p className="text-(--gray-12)">
                Are you sure you want to delete the folder{" "}
                <span className="font-medium">{fileToDelete}</span>
                ? All files inside will also be deleted.
              </p>
            ) : (
              <p className="text-(--gray-12)">
                Are you sure you want to delete{" "}
                <span className="font-medium">
                  {fileToDelete
                    ? getDisplayName
                      ? getDisplayName(fileToDelete)
                      : fileToDelete
                    : ""}
                </span>
                ?
              </p>
            )}
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
                placeholder="e.g., main.go"
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

export default FileTree;
