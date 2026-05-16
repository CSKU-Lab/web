import { mergeAttributes, Node } from "@tiptap/react"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { MathNodeView } from "~/components/tiptap-node/math-node/math-node-view"
import type { NodeType } from "@tiptap/pm/model"

export interface MathInlineNodeOptions {
  type?: string | NodeType | undefined
  HTMLAttributes?: Record<string, any>
}

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    mathInline: {
      setMathInline: (attrs: { latex: string }) => ReturnType
    }
  }
}

export const MathInlineNode = Node.create<MathInlineNodeOptions>({
  name: "mathInline",

  group: "inline",

  inline: true,

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
      tag: 'span[data-type="math-inline"]',
      getAttrs: (dom) => {
        const el = dom as HTMLElement
        return { latex: el.getAttribute("data-latex") ?? "" }
      },
    }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const latex = (node.attrs.latex as string) ?? ""
    return [
      "span",
      mergeAttributes(
        { "data-type": "math-inline", "data-display": "inline", "data-latex": latex },
        HTMLAttributes
      ),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathNodeView)
  },

  addCommands() {
    return {
      setMathInline:
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

export default MathInlineNode
