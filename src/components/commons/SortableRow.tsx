import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableRow } from "./Table";

export default function SortableRow({
  row,
  children,
}: {
  row: any;
  children: React.ReactNode;
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
      className="border-b last:border-none border-(--gray-4) h-9"
    >
      {children}
    </TableRow>
  );
}
