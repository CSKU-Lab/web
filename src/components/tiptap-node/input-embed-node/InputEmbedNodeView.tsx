"use client";

import { useState } from "react";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useParams } from "next/navigation";
import { FormInput, Pencil, Trash2 } from "lucide-react";
import { InlineInputEditor } from "~/components/tiptap-node/input-embed-node/InlineInputEditor";
import { InputEmbedDialog } from "~/components/tiptap-node/input-embed-node/InputEmbedDialog";
import type { InputEmbedMode } from "~/components/tiptap-node/input-embed-node/input-embed-node-extension";
import { getDocumentReview } from "~/components/tiptap-node/document-review/document-review-extension";
import { ReviewInputEmbed } from "~/features/cms/submissions/components/renderers/ReviewInputEmbed";

const MODE_LABEL: Record<InputEmbedMode, string> = {
  exact: "Exact",
  regex: "Regex",
  manual: "Manual",
};

export function InputEmbedNodeView({
  node,
  editor,
  deleteNode,
  updateAttributes,
}: NodeViewProps) {
  const { nodeID, label, mode, pattern, score, caseInsensitive } =
    node.attrs as {
      nodeID: string;
      label: string;
      mode: InputEmbedMode;
      pattern: string;
      score: number;
      caseInsensitive: boolean;
    };

  const params = useParams();
  const [editOpen, setEditOpen] = useState(false);
  const isEditable = editor.isEditable;
  const review = getDocumentReview(editor.storage);

  if (!isEditable) {
    // Instructor submission review: show the selected student's submitted value.
    if (review) {
      return (
        <NodeViewWrapper as="span" className="inline-block align-middle">
          <ReviewInputEmbed
            courseID={params.courseID as string}
            documentMaterialID={params.materialID as string}
            nodeID={nodeID}
            label={label}
            mode={mode}
            score={score}
            studentID={review.studentID}
          />
        </NodeViewWrapper>
      );
    }

    // Student view: inline scorable input
    const sectionID = params.sectionID as string;
    const labID = (params.slug ?? params.labID) as string;

    return (
      <NodeViewWrapper as="span" className="inline-block align-middle">
        <InlineInputEditor
          nodeID={nodeID}
          label={label}
          mode={mode}
          score={score}
          sectionID={sectionID}
          labID={labID}
        />
      </NodeViewWrapper>
    );
  }

  // CMS editor view: compact inline config chip
  return (
    <NodeViewWrapper as="span" className="inline-block align-middle">
      <span
        contentEditable={false}
        className="inline-flex items-center gap-1.5 border rounded-md px-1.5 py-0.5 bg-(--gray-2) select-none align-middle"
      >
        <FormInput size="0.875rem" className="text-(--gray-10) shrink-0" />
        <span className="text-xs font-medium text-(--gray-12) truncate max-w-[10rem]">
          {label || "Input Field"}
        </span>
        <span className="text-[0.625rem] uppercase tracking-wide text-(--gray-10) shrink-0">
          {MODE_LABEL[mode] ?? mode}
        </span>
        {mode !== "manual" && pattern && (
          <code className="text-[0.625rem] font-mono text-(--gray-10) truncate max-w-[10rem]">
            {pattern}
          </code>
        )}
        <span className="text-[0.625rem] text-(--gray-10) shrink-0">
          {score} pts
        </span>
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="p-0.5 rounded hover:bg-(--gray-4) text-(--gray-10) hover:text-(--gray-12) transition-colors shrink-0"
          title="Edit input"
        >
          <Pencil size="0.75rem" />
        </button>
        <button
          type="button"
          onClick={deleteNode}
          className="p-0.5 rounded hover:bg-(--tomato-3) text-(--gray-10) hover:text-(--tomato-11) transition-colors shrink-0"
          title="Remove input"
        >
          <Trash2 size="0.75rem" />
        </button>
      </span>

      <InputEmbedDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Input Field"
        submitLabel="Save"
        initial={{ label, mode, pattern, score, caseInsensitive }}
        // updateAttributes mutates the node in place, preserving nodeID so
        // existing submissions stay linked and can be rescored via Regrade All.
        onSubmit={(values) => updateAttributes(values)}
      />
    </NodeViewWrapper>
  );
}
