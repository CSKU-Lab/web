import * as React from "react"
import type { Editor } from "@tiptap/react"

import { Table } from "lucide-react"

import { useTiptapEditor } from "~/hooks/use-tiptap-editor"

export const TABLE_SHORTCUT_KEY = "mod+shift+t"

export interface UseTableConfig {
  editor?: Editor | null
  hideWhenUnavailable?: boolean
  onToggled?: () => void
}

export function canInsertTable(
  editor: Editor | null,
  rows: number = 3,
  cols: number = 3
): boolean {
  if (!editor || !editor.isEditable) return false

  try {
    return editor.can().insertTable({ rows, cols, withHeaderRow: true })
  } catch {
    return false
  }
}

export function insertTable(
  editor: Editor | null,
  rows: number = 3,
  cols: number = 3
): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canInsertTable(editor, rows, cols)) return false

  try {
    editor.commands.insertTable({ rows, cols, withHeaderRow: true })
    return true
  } catch {
    return false
  }
}

export function shouldShowTableButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = props

  if (!editor || !editor.isEditable) return false

  if (hideWhenUnavailable) {
    return canInsertTable(editor)
  }

  return true
}

export function useTable(config?: UseTableConfig) {
  const { editor: providedEditor, hideWhenUnavailable = false, onToggled } = config || {}

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = React.useState<boolean>(true)

  React.useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowTableButton({ editor, hideWhenUnavailable }))
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable])

  const handleInsert = React.useCallback(() => {
    if (!editor) return false

    const success = insertTable(editor)
    if (success) {
      onToggled?.()
    }
    return success
  }, [editor, onToggled])

  return {
    isVisible,
    handleInsert,
    canToggle: canInsertTable(editor),
    label: "Insert Table",
    shortcutKeys: TABLE_SHORTCUT_KEY,
    Icon: Table,
  }
}
