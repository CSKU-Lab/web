import { mergeAttributes, Node } from "@tiptap/react";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CodeMaterialEmbedNodeView } from "~/components/tiptap-node/code-material-embed-node/CodeMaterialEmbedNodeView";

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    codeMaterialEmbed: {
      insertCodeMaterialEmbed: (attrs: {
        materialID: string;
        title: string;
        autoScore: number;
      }) => ReturnType;
    };
  }
}

export const CodeMaterialEmbedNode = Node.create({
  name: "codeMaterialEmbed",

  group: "block",

  atom: true,

  draggable: true,

  selectable: true,

  addAttributes() {
    return {
      materialID: { default: null },
      title: { default: "" },
      autoScore: { default: 0 },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="code-material-embed"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        {
          "data-type": "code-material-embed",
          "data-material-id": node.attrs.materialID,
          "data-title": node.attrs.title,
          "data-auto-score": node.attrs.autoScore,
        },
        HTMLAttributes,
      ),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeMaterialEmbedNodeView);
  },

  addCommands() {
    return {
      insertCodeMaterialEmbed:
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
