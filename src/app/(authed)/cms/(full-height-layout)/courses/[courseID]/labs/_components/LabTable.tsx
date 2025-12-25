import DataTable from "~/components/commons/DataTable";
import { Button } from "~/components/commons/Button";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
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

export default function LabTable() {
  const { courseID } = useParams<{ courseID: string }>();
  const memoizedColumns = useMemo(() => columns, []);
  const { sorting, setSorting, pagination, setPagination } = useTableState();
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
    totalCount:
      labPagination?.pagination.total_page *
        labPagination.pagination.total_rows ?? 0,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end items-center gap-2 px-4 my-4">
        <SearchInput
          placeholder="Search labs..."
          className="w-full md:w-fit"
          value={search}
          onChange={setSearch}
        />
        <Button
          onClick={() => router.push(`/cms/courses/${courseID}/labs/new`)}
          className="shrink-0"
        >
          <Plus size="1rem" />
          New lab
        </Button>
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
      />
    </div>
  );
}
