"use client";

import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
  Calendar,
  EllipsisVertical,
  Hash,
  Pencil,
  SquareAsterisk,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { dateFormatter } from "~/lib/formatters/dateFormatter";
import { titleFormatter } from "~/lib/formatters/titleFormatter";
import type { CMSSemester } from "~/types/cms-semester";
import DeleteSemesterDialog, {
  DeleteSemesterDialogTrigger,
} from "../components/DeleteSemesterDialog";

const columnHelper = createColumnHelper<CMSSemester>();

export const columns = [
  columnHelper.accessor("name", {
    id: "name",
    enableSorting: true,
    header: () => (
      <>
        <Hash size="1rem" /> Name
      </>
    ),
  }),
  columnHelper.accessor("type", {
    id: "type",
    enableSorting: true,
    header: () => (
      <>
        <SquareAsterisk size="1rem" /> Type
      </>
    ),
    cell: (cell) => {
      const value = cell.getValue();
      return titleFormatter(value);
    },
  }),
  columnHelper.accessor("started_date", {
    id: "started_date",
    enableSorting: true,
    header: () => (
      <>
        <Calendar size="1rem" /> Started Date
      </>
    ),
    cell: ({ cell }) => {
      const date = cell.getValue();
      return dateFormatter(date);
    },
  }),
  columnHelper.display({
    id: "action",
    enableColumnFilter: false,
    enableSorting: false,
    size: 10,
    cell: ({ table, row }) => {
      return (
        <DeleteSemesterDialog semester={row.original}>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex justify-center items-center">
              <EllipsisVertical size="1rem" className="text-(--gray-12)" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="left"
              align="start"
              sideOffset={-2}
              alignOffset={200}
            >
              <DropdownMenuItem
                onClick={() =>
                  table.options.meta?.addUser!.editUser(row.original.id)
                }
                className="flex items-center gap-2"
              >
                <Pencil size="1rem" />
                Edit
              </DropdownMenuItem>
              <DeleteSemesterDialogTrigger asChild>
                <DropdownMenuItem className="flex items-center gap-2 text-(--red-9) focus:text-(--red-10)">
                  <Trash size="1rem" className="text-current" />
                  Delete
                </DropdownMenuItem>
              </DeleteSemesterDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </DeleteSemesterDialog>
      );
    },
  }),
] satisfies ColumnDef<CMSSemester, any>[];
