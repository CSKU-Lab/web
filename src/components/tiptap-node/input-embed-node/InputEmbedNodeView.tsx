"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useParams } from "next/navigation";
import { FormInput, Trash2 } from "lucide-react";
import { InlineInputEditor } from "~/components/tiptap-node/input-embed-node/InlineInputEditor";

export function InputEmbedNodeView({
  node,
  editor,
  deleteNode,
}: NodeViewProps) {
  const { nodeID, label, pattern, score } = node.attrs as {
    nodeID: string;
    label: string;
    pattern: string;
    score: number;
    caseInsensitive: boolean;
  };

  const params = useParams();
  const isEditable = editor.isEditable;

  if (!isEditable) {
    // Student view: inline scorable input
    const sectionID = params.sectionID as string;
    const labID = (params.slug ?? params.labID) as string;

    return (
      <NodeViewWrapper>
        <InlineInputEditor
          nodeID={nodeID}
          label={label}
          score={score}
          sectionID={sectionID}
          labID={labID}
        />
      </NodeViewWrapper>
    );
  }

  // CMS editor view: static config card
  return (
    <NodeViewWrapper>
      <div
        contentEditable={false}
        className="flex items-center justify-between gap-3 border rounded-lg p-3 bg-(--gray-2) my-2 select-none"
      >
        <div className="flex items-center gap-2 min-w-0">
          <FormInput size="1rem" className="text-(--gray-10) shrink-0" />
          <span className="text-sm font-medium text-(--gray-12) truncate">
            {label || "Input Field"}
          </span>
          {pattern && (
            <code className="text-xs font-mono text-(--gray-10) truncate max-w-[16rem]">
              {pattern}
            </code>
          )}
          <span className="text-xs text-(--gray-10) shrink-0">{score} pts</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={deleteNode}
            className="p-1 rounded hover:bg-(--tomato-3) text-(--gray-10) hover:text-(--tomato-11) transition-colors"
            title="Remove input"
          >
            <Trash2 size="0.875rem" />
          </button>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
