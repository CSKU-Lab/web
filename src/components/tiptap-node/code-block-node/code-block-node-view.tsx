import * as React from "react"
import {
  NodeViewContent,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

// Values must match the languages registered with lowlight in
// `~/components/tiptap-templates/simple/extensions.ts`.
export const CODE_BLOCK_LANGUAGES = [
  { label: "Plain text", value: "plaintext" },
  { label: "Go", value: "go" },
  { label: "C", value: "c" },
  { label: "C++", value: "cpp" },
  { label: "Python", value: "python" },
  { label: "JavaScript", value: "javascript" },
] as const

export function CodeBlockNodeView({
  node,
  updateAttributes,
}: NodeViewProps) {
  const language = (node.attrs.language as string) || "plaintext"

  // The toolbar is always rendered; CSS gates its visibility on the live
  // `contenteditable` attribute ProseMirror sets on the editor root, and reveals
  // it on hover. Gating in CSS (rather than a render-time `editor.isEditable`
  // read) keeps it correct even if editability flips after the node view mounts,
  // since the editor runs with shouldRerenderOnTransaction: false.
  return (
    <NodeViewWrapper className="code-block-node">
      <div
        className="code-block-node__toolbar"
        contentEditable={false}
        // Keep ProseMirror from hijacking pointer/selection on the control.
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Select
          value={language}
          onValueChange={(value) => updateAttributes({ language: value })}
        >
          <SelectTrigger size="sm" className="code-block-node__language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CODE_BLOCK_LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <pre>
        <NodeViewContent<"code"> as="code" className={`language-${language}`} />
      </pre>
    </NodeViewWrapper>
  )
}
