import DataTable from "~/components/commons/DataTable";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import useTable from "~/hooks/useTable";
import useTableState from "~/hooks/useTableState";
import useInputDebounce from "~/hooks/useInputDebounce";
import type { IFilter } from "~/types/filter";
import { searchParamsToFilter } from "~/lib/searchparams-to-filter";
import Filters from "~/components/commons/Filters";
import SearchInput from "~/components/commons/SearchInput";
import type { CMSLab } from "~/types/cms-lab";
import { columns } from "../_columns/lab";
import useLabPagination from "../_hooks/useLabPagination";
import useTablePageSize from "~/hooks/useTablePageSize";
import CreateLabDialog from "./CreateLabDialog";

export default function LabTable() {
  const { courseID } = useParams<{ courseID: string }>();
  const memoizedColumns = useMemo(() => columns, []);
  const { containerRef, pageSize, hasCalculated } = useTablePageSize({ rowHeight: 36, headerHeight: 36, buffer: 28 });
  const [initialized, setInitialized] = useState(false);
  const initialPageSize = hasCalculated && pageSize ? pageSize : undefined;
  const { sorting, setSorting, pagination, setPagination } = useTableState(initialPageSize);

  useEffect(() => {
    if (hasCalculated && pageSize && !initialized) {
      setPagination((prev) => ({ ...prev, pageSize }));
      setInitialized(true);
    }
  }, [hasCalculated, pageSize, initialized, setPagination]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useInputDebounce(search, 500);
  const filterFields = [{ display: "Name", value: "display_name" }];
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<IFilter[]>(() =>
    searchParamsToFilter(searchParams, filterFields),
  );

  const {
    data: labPagination,
    isFetching,
    isError,
    refetch,
  } = useLabPagination({
    course_id: courseID!,
    args: {
      page: pagination.pageIndex + 1,
      page_size: pagination.pageSize,
      search: debouncedSearch,
      sort_by: (sorting[0]?.id as keyof CMSLab) ?? "created_at",
      sort_order: sorting[0]?.desc ? "desc" : "asc",
      filters,
    },
  });

  const table = useTable({
    data: labPagination.data,
    columns: memoizedColumns,
    totalCount: 0,
    pageCount: labPagination.pagination.total_page,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end items-center gap-2 px-4 my-4">
        <SearchInput
          placeholder="Search labs..."
          className="w-full md:w-fit"
          value={search}
          onChange={setSearch}
        />
        <CreateLabDialog />
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
        isError={isError}
        onRetry={refetch}
        isLoading={isFetching}
        totalData={labPagination.pagination.total_rows}
        containerRef={containerRef}
      />
    </div>
  );
}
