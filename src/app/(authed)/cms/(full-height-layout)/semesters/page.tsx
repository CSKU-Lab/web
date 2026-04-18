"use client";

import { useMemo, useState, useEffect } from "react";
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
import EditSemester from "./_components/EditSemester";
import useInputDebounce from "~/hooks/useInputDebounce";
import PageTitle from "~/components/commons/PageTitle";
import DeleteSemesterDialog from "./_components/DeleteSemesterDialog";
import useTablePageSize from "~/hooks/useTablePageSize";

function SemesterManagementPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState<IFilter[]>([]);

  const { containerRef, pageSize, hasCalculated } = useTablePageSize({ rowHeight: 36, headerHeight: 36, buffer: 28 });
  const [initialized, setInitialized] = useState(false);
  const initialPageSize = hasCalculated && pageSize ? pageSize : undefined;
  const { rowSelection, setRowSelection, pagination, setPagination } =
    useTableState(initialPageSize);

  useEffect(() => {
    if (hasCalculated && pageSize && !initialized) {
      setPagination((prev) => ({ ...prev, pageSize }));
      setInitialized(true);
    }
  }, [hasCalculated, pageSize, initialized, setPagination]);

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
    sort_by: "started_date",
    sort_order: "desc",
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
        deleteUser: (id: string) => {},
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
      <PageTitle>Semester Management</PageTitle>
      <div className="flex flex-wrap md:justify-end items-center gap-2 mt-4 px-4">
        <SearchInput
          placeholder="Search semesters..."
          className="h-full w-full md:w-fit"
          value={globalFilter}
          onChange={setGlobalFilter}
        />
        <AddSemester />
      </div>

      <div className="flex justify-end px-4 mt-2">
        <Filter
          value={filters}
          onChange={setFilters}
          fields={[
            { display: "Name", value: "name" },
            { display: "Type", value: "type" },
            { display: "Started Date", value: "started_date" },
          ]}
        />
      </div>

      <DataTable
        table={table}
        isError={isError && !isFetching}
        isLoading={isFetching}
        onRetry={refetch}
        search={globalFilter}
        totalData={semesterPagination.pagination.total_rows}
        containerRef={containerRef}
      />
    </>
  );
}

export default SemesterManagementPage;
