"use client";
import {
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { columns } from "../_datas/columns";
import FilterColumns from "./FilterColumns";
import useUserPagination from "../_hooks/useUserPagination";
import { mapUserColumnID } from "../_utils/mapColumnID";
import DeleteManyUsersButton from "./DeleteManyUsersButton";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import type { User } from "~/types/user";
import DeleteUserDialog from "./DeleteUserDialog";
import ImportUser from "./import-users";
import DataTable from "~/components/commons/DataTable";
import { useQueryClient } from "@tanstack/react-query";
import { userService } from "~/services/user.service";
import SearchInput from "~/components/commons/SearchInput";
import { useSession } from "~/providers/SessionProvider";
import { toast } from "sonner";
import { queryKeys } from "~/queryKeys";
import GroupManagementDialog from "./GroupManagement/Dialog";
import Filter from "~/components/commons/Filter";
import type { IFilter } from "~/types/filter";

function TableSection() {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    email: false,
    username: false,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "created_at",
      desc: true,
    },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [search, setSearch] = useState("");

  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const handleOnSearch = useMemo(() => {
    let timeout: NodeJS.Timeout | null = null;
    return (globalFilter: string) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        setSearch(globalFilter);
      }, 500);
    };
  }, []);

  useEffect(() => {
    handleOnSearch(globalFilter);
  }, [globalFilter, handleOnSearch]);

  const [filter, setFilter] = useState<IFilter[]>([]);
  const {
    data: userPagination,
    isFetching,
    isError,
    refetch,
  } = useUserPagination({
    page: pagination.pageIndex + 1,
    page_size: pagination.pageSize,
    search,
    sort_by: (sorting[0]?.id as keyof User) ?? "created_at",
    sort_order: sorting[0]?.desc ? "desc" : "asc",
    filter,
  });

  const userAmount = userPagination?.pagination.total_rows ?? 0;

  const memoizedColumns = useMemo(() => columns, []);

  const table = useReactTable({
    data: userPagination.data,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableMultiSort: false,
    manualFiltering: true,
    manualPagination: true,
    state: {
      columnVisibility,
      pagination,
      globalFilter,
      sorting,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    pageCount: Math.ceil(userAmount / pagination.pageSize),
    getRowId: (row) => row.id,
    meta: {
      addUser: {
        editUser: (id: string) => {
          const user = userPagination.data.find((user) => user.id === id);
          if (user) {
            setEditUser(user);
          }
        },
        deleteUser: (id: string) => {
          const user = userPagination.data.find((user) => user.id === id);
          if (user) {
            setDeleteUser(user);
          }
        },
      },
    },
    autoResetPageIndex: false,
  });

  const isRowSelected =
    table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();

  const {
    user: { sub },
  } = useSession();
  const queryClient = useQueryClient();
  const handleOnDeleteManyUsers = async () => {
    const userIds = userPagination.data
      .filter((user) => Object.keys(rowSelection).includes(user.id))
      .map((user) => user.id);

    if (userIds.includes(sub)) {
      toast.error("You cannot delete your own account.");
      return;
    }

    await userService.deleteManyUsers(userIds);
    setRowSelection({});
    queryClient.refetchQueries({ queryKey: queryKeys.user.all });
  };

  return (
    <>
      {!!editUser && (
        <EditUser user={editUser} onClose={() => setEditUser(null)} />
      )}

      {!!deleteUser && (
        <DeleteUserDialog
          user={deleteUser}
          onClose={() => setDeleteUser(null)}
        />
      )}

      <div className="flex justify-end items-center gap-2 mt-4">
        {isRowSelected && (
          <DeleteManyUsersButton
            onConfirm={handleOnDeleteManyUsers}
            users={userPagination.data
              .filter((user) => Object.keys(rowSelection).includes(user.id))
              .map(({ display_name, username, profile_image }) => ({
                display_name,
                username,
                profile_image,
              }))}
          />
        )}
        <SearchInput
          placeholder="Search users..."
          className="h-full"
          value={globalFilter}
          onChange={setGlobalFilter}
        />
        <FilterColumns
          columns={table
            .getAllColumns()
            .filter((column) => column.getCanFilter())
            .map((col) => ({ ...col, id: mapUserColumnID(col.id) }))}
        />
        <GroupManagementDialog />
        <AddUser />
        <ImportUser />
      </div>

      <Filter
        onChange={setFilter}
        className="mt-2"
        fields={[
          { display: "Type", value: "type" },
          { display: "Username", value: "username" },
          { display: "Email", value: "email" },
          { display: "Display Name", value: "display_name" },
          { display: "Group", value: "group" },
          { display: "Roles", value: "roles" },
          { display: "Created at", value: "created_at" },
          { display: "Updated at", value: "updated_at" },
        ]}
      />

      <DataTable
        table={table}
        isLoading={isFetching}
        search={search}
        isError={isError && !isFetching}
        onRetry={refetch}
        totalData={userPagination.pagination.total_rows}
      />
    </>
  );
}

export default TableSection;
