"use client";
import SearchInput from "~/components/commons/SearchInput";
import DeleteManyUsersButton from "./_components/DeleteManyUsersButton";
import DeleteUserDialog from "./_components/DeleteUserDialog";
import EditUser from "./_components/EditUser";
import FilterColumns from "~/components/commons/FilterColumns";
import GroupManagementDialog from "./_components/GroupManagement/Dialog";
import AddUser from "./_components/AddUser";
import ImportUser from "./_components/import-users";
import Filters from "~/components/commons/Filters";
import DataTable from "~/components/commons/DataTable";
import useTableState from "~/hooks/useTableState";
import { useMemo, useState } from "react";
import useInputDebounce from "~/hooks/useInputDebounce";
import { useSearchParams } from "next/navigation";
import type { IFilter } from "~/types/filter";
import { searchParamsToFilter } from "~/lib/searchparams-to-filter";
import useUserPagination from "./_hooks/useUserPagination";
import type { User } from "~/types/user";
import { columns } from "./_columns";
import useTable from "~/hooks/useTable";
import { useSession } from "~/providers/SessionProvider";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userService } from "~/services/user.service";
import { queryKeys } from "~/queryKeys";
import { mapUserColumnID } from "./_utils/mapColumnID";
import PageTitle from "~/components/commons/PageTitle";

function UsersManagementPage() {
  const {
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    sorting,
    setSorting,
    pagination,
    setPagination,
  } = useTableState();

  const [search, setSearch] = useState("");
  const debouncedSearch = useInputDebounce(search, 500);

  const searchParams = useSearchParams();

  const filterFields = [
    { display: "Type", value: "type" },
    { display: "Username", value: "username" },
    { display: "Email", value: "email" },
    { display: "Display Name", value: "display_name" },
    { display: "Group", value: "group" },
    { display: "Roles", value: "roles" },
    { display: "Created at", value: "created_at" },
    { display: "Updated at", value: "updated_at" },
  ];

  const [filters, setFilters] = useState<IFilter[]>(() =>
    searchParamsToFilter(searchParams, filterFields),
  );

  const {
    data: userPagination,
    isFetching,
    isError,
    refetch,
  } = useUserPagination({
    page: pagination.pageIndex + 1,
    page_size: pagination.pageSize,
    search: debouncedSearch,
    sort_by: (sorting[0]?.id as keyof User) ?? "created_at",
    sort_order: sorting[0]?.desc ? "desc" : "asc",
    filters,
  });

  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const userAmount = userPagination?.pagination.total_rows ?? 0;

  const memoizedColumns = useMemo(() => columns, []);

  const table = useTable({
    totalCount: userAmount,
    data: userPagination.data,
    columns: memoizedColumns,
    state: {
      columnVisibility,
      pagination,
      sorting,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    pageCount: Math.ceil(userAmount / pagination.pageSize),
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
      <PageTitle>Users Management</PageTitle>
      <div className="flex-1 flex flex-col">
        {!!editUser && (
          <EditUser user={editUser} onClose={() => setEditUser(null)} />
        )}

        {!!deleteUser && (
          <DeleteUserDialog
            user={deleteUser}
            onClose={() => setDeleteUser(null)}
          />
        )}

        <div className="flex flex-wrap md:justify-end items-center gap-2 mt-4 px-4">
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
            className="h-full w-full md:w-fit"
            value={search}
            onChange={setSearch}
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

        <div className="flex justify-end px-4">
          <Filters
            value={filters}
            onChange={setFilters}
            className="mt-2"
            fields={filterFields}
          />
        </div>

        <DataTable
          table={table}
          isLoading={isFetching}
          search={search}
          isError={isError && !isFetching}
          onRetry={refetch}
          totalData={userPagination.pagination.total_rows}
        />
      </div>
    </>
  );
}

export default UsersManagementPage;
