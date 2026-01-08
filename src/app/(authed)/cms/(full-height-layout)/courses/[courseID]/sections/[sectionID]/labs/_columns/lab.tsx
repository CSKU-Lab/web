"use client";

import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { GripVertical, Hash, Trash } from "lucide-react";
import Link from "next/link";
import type { CMSSectionLab } from "~/types/cms-section-lab";
import DeleteLabDialog, {
  DeleteLabDialogTrigger,
} from "../_components/DeleteLabDialog";
import { useSortable } from "@dnd-kit/sortable";

const DragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners } = useSortable({ id: rowId });

  return (
    <button
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-(--gray-3) rounded text-(--gray-11) transition-colors"
    >
      <GripVertical size={16} />
    </button>
  );
};

const columnHelper = createColumnHelper<CMSSectionLab>();

export const generateColumns = (courseID: string, sectionID: string) =>
  [
    {
      id: "drag",
      header: "",
      size: 40,
      cell: ({ row }) => <DragHandleCell rowId={row.original.lab_id} />,
    },
    columnHelper.accessor("lab_name", {
      id: "lab_name",
      size: Number.MAX_SAFE_INTEGER,
      enableSorting: false,
      header: () => (
        <>
          <Hash size="1rem" /> Name
        </>
      ),
      cell: (cell) => {
        return (
          <Link
            href={`/cms/courses/${courseID}/labs/${cell.row.original.lab_id}`}
            className="font-semibold text-primary hover:underline"
          >
            {cell.getValue()}
          </Link>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      size: 60,
      cell: (cell) => {
        const lab = cell.row.original;
        return (
          <DeleteLabDialog lab={lab} sectionID={sectionID}>
            <DeleteLabDialogTrigger asChild>
              <button className="p-1.5 hover:bg-(--red-3) rounded text-(--red-11) transition-colors">
                <Trash size="1rem" />
              </button>
            </DeleteLabDialogTrigger>
          </DeleteLabDialog>
        );
      },
    }),
  ] satisfies ColumnDef<CMSSectionLab, any>[];
