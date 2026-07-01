import { mergeAttributes, Node } from "@tiptap/react";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { InputEmbedNodeView } from "~/components/tiptap-node/input-embed-node/InputEmbedNodeView";

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    inputEmbed: {
      insertInputEmbed: (attrs: {
        nodeID: string;
        label: string;
        pattern: string;
        score: number;
        caseInsensitive: boolean;
      }) => ReturnType;
    };
  }
}

export const InputEmbedNode = Node.create({
  name: "inputEmbed",

  group: "block",

  atom: true,

  draggable: true,

  selectable: true,

  addAttributes() {
    return {
      nodeID: { default: null },
      label: { default: "" },
      pattern: { default: "" },
      score: { default: 0 },
      caseInsensitive: { default: false },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="input-embed"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        {
          "data-type": "input-embed",
          "data-node-id": node.attrs.nodeID,
          "data-label": node.attrs.label,
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
