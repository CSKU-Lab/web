import { mergeAttributes, Node } from "@tiptap/react";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { InputEmbedNodeView } from "~/components/tiptap-node/input-embed-node/InputEmbedNodeView";

export type InputEmbedMode = "exact" | "regex" | "manual";

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    inputEmbed: {
      insertInputEmbed: (attrs: {
        nodeID: string;
        label: string;
        mode: InputEmbedMode;
        pattern: string;
        score: number;
        caseInsensitive: boolean;
      }) => ReturnType;
    };
  }
}

export const InputEmbedNode = Node.create({
  name: "inputEmbed",

  group: "inline",

  inline: true,

  atom: true,

  draggable: true,

  selectable: true,

  addAttributes() {
    return {
      nodeID: { default: null },
      label: { default: "" },
      // Scoring mode: exact (strict equality) | regex | manual (pending review).
      // Legacy nodes predate this attr and were regex-graded, so absent mode
      // resolves to "regex". New inserts always pass an explicit mode.
      mode: { default: "regex" },
      pattern: { default: "" },
      score: { default: 0 },
      caseInsensitive: { default: false },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="input-embed"]',
        getAttrs: (dom) => {
          const el = dom as HTMLElement;
          return {
            nodeID: el.getAttribute("data-node-id"),
            label: el.getAttribute("data-label") ?? "",
            mode: el.getAttribute("data-mode") ?? "regex",
            pattern: el.getAttribute("data-pattern") ?? "",
            score: Number(el.getAttribute("data-score") ?? 0),
            caseInsensitive: el.getAttribute("data-case-insensitive") === "true",
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(
        {
          "data-type": "input-embed",
          "data-node-id": node.attrs.nodeID,
          "data-label": node.attrs.label,
          "data-mode": node.attrs.mode,
          "data-pattern": node.attrs.pattern,
          "data-score": node.attrs.score,
          "data-case-insensitive": node.attrs.caseInsensitive,
        },
        HTMLAttributes,
      ),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(InputEmbedNodeView);
  },

  addCommands() {
    return {
      insertInputEmbed:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
    };
  },
});
