"use client";

import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Calendar, GripVertical, Hash, ListOrdered } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { CMSDefaultLab } from "~/types/cms-default-lab";
import { useSortable } from "@dnd-kit/sortable";

dayjs.extend(relativeTime);

const DragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners } = useSortable({ id: rowId });

  return (
    <button
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <GripVertical size={16} />
    </button>
  );
};

const columnHelper = createColumnHelper<CMSDefaultLab>();

export const columns = [
  {
    id: "drag",
    header: "",
    size: 40,
    cell: ({ row }) => <DragHandleCell rowId={row.original.lab_id} />,
  },
  columnHelper.accessor("lab_name", {
    id: "lab_name",
    enableSorting: false,
    header: () => (
      <>
        <Hash size="1rem" /> Name
      </>
    ),
    cell: (cell) => {
      return <>{cell.getValue()}</>;
    },
  }),
  columnHelper.accessor("created_at", {
    id: "created_at",
    enableSorting: false,
    header: () => (
      <>
        <Calendar size="1rem" /> Created At
      </>
    ),
    cell: (cell) => {
      const value = cell.getValue();
      return dayjs(value).fromNow();
    },
  }),
] satisfies ColumnDef<CMSDefaultLab, any>[];
