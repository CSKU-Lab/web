import { mergeAttributes, Node } from "@tiptap/react"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { MathNodeView } from "~/components/tiptap-node/math-node/math-node-view"
import type { NodeType } from "@tiptap/pm/model"

export interface MathBlockNodeOptions {
  type?: string | NodeType | undefined
  HTMLAttributes?: Record<string, any>
}

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    mathBlock: {
      setMathBlock: (attrs: { latex: string }) => ReturnType
    }
  }
}

export const MathBlockNode = Node.create<MathBlockNodeOptions>({
  name: "mathBlock",

  group: "block",

  inline: false,

  draggable: true,

  selectable: true,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      latex: {
        default: "",
      },
    }
  },

  parseHTML() {
    return [{
      tag: 'div[data-type="math-block"]',
      getAttrs: (dom) => {
        const el = dom as HTMLElement
        return { latex: el.getAttribute("data-latex") ?? "" }
      },
    }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const latex = (node.attrs.latex as string) ?? ""
    return [
      "div",
      mergeAttributes(
        { "data-type": "math-block", "data-display": "block", "data-latex": latex },
        HTMLAttributes
      ),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathNodeView)
  },

  addCommands() {
    return {
      setMathBlock:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { latex: attrs.latex },
          })
        },
    }
  },
})

export default MathBlockNode
