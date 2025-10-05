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
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { CMSSemester } from "~/types/cms-semester";

dayjs.extend(relativeTime);
dayjs.extend(utc);

const columnHelper = createColumnHelper<CMSSemester>();

export const columns = [
  columnHelper.display({
    id: "select",
    size: 20,
    enableSorting: false,
    enableColumnFilter: false,
    header: ({ table }) => (
      <div className="mx-auto">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={row.getToggleSelectedHandler()}
          aria-label="Select row"
        />
      </div>
    ),
  }),
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
      return value.charAt(0).toUpperCase() + value.slice(1);
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
      return dayjs(date).format("DD MMM YYYY");
    },
  }),
  columnHelper.display({
    id: "action",
    enableColumnFilter: false,
    enableSorting: false,
    size: 10,
    cell: ({ table, row }) => {
      return (
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
            <DropdownMenuItem
              onClick={() =>
                table.options.meta?.addUser!.deleteUser(row.original.id)
              }
              className="flex items-center gap-2 text-red-9 focus:text-red-10"
            >
              <Trash size="1rem" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
] satisfies ColumnDef<CMSSemester, any>[];
