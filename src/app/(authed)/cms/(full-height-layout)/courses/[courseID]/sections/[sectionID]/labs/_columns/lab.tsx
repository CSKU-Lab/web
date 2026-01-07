"use client";

import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Hash } from "lucide-react";
import Link from "next/link";
import type { CMSSectionLab } from "~/types/cms-section-lab";

const columnHelper = createColumnHelper<CMSSectionLab>();

export const generateColumns = (courseID: string) =>
  [
    columnHelper.accessor("lab_name", {
      id: "lab_name",
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
  ] satisfies ColumnDef<CMSSectionLab, any>[];
