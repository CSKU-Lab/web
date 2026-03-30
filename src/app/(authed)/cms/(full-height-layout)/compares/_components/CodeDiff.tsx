"use client";

import { useMemo } from "react";
import CodeMirror from "~/components/Editor/CodeMirror";

interface CodeDiffProps {
  leftContent: string;
  rightContent: string;
  leftLabel?: string;
  rightLabel?: string;
  fileName?: string;
  extension?: string;
}

function CodeDiff({
  leftContent,
  rightContent,
  leftLabel = "Runner A",
  rightLabel = "Runner B",
  fileName,
  extension = "sh",
}: CodeDiffProps) {
  const areEqual = useMemo(() => {
    return leftContent.trim() === rightContent.trim();
  }, [leftContent, rightContent]);

  return (
    <div className="border border-(--gray-6) rounded-md overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-(--gray-6)">
        <div className="flex-1 px-3 py-2 bg-(--gray-2) border-r border-(--gray-6)">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-(--gray-11)">
              {leftLabel}
            </span>
            {fileName && (
              <span className="text-xs text-(--gray-9)">{fileName}</span>
            )}
          </div>
        </div>
        <div className="flex-1 px-3 py-2 bg-(--gray-2)">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-(--gray-11)">
              {rightLabel}
            </span>
            {fileName && (
              <span className="text-xs text-(--gray-9)">{fileName}</span>
            )}
          </div>
        </div>
      </div>

      {/* Status indicator */}
      {!areEqual && (
        <div className="px-3 py-1.5 bg-(--yellow-3) border-b border-(--yellow-6)">
          <span className="text-xs text-(--yellow-11)">
            ⚠️ Differences detected
          </span>
        </div>
      )}
      {areEqual && (
        <div className="px-3 py-1.5 bg-(--grass-3) border-b border-(--grass-6)">
          <span className="text-xs text-(--grass-11)">
            ✓ Content is identical
          </span>
        </div>
      )}

      {/* Code comparison */}
      <div className="flex">
        <div className="flex-1 border-r border-(--gray-6)">
          <CodeMirror
            value={leftContent}
            extension={extension}
            readOnly={true}
            editable={false}
            fontSize={12}
            className="min-h-[200px] max-h-[400px]"
          />
        </div>
        <div className="flex-1">
          <CodeMirror
            value={rightContent}
            extension={extension}
            readOnly={true}
            editable={false}
            fontSize={12}
            className="min-h-[200px] max-h-[400px]"
          />
        </div>
      </div>
    </div>
  );
}

export default CodeDiff;
