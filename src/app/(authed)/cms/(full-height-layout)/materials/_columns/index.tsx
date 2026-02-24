"use client";

import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Calendar, Hash, SquareAsterisk, Tags, User } from "lucide-react";
import Link from "next/link";
import { titleFormatter } from "~/lib/formatters/titleFormatter";
import type { CMSMaterial } from "~/types/cms-material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import UserProfileImage from "~/components/Menus/UserProfileImage";

dayjs.extend(relativeTime);

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
    cell: (cell) => {
      return (
        <Link
          href={`/cms/materials/${cell.row.original.id}`}
          className="font-semibold text-primary hover:underline"
        >
          {cell.getValue()}
        </Link>
      );
    },
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
  columnHelper.accessor("tags", {
    id: "tags",
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
    cell: ({ cell }) => {
      const creator = cell.getValue<CMSMaterial["created_by"]>();
      return (
        <div className="flex items-center gap-1.5">
          <UserProfileImage
            src={creator.profile_image}
            username={creator.username ?? ""}
            size="1.25rem"
          />
          <h4 className="font-medium">{creator.display_name}</h4>
        </div>
      );
    },
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
] satisfies ColumnDef<CMSMaterial, any>[];
