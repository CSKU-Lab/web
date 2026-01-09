import { useEffect, useState } from "react";
import CodeMirror from "~/components/Editor/CodeMirror";
import { Button } from "~/components/ui/button";
import { Check, Copy } from "lucide-react";
import { copyToClipboard } from "~/lib/copyToClipboard";
import { cn } from "~/lib/utils";

const hardCode = `print("Hello World")





`;

function CodeBlock() {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = () => {
    copyToClipboard(hardCode);
    setIsCopied(true);
  };

  return (
    <div className="mt-4 mb-2 space-y-2">
      <div className="flex justify-between items-center">
        <h6 className="text-sm font-semibold text-(--gray-11)">
          Code | Python3
        </h6>
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
      <div className="border rounded-lg h-64 overflow-y-auto">
        <CodeMirror readOnly lang="python3" value={hardCode} />
      </div>
    </div>
  );
}

export default CodeBlock;
