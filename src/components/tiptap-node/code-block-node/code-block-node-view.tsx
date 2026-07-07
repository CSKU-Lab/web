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
import { Button } from "~/components/ui/button"
import { MermaidDiagram } from "~/components/tiptap-node/code-block-node/mermaid-diagram"

// Values must match the languages registered with lowlight in
// `~/components/tiptap-templates/simple/extensions.ts`.
export const CODE_BLOCK_LANGUAGES = [
  { label: "Plain text", value: "plaintext" },
  { label: "Go", value: "go" },
  { label: "C", value: "c" },
  { label: "C++", value: "cpp" },
  { label: "Python", value: "python" },
  { label: "JavaScript", value: "javascript" },
  { label: "Mermaid", value: "mermaid" },
] as const

// Aliases that highlight correctly via lowlight but aren't their own select
// option — fold them onto the canonical value so the dropdown shows a match.
const LANGUAGE_ALIASES: Record<string, string> = {
  py: "python",
  js: "javascript",
  "c++": "cpp",
}

export function CodeBlockNodeView({
  node,
  updateAttributes,
  editor,
}: NodeViewProps) {
  const rawLanguage = (node.attrs.language as string) || "plaintext"
  const language = LANGUAGE_ALIASES[rawLanguage] ?? rawLanguage
  const isMermaid = language === "mermaid"

  // Mermaid blocks open in edit mode (an empty diagram shows nothing); the
  // toggle flips to the rendered preview once there is content. Toggling is a
  // React state change, so the preview reads the current `node.textContent`
  // even though the editor runs with shouldRerenderOnTransaction: false.
  const [showPreview, setShowPreview] = React.useState(false)

  // Read-only viewers (students) can't reach the Preview toggle, so a mermaid
  // block would otherwise render as raw source text. Force the rendered diagram
  // whenever the editor isn't editable.
  const renderPreview = isMermaid && (showPreview || !editor.isEditable)

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
          onValueChange={(value) => {
            updateAttributes({ language: value })
            // Reset to edit mode when switching languages.
            setShowPreview(false)
          }}
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

        {isMermaid && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-active-state={showPreview ? "on" : "off"}
            onClick={() => setShowPreview((prev) => !prev)}
          >
            {showPreview ? "Edit" : "Preview"}
          </Button>
        )}
      </div>

      {renderPreview ? (
        <div contentEditable={false} className="code-block-node__preview">
          <MermaidDiagram source={node.textContent} />
        </div>
      ) : (
        <pre spellCheck={false}>
          <NodeViewContent<"code"> as="code" className={`language-${language}`} spellCheck={false} />
        </pre>
      )}
    </NodeViewWrapper>
  )
}
