import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { CodeBlockNodeView } from "~/components/tiptap-node/code-block-node/code-block-node-view"

// CodeBlockLowlight extended with a React node view that renders a
// language selector. Configure it (lowlight instance, etc.) at the call site.
export const CodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockNodeView)
  },
})
