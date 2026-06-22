import { useEffect, useState } from "react";
import { Check, Copy, FileCode, PanelLeftOpen, CornerUpLeft } from "lucide-react";
import CodeMirror from "~/components/Editor/CodeMirror";
import FileTree from "~/components/Editor/FileTree";
import { Button } from "~/components/ui/button";
import { copyToClipboard } from "~/lib/copyToClipboard";
import { cn } from "~/lib/utils";
import type { CodeFile } from "~/components/Editor/types/editor";

interface CodePreviewProps {
  files: CodeFile[];
  runner?: { id: string; name: string };
  className?: string;
  onReplace?: (files: CodeFile[]) => void;
}

function CodePreview({ files, runner, className, onReplace }: CodePreviewProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isFileTreeCollapsed, setIsFileTreeCollapsed] = useState(false);

  if (files.length > 0 && selectedFile === null) {
    setSelectedFile(files[0].name);
  }

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const currentFile = files.find((f) => f.name === selectedFile);
  const fileExtension = currentFile?.name.split(".").pop();

  const handleCopy = () => {
    copyToClipboard(currentFile?.content ?? "");
    setIsCopied(true);
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <h6 className="text-sm font-semibold text-(--gray-11)">Code</h6>
          {runner && (
            <span className="text-xs text-(--gray-9)">| {runner.name}</span>
          )}
        </div>
        {onReplace ? (
          <Button
            onClick={() => onReplace(files)}
            variant="secondary"
            size="sm"
            className="text-(--gray-11) space-x-2"
          >
            <CornerUpLeft size="0.875rem" />
            <span className="text-xs font-medium">Use This Code</span>
          </Button>
        ) : (
          <Button
            onClick={handleCopy}
            variant="secondary"
            size="sm"
            className="text-(--gray-11) space-x-2"
          >
            {isCopied ? (
              <Check className="text-(--grass-10)" size="0.95rem" />
            ) : (
              <Copy size="0.75rem" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                isCopied && "text-(--grass-10)",
              )}
            >
              {isCopied ? "Copied!" : "Copy"}
            </span>
          </Button>
        )}
      </div>

      <div className="flex-1 flex min-h-0 border rounded-lg overflow-hidden">
        {isFileTreeCollapsed ? (
          <button
            onClick={() => setIsFileTreeCollapsed(false)}
            className="border-r flex flex-col items-center pt-2 px-1.5 hover:bg-(--gray-2) transition-colors text-(--gray-9) hover:text-(--gray-11)"
            title="Expand file tree"
          >
            <PanelLeftOpen size="1rem" />
          </button>
        ) : (
          <FileTree
            files={files}
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            allowModify={false}
            onChange={() => {}}
            onCollapse={() => setIsFileTreeCollapsed(true)}
          />
        )}
        <div className="flex-1 min-h-0 overflow-auto">
          {currentFile ? (
            <CodeMirror
              readOnly
              className="h-full"
              extension={fileExtension}
              value={currentFile.content}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-(--gray-11)">
              <FileCode size="3rem" className="mb-3 opacity-50" />
              <p className="text-sm">No file selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CodePreview;
