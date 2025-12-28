import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableRow } from "./Table";
import { cn } from "~/lib/tiptap-utils";

export default function SortableRow({
  row,
  children,
  columnBordered = false,
}: {
  row: any;
  children: React.ReactNode;
  columnBordered?: boolean;
}) {
  const { setNodeRef, transform, transition } = useSortable({
    id: row.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-(--gray-4) h-9",
        columnBordered &&
          "[&>td]:border-r last:[&>td]:border-b-0 [&>td]:border-b",
      )}
    >
      {children}
    </TableRow>
  );
}
