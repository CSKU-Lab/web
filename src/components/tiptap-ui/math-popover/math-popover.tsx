"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"

import { useTiptapEditor } from "~/hooks/use-tiptap-editor"
import { Button } from "~/components/tiptap-ui-primitive/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/tiptap-ui-primitive/dropdown-menu"
import { Card, CardBody } from "~/components/tiptap-ui-primitive/card"
import { ChevronDownIcon } from "~/components/tiptap-icons/chevron-down-icon"
import { FunctionIcon } from "~/components/tiptap-icons/function-icon"
import type { ButtonProps } from "~/components/tiptap-ui-primitive/button"

export type MathType = "mathInline" | "mathBlock"

export interface MathButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor
  type: MathType
  text?: string
  showTooltip?: boolean
}

export const MATH_CONFIG: Record<MathType, { label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }> = {
  mathInline: {
    label: "Inline Equation",
    Icon: FunctionIcon,
  },
  mathBlock: {
    label: "Block Equation",
    Icon: FunctionIcon,
  },
}

export const MathButton = React.forwardRef<HTMLButtonElement, MathButtonProps>(
  (
    {
      editor: providedEditor,
      type,
      text,
      showTooltip = true,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const config = MATH_CONFIG[type]

    const canInsert = React.useMemo(() => {
      if (!editor || !editor.isEditable) return false
      return true
    }, [editor])

    const handleInsert = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        if (!editor) return
        if (type === "mathBlock") {
          editor.commands.setMathBlock({ latex: "" })
        } else {
          editor.commands.setMathInline({ latex: "" })
        }
      },
      [editor, type, onClick]
    )

    const label = text ?? config.label
    const Icon = config.Icon

    return (
      <Button
        type="button"
        data-style="ghost"
        role="button"
        tabIndex={-1}
        disabled={!canInsert}
        data-disabled={!canInsert}
        aria-label={label}
        tooltip={showTooltip ? label : undefined}
        onClick={handleInsert}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
          </>
        )}
      </Button>
    )
  }
)

MathButton.displayName = "MathButton"

export interface MathDropdownMenuProps extends Omit<ButtonProps, "type"> {
  editor?: Editor
  hideWhenUnavailable?: boolean
  onOpenChange?: (isOpen: boolean) => void
  portal?: boolean
}

export function MathDropdownMenu({
  editor: providedEditor,
  hideWhenUnavailable = false,
  onOpenChange,
  portal = false,
  ...props
}: MathDropdownMenuProps) {
  const { editor } = useTiptapEditor(providedEditor)
  const [isOpen, setIsOpen] = React.useState(false)

  const canInsert = React.useMemo(() => {
    if (!editor || !editor.isEditable) return false
    return true
  }, [editor])

  const handleOnOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open)
      onOpenChange?.(open)
    },
    [onOpenChange]
  )

  if (!editor || (hideWhenUnavailable && !canInsert)) {
    return null
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOnOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          data-style="ghost"
          data-active-state={isOpen ? "on" : "off"}
          role="button"
          tabIndex={-1}
          disabled={!canInsert}
          data-disabled={!canInsert}
          aria-label="Insert LaTeX"
          tooltip="Insert LaTeX"
          {...props}
        >
          <FunctionIcon className="tiptap-button-icon" />
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" portal={portal}>
        <Card>
          <CardBody>
            <DropdownMenuItem asChild>
              <MathButton editor={editor} type="mathInline" text="Inline Equation" showTooltip={false} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <MathButton editor={editor} type="mathBlock" text="Block Equation" showTooltip={false} />
            </DropdownMenuItem>
          </CardBody>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MathDropdownMenu
