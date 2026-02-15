"use client";

import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Calendar, Hash, SquareAsterisk, User } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { CMSLab } from "~/types/cms-lab";
import DefaultSwitch from "../_components/DefaultSwitch";

dayjs.extend(relativeTime);

const columnHelper = createColumnHelper<CMSLab>();

export const columns = [
  columnHelper.accessor("display_name", {
    id: "display_name",
    enableSorting: true,
    header: () => (
      <>
        <Hash size="1rem" /> Name
      </>
    ),
    cell: (cell) => {
      return (
        <Link
          href={`/cms/courses/${cell.row.original.course_id}/labs/${cell.row.original.id}`}
          className="font-semibold text-primary hover:underline"
        >
          {cell.getValue()}
        </Link>
      );
    },
  }),
  columnHelper.accessor("created_by", {
    id: "created_by",
    enableSorting: false,
    header: () => (
      <>
        <User size="1rem" /> Created By
      </>
    ),
  }),
  columnHelper.accessor("is_default", {
    id: "is_default",
    enableSorting: false,
    header: () => (
      <div className="flex items-center gap-1">
        <SquareAsterisk size="1rem" /> Is Default
      </div>
    ),
    cell: ({ row, getValue }) => (
      <div className="flex justify-center">
        <DefaultSwitch
          courseID={row.original.course_id}
          isDefault={getValue()}
          data={{
            lab_id: row.original.id,
          }}
        />
      </div>
    ),
  }),
  columnHelper.accessor("created_at", {
    id: "created_at",
    enableSorting: true,
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
] satisfies ColumnDef<CMSLab, any>[];
