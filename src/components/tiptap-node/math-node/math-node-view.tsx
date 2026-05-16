import * as React from "react"
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react"
import katex from "katex"
import { cn } from "~/lib/tiptap-utils"
import { CheckIcon, XIcon } from "lucide-react"

type MathNodeType = "mathInline" | "mathBlock"

export function MathNodeView({ node, editor, getPos }: NodeViewProps) {
  const nodeName = node.type.name as MathNodeType
  const latex = node.attrs.latex as string
  const isBlock = nodeName === "mathBlock"
  const [isEditing, setIsEditing] = React.useState(false)
  const [editValue, setEditValue] = React.useState("")
  const [html, setHtml] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [previewHtml, setPreviewHtml] = React.useState("")
  const [previewError, setPreviewError] = React.useState<string | null>(null)
  const [isSelected, setIsSelected] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const didAutoEdit = React.useRef(false)

  React.useEffect(() => {
    if (!latex && !didAutoEdit.current && editor.isEditable) {
      didAutoEdit.current = true
      queueMicrotask(() => setIsEditing(true))
      return
    }
    if (!isEditing) {
      if (!latex) {
        setHtml("")
        setError("Empty equation")
        return
      }
      try {
        const rendered = katex.renderToString(latex, {
          displayMode: isBlock,
          throwOnError: true,
          trust: true,
        })
        setHtml(rendered)
        setError(null)
      } catch (e) {
        setHtml("")
        setError(e instanceof Error ? e.message : "Invalid LaTeX")
      }
    }
  }, [latex, isBlock, isEditing, editor])

  React.useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isEditing])

  React.useEffect(() => {
    if (!isEditing) return
    if (!editValue) {
      setPreviewHtml("")
      setPreviewError(null)
      return
    }
    try {
      const rendered = katex.renderToString(editValue, {
        displayMode: isBlock,
        throwOnError: true,
        trust: true,
      })
      setPreviewHtml(rendered)
      setPreviewError(null)
    } catch (e) {
      setPreviewHtml("")
      setPreviewError(e instanceof Error ? e.message : "Invalid LaTeX")
    }
  }, [editValue, isBlock, isEditing])

  React.useEffect(() => {
    if (typeof getPos !== "function") return

    const checkSelection = () => {
      const pos = getPos()
      if (pos == null) return
      const { from, to, empty } = editor.state.selection
      if (empty) {
        setIsSelected(false)
        return
      }
      const nodeSize = node.nodeSize
      const nodeStart = pos
      const nodeEnd = pos + nodeSize
      const overlaps = from < nodeEnd && to > nodeStart
      setIsSelected(overlaps)
    }

    checkSelection()
    editor.on("selectionUpdate", checkSelection)
    editor.on("transaction", checkSelection)

    return () => {
      editor.off("selectionUpdate", checkSelection)
      editor.off("transaction", checkSelection)
    }
  }, [editor, getPos, node.nodeSize])

  const startEditing = React.useCallback(() => {
    if (!editor.isEditable) return
    setEditValue(latex)
    setIsEditing(true)
  }, [editor, latex])

  const handleDoubleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      startEditing()
    },
    [startEditing]
  )

  const handleSave = React.useCallback(() => {
    if (!editValue.trim() || previewError) return
    if (typeof getPos === "function") {
      const pos = getPos()
      if (pos == null) return
      editor.commands.command(({ tr }) => {
        tr.setNodeMarkup(pos, undefined, { latex: editValue.trim() })
        return true
      })
    }
    setIsEditing(false)
  }, [editValue, previewError, getPos, editor])

  const handleCancel = React.useCallback(() => {
    setIsEditing(false)
    setEditValue("")
  }, [])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancel()
      } else if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        handleSave()
      }
    },
    [handleCancel, handleSave]
  )

  if (isEditing) {
    return (
      <NodeViewWrapper
        as={isBlock ? "div" : "span"}
        className={cn(
          "math-node",
          "math-node--editing",
          isBlock ? "math-node--block" : "math-node--inline"
        )}
        data-type={isBlock ? "math-block" : "math-inline"}
        data-display={isBlock ? "block" : "inline"}
        data-latex={latex}
      >
        <div className="math-node-editor">
          <textarea
            ref={textareaRef}
            className="math-node-edit-input"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type LaTeX..."
            rows={1}
          />
          <div className="math-node-edit-actions">
            <button
              type="button"
              className={cn(
                "math-node-edit-btn",
                "math-node-edit-btn--cancel"
              )}
              onClick={handleCancel}
              title="Cancel (Esc)"
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className={cn(
                "math-node-edit-btn",
                "math-node-edit-btn--save",
                (!editValue.trim() || previewError) && "disabled"
              )}
              disabled={!editValue.trim() || !!previewError}
              onClick={handleSave}
              title="Save (Cmd/Ctrl+Enter)"
            >
              <CheckIcon className="w-3.5 h-3.5" />
            </button>
          </div>
          {editValue && (
            <div
              className={cn(
                "math-node-edit-preview",
                previewError && "math-node-edit-preview--error"
              )}
            >
              {previewError ? (
                <span className="math-node-edit-preview-error">{previewError}</span>
              ) : (
                <span dangerouslySetInnerHTML={{ __html: previewHtml }} />
              )}
            </div>
          )}
        </div>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper
      as={isBlock ? "div" : "span"}
      className={cn(
        "math-node",
        isBlock ? "math-node--block" : "math-node--inline",
        isSelected && "math-node--selected",
        error && "math-node--error"
      )}
      data-type={isBlock ? "math-block" : "math-inline"}
      data-display={isBlock ? "block" : "inline"}
      data-latex={latex}
      onDoubleClick={handleDoubleClick}
    >
      {error ? (
        <span className="math-node-error" title={error}>
          {latex || "Empty"}
        </span>
      ) : (
        <span dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </NodeViewWrapper>
  )
}
