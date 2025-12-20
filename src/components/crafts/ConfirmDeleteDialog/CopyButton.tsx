import { useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../../ui/tooltip";
import { Clipboard } from "lucide-react";

interface Props {
  confirmText: string;
}

function CopyButton({ confirmText }: Props) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(confirmText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return (
    <Tooltip open={isCopied}>
      <TooltipTrigger asChild onFocus={(e) => e.stopPropagation()}>
        <div className="text-accent rounded text-xs font-semibold flex items-center gap-1 bg-(--gray-6) max-w-64">
          <p className="pl-1.5 py-0.5 text-(--gray-12) flex-1 whitespace-nowrap overflow-x-auto">{confirmText}</p>
          <div className="h-full w-0.5 bg-(--gray-3)"></div>
          <button
            onClick={handleCopyToClipboard}
            className="bg-(--gray-6) p-0.5 pr-1.5 text-(--gray-12)"
          >
            <Clipboard size="0.75rem" />
          </button>
        </div>
      </TooltipTrigger>
      <TooltipContent>Copied</TooltipContent>
    </Tooltip>
  );
}

export default CopyButton;
