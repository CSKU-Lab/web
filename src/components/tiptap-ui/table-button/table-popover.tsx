"use client";

import * as React from "react";
import { type Editor } from "@tiptap/react";
import { Table } from "lucide-react";

import { useTiptapEditor } from "~/hooks/use-tiptap-editor";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { Button } from "~/components/tiptap-ui-primitive/button";
import { cn } from "~/lib/tiptap-utils";
import "~/components/tiptap-ui/table-button/table-popover.scss";

const MAX_ROWS = 10;
const MAX_COLS = 10;

interface TablePopoverProps {
  editor?: Editor | null;
  hideWhenUnavailable?: boolean;
}

function TableGrid({ editor }: { editor: Editor | null }) {
  const [previewRows, setPreviewRows] = React.useState(3);
  const [previewCols, setPreviewCols] = React.useState(3);

  const handleCellEnter = (row: number, col: number) => {
    setPreviewRows(row + 1);
    setPreviewCols(col + 1);
  };

  const handleInsert = () => {
    if (!editor) return;
    editor.commands.insertTable({
      rows: previewRows,
      cols: previewCols,
      withHeaderRow: true,
    });
  };

  return (
    <div className="table-grid-wrapper">
      <div className="table-grid-header">
        <span className="table-grid-title">Insert Table</span>
        <span className="table-grid-size">{previewRows} × {previewCols}</span>
      </div>
      <div className="table-grid-preview">
        {Array.from({ length: MAX_ROWS }, (_, rowIndex) => (
          <div key={rowIndex} className="table-grid-row">
            {Array.from({ length: MAX_COLS }, (_, colIndex) => (
              <div
                key={colIndex}
                className={cn(
                  "table-grid-cell",
                  rowIndex < previewRows &&
                    colIndex < previewCols &&
                    "active",
                  rowIndex === 0 && "header-row"
                )}
                onMouseEnter={() => handleCellEnter(rowIndex, colIndex)}
                onClick={handleInsert}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="table-grid-footer">
        <span className="table-grid-hint">Click to insert</span>
      </div>
    </div>
  );
}

export function TablePopover({
  editor: providedEditor,
  hideWhenUnavailable = false,
}: TablePopoverProps) {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = React.useState(false);

  const canInsertTable = React.useMemo(() => {
    if (!editor || !editor.isEditable) return false;
    try {
      return editor
        .can()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true });
    } catch {
      return false;
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          data-style="ghost"
          data-active-state={isOpen ? "on" : "off"}
          disabled={!canInsertTable}
          data-disabled={!canInsertTable}
          role="button"
          tabIndex={-1}
          aria-label="Insert Table"
          tooltip="Insert Table"
        >
          <Table className="tiptap-button-icon" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="table-popover-content" align="center" sideOffset={4}>
        <TableGrid editor={editor} />
      </PopoverContent>
    </Popover>
  );
}
