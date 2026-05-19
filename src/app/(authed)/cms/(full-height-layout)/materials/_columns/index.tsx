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
    size: 200,
    header: () => (
      <>
        <Hash size="1rem" /> Name
      </>
    ),
    cell: (cell) => {
      const name = cell.getValue();
      return (
        <Link
          href={`/cms/courses/${cell.row.original.course_id}/materials/${cell.row.original.id}`}
          className="font-semibold text-primary hover:underline truncate block"
          title={name}
        >
          {name}
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
    size: 300,
    header: () => (
      <>
        <Tags size="1rem" /> Tags
      </>
    ),
    cell: (cell) => {
      const tags = cell.getValue() as string[];
      if (!tags || tags.length === 0) return null;
      return (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-(--gray-3) text-(--gray-11) truncate max-w-[150px]"
              title={tag}
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-(--gray-4) text-(--gray-10)">
              +{tags.length - 3}
            </span>
          )}
        </div>
      );
    },
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
