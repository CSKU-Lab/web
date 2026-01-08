"use client";

import * as React from "react";
import { type Editor } from "@tiptap/react";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { useTiptapEditor } from "~/hooks/use-tiptap-editor";
import "~/components/tiptap-ui/table-context-menu/table-context-menu.scss";

interface TableContextMenuProps {
  editor?: Editor | null;
}

interface ContextMenuState {
  open: boolean;
  x: number;
  y: number;
}

export function TableContextMenu({
  editor: providedEditor,
}: TableContextMenuProps) {
  const { editor } = useTiptapEditor(providedEditor);
  const [menuState, setMenuState] = React.useState<ContextMenuState>({
    open: false,
    x: 0,
    y: 0,
  });

  React.useEffect(() => {
    if (!editor) return;

    const handleContextMenu = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const cell = target.closest("td, th");

      if (cell) {
        event.preventDefault();
        setMenuState({
          open: true,
          x: event.clientX,
          y: event.clientY,
        });
      }
    };

    const dom = editor.view.dom;
    dom.addEventListener("contextmenu", handleContextMenu);

    return () => {
      dom.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [editor]);

  const handleClose = React.useCallback(() => {
    setMenuState((prev) => ({ ...prev, open: false }));
  }, []);

  const handleDeleteRow = React.useCallback(() => {
    if (!editor) return;
    editor.commands.deleteRow();
    handleClose();
  }, [editor, handleClose]);

  const handleDeleteColumn = React.useCallback(() => {
    if (!editor) return;
    editor.commands.deleteColumn();
    handleClose();
  }, [editor, handleClose]);

  const handleAddRowBefore = React.useCallback(() => {
    if (!editor) return;
    editor.commands.addRowBefore();
    handleClose();
  }, [editor, handleClose]);

  const handleAddRowAfter = React.useCallback(() => {
    if (!editor) return;
    editor.commands.addRowAfter();
    handleClose();
  }, [editor, handleClose]);

  const handleAddColumnBefore = React.useCallback(() => {
    if (!editor) return;
    editor.commands.addColumnBefore();
    handleClose();
  }, [editor, handleClose]);

  const handleAddColumnAfter = React.useCallback(() => {
    if (!editor) return;
    editor.commands.addColumnAfter();
    handleClose();
  }, [editor, handleClose]);

  const handleDeleteTable = React.useCallback(() => {
    if (!editor) return;
    editor.commands.deleteTable();
    handleClose();
  }, [editor, handleClose]);

  if (!editor) return null;

  return (
    <DropdownMenu open={menuState.open} onOpenChange={handleClose}>
      <DropdownMenuContent
        className="table-context-menu"
        style={{
          position: "fixed",
          left: menuState.x,
          top: menuState.y,
          display: menuState.open ? "block" : "none",
          zIndex: 9999,
        }}
        align="start"
        sideOffset={2}
        onContextMenu={(e) => e.preventDefault()}
      >
        <DropdownMenuItem onClick={handleAddRowBefore}>
          <ArrowUp className="menu-icon" />
          Insert Row Above
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAddRowAfter}>
          <ArrowDown className="menu-icon" />
          Insert Row Below
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleAddColumnBefore}>
          <ArrowLeft className="menu-icon" />
          Insert Column Left
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAddColumnAfter}>
          <ArrowRight className="menu-icon" />
          Insert Column Right
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDeleteRow} variant="destructive">
          <Trash2 className="menu-icon" />
          Delete Row
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteColumn} variant="destructive">
          <Trash2 className="menu-icon" />
          Delete Column
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDeleteTable} variant="destructive">
          <Trash2 className="menu-icon" />
          Delete Table
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TableContextMenu;
