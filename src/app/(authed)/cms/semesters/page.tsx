"use client";

import { useMemo, useState } from "react";
import DataTable from "~/components/commons/DataTable";
import Filter from "~/components/commons/Filters";
import SearchInput from "~/components/commons/SearchInput";
import useTable from "~/hooks/useTable";
import type { IFilter } from "~/types/filter";
import { columns } from "./_columns";
import AddSemester from "./_components/AddSemester";
import useTableState from "~/hooks/useTableState";
import useSemesterPagination from "./_hooks/useSemesterPagination";
import type { CMSSemester } from "~/types/cms-semester";
import DeleteSemeseterDialog from "./_components/DeleteSemesterDialog";
import EditSemester from "./_components/EditSemester";
import useInputDebounce from "~/hooks/useInputDebounce";

function SemesterManagementPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState<IFilter[]>([]);

  const { rowSelection, setRowSelection, pagination, setPagination } =
    useTableState();

  const memoizedColumns = useMemo(() => columns, []);

  const [editSemesterRow, setEditSemesterRow] = useState<CMSSemester | null>(
    null,
  );
  const [deleteSemesterRow, setDeleteSemesterRow] =
    useState<CMSSemester | null>(null);

  const debouncedSearch = useInputDebounce(globalFilter, 300);

  const {
    data: semesterPagination,
    isError,
    isFetching,
    refetch,
  } = useSemesterPagination({
    page: pagination.pageIndex + 1,
    page_size: pagination.pageSize,
    search: debouncedSearch,
    filters,
  });

  const table = useTable({
    data: semesterPagination.data,
    columns: memoizedColumns,
    totalCount: semesterPagination.pagination.total_rows,
    state: {
      rowSelection,
      pagination,
      globalFilter,
    },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    meta: {
      addUser: {
        editUser: (id: string) => {
          const semester = semesterPagination.data.find(
            (semester) => semester.id === id,
          );
          if (semester) {
            setEditSemesterRow(semester);
          }
        },
        deleteUser: (id: string) => {
          const semester = semesterPagination.data.find(
            (semester) => semester.id === id,
          );
          if (semester) {
            setDeleteSemesterRow(semester);
          }
        },
      },
    },
  });

  return (
    <>
      {editSemesterRow !== null && (
        <EditSemester
          semester={editSemesterRow}
          onClose={() => setEditSemesterRow(null)}
        />
      )}
      {deleteSemesterRow !== null && (
        <DeleteSemeseterDialog
          semester={deleteSemesterRow}
          onClose={() => setDeleteSemesterRow(null)}
        />
      )}
      <div>
        <h5 className="text-(--gray-12) text-2xl font-medium">
          Semesters Management
        </h5>

        <div className="flex flex-wrap md:justify-end items-center gap-2 mt-4">
          <SearchInput
            placeholder="Search semesters..."
            className="h-full w-full md:w-fit"
            value={globalFilter}
            onChange={setGlobalFilter}
          />
          <AddSemester />
        </div>

        <Filter
          value={filters}
          onChange={setFilters}
          className="mt-2"
          fields={[
            { display: "Name", value: "name" },
            { display: "Type", value: "type" },
            { display: "Started Date", value: "started_date" },
          ]}
        />

        <DataTable
          table={table}
          isError={isError && !isFetching}
          isLoading={isFetching}
          onRetry={refetch}
          search={globalFilter}
          totalData={semesterPagination.pagination.total_rows}
        />
      </div>
    </>
  );
}

export default SemesterManagementPage;
