"use client";

import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Hash, SquareAsterisk, Tags, User } from "lucide-react";
import { titleFormatter } from "~/lib/formatters/titleFormatter";
import type { CMSMaterial } from "~/types/cms-material";

const columnHelper = createColumnHelper<CMSMaterial>();

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
  columnHelper.accessor("tag", {
    id: "tag",
    enableSorting: true,
    header: () => (
      <>
        <Tags size="1rem" /> Tags
      </>
    ),
  }),
  columnHelper.accessor("created_by", {
    id: "created_by",
    enableSorting: true,
    header: () => (
      <>
        <User size="1rem" /> Created By
      </>
    ),
  }),
] satisfies ColumnDef<CMSMaterial, any>[];
