"use client";

import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import type { User } from "~/types/user";
import {
  AtSign,
  Calendar,
  EllipsisVertical,
  Lock,
  Pencil,
  Shield,
  ShieldUser,
  Trash,
  UserPen,
  UserRound,
} from "lucide-react";
import { GoogleIcon } from "~/assets/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import UserRole from "~/components/commons/UserRole";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import UserProfileImage from "~/components/Menus/UserProfileImage";

dayjs.extend(relativeTime);

const columnHelper = createColumnHelper<User>();

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
  columnHelper.accessor("type", {
    id: "type",
    size: 10,
    enableSorting: true,
    header: () => (
      <>
        <Shield size="1rem" /> Type
      </>
    ),
    cell: ({ cell }) => {
      if (cell.getValue() === "credential") return <Lock size="1rem" />;
      return <GoogleIcon className="w-4 h-4" />;
    },
  }),
  columnHelper.accessor("profile_image", {
    id: "profile_image",
    size: 10,
    enableSorting: false,
    header: () => (
      <span className="flex gap-1.5 text-xs">
        <UserRound size="1rem" /> Profile
      </span>
    ),
    cell: ({ cell, row }) => {
      const image = cell.getValue() as string;
      return <UserProfileImage src={image} username={row.original.username} />;
    },
  }),
  columnHelper.accessor("username", {
    id: "username",
    enableSorting: true,
    header: () => (
      <>
        <UserRound size="1rem" /> Username
      </>
    ),
  }),
  columnHelper.accessor("email", {
    id: "email",
    enableSorting: true,
    header: () => (
      <>
        <AtSign size="1rem" /> Email
      </>
    ),
  }),
  columnHelper.accessor("display_name", {
    id: "display_name",
    enableSorting: true,
    header: () => (
      <>
        <UserPen size="1rem" /> Display Name
      </>
    ),
  }),
  columnHelper.accessor("group", {
    id: "group",
    enableSorting: true,
    header: () => (
      <>
        <UserPen size="1rem" /> Group
      </>
    ),
    cell: ({ cell }) => cell.getValue()?.name,
  }),
  columnHelper.accessor("roles", {
    id: "roles",
    enableSorting: true,
    header: () => (
      <>
        <ShieldUser size="1rem" /> Roles
      </>
    ),
    cell: ({ cell }) => {
      const roles = cell.getValue() as string[];

      return (
        <div className="space-x-1.5">
          {roles.map((role) => (
            <UserRole key={role} {...{ role }} />
          ))}
        </div>
      );
    },
  }),
  columnHelper.accessor("created_at", {
    id: "created_at",
    enableSorting: true,
    header: () => (
      <>
        <Calendar size="1rem" /> Created at
      </>
    ),
    cell: ({ cell }) => {
      const date = cell.getValue();
      return dayjs(date).fromNow();
    },
  }),
  columnHelper.accessor("updated_at", {
    id: "updated_at",
    enableSorting: true,
    header: () => (
      <>
        <Calendar size="1rem" /> Updated at
      </>
    ),
    cell: ({ cell }) => {
      const date = cell.getValue();
      return dayjs(date).fromNow();
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
] satisfies ColumnDef<User, any>[];
