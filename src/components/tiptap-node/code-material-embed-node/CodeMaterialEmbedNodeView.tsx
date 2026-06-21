"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useParams } from "next/navigation";
import { ExternalLink, Code2, Trash2 } from "lucide-react";
import { InlineCodeEditor } from "~/components/tiptap-node/code-material-embed-node/InlineCodeEditor";

export function CodeMaterialEmbedNodeView({
  node,
  editor,
  deleteNode,
}: NodeViewProps) {
  const { materialID, title, autoScore } = node.attrs as {
    materialID: string;
    title: string;
    autoScore: number;
  };

  const params = useParams();
  const isEditable = editor.isEditable;

  if (!isEditable) {
    // Student view: full inline code editor
    const sectionID = params.sectionID as string;
    const labID = (params.slug ?? params.labID) as string;

    return (
      <NodeViewWrapper>
        <InlineCodeEditor
          materialID={materialID}
          sectionID={sectionID}
          labID={labID}
        />
      </NodeViewWrapper>
    );
  }

  // CMS editor view: static preview card
  const courseID = params.courseID as string;
  const cmsMaterialURL = `/cms/courses/${courseID}/materials/${materialID}`;

  return (
    <NodeViewWrapper>
      <div
        contentEditable={false}
        className="flex items-center justify-between gap-3 border rounded-lg p-3 bg-(--gray-2) my-2 select-none"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Code2 size="1rem" className="text-(--gray-10) shrink-0" />
          <span className="text-sm font-medium text-(--gray-12) truncate">
            {title || "Code Problem"}
          </span>
          <span className="text-xs text-(--gray-10) shrink-0">
            {autoScore} pts
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <a
            href={cmsMaterialURL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded hover:bg-(--gray-4) text-(--gray-10) hover:text-(--gray-12) transition-colors"
            title="Open in CMS"
          >
            <ExternalLink size="0.875rem" />
          </a>
          <button
            type="button"
            onClick={deleteNode}
            className="p-1 rounded hover:bg-(--tomato-3) text-(--gray-10) hover:text-(--tomato-11) transition-colors"
            title="Remove embed"
          >
            <Trash2 size="0.875rem" />
          </button>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
