import { useEffect, useState } from "react";
import { Check, Copy, FileCode } from "lucide-react";
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
}

function CodePreview({ files, runner, className }: CodePreviewProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (files.length > 0 && selectedFile === null) {
      setSelectedFile(files[0].name);
    }
  }, [files, selectedFile]);

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
      </div>

      <div className="flex min-h-0 border rounded-lg overflow-hidden h-64">
        <FileTree
          files={files}
          selectedFile={selectedFile}
          onSelectFile={setSelectedFile}
          allowModify={false}
          onChange={() => {}}
        />
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
