"use client";

import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import type { CreateUser } from "~/types/user";
import {
  AtSign,
  EllipsisVertical,
  Lock,
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

const columnHelper = createColumnHelper<CreateUser>();

export const createUserColumns = [
  columnHelper.display({
    id: "select",
    size: 10,
    enableSorting: false,
    enableColumnFilter: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={row.getToggleSelectedHandler()}
        aria-label="Select row"
      />
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
      if (cell.getValue() === "credential")
        return <Lock size="1rem" className="mx-auto" />;
      return <GoogleIcon className="w-4 h-4 mx-auto" />;
    },
  }),
  columnHelper.accessor("profile_image", {
    id: "profile_image",
    size: 10,
    enableSorting: false,
    header: () => (
      <span className="flex gap-1.5 text-xs justify-center items-center">
        <UserRound size="1rem" /> Profile
      </span>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          <UserProfileImage src={null} username={row.original.username} />
        </div>
      );
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
  columnHelper.accessor("password", {
    id: "password",
    enableSorting: true,
    header: () => (
      <>
        <Lock size="1rem" /> Password
      </>
    ),
    cell: ({ cell }) => {
      if (cell.getValue() === "") {
        return "-";
      }
      return cell.getValue();
    },
  }),
  columnHelper.accessor("email", {
    id: "email",
    enableSorting: true,
    header: () => (
      <>
        <AtSign size="1rem" /> Email
      </>
    ),
    cell: ({ cell }) => {
      if (cell.getValue() === "") {
        return "-";
      }
      return cell.getValue();
    },
  }),

  columnHelper.accessor("display_name", {
    id: "display_name",
    size: 120,
    enableSorting: true,
    header: () => (
      <>
        <UserPen size="1rem" className="shrink-0" />{" "}
        <span className="shrink-0">Display Name</span>
      </>
    ),
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
                table.options.meta?.userPreview!.deleteUser(
                  row.original.username,
                )
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
] satisfies ColumnDef<CreateUser, any>[];
