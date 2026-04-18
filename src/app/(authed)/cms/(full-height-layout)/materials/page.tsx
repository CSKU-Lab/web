"use client";
import { useMemo, useState } from "react";
import useTable from "~/hooks/useTable";
import { columns } from "./_columns";
import DataTable from "~/components/commons/DataTable";
import { Button } from "~/components/commons/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import PageTitle from "~/components/commons/PageTitle";
import useMaterialPagination from "./_hooks/useMaterialPagination";
import useTableState from "~/hooks/useTableState";
import useInputDebounce from "~/hooks/useInputDebounce";
import useTablePageSize from "~/hooks/useTablePageSize";
import type { CMSMaterial } from "~/types/cms-material";
import type { IFilter } from "~/types/filter";
import { searchParamsToFilter } from "~/lib/searchparams-to-filter";
import Filters from "~/components/commons/Filters";
import SearchInput from "~/components/commons/SearchInput";

function MaterialPage() {
  const memoizedColumns = useMemo(() => columns, []);

  const { containerRef, pageSize, hasCalculated } = useTablePageSize({ rowHeight: 36, headerHeight: 36, buffer: 20 });
  const initialPageSize = pageSize || 25;
  const { sorting, setSorting, pagination, setPagination } = useTableState(initialPageSize);

  const [search, setSearch] = useState("");
  const debouncedSearch = useInputDebounce(search, 500);

  const filterFields = [
    { display: "Name", value: "name" },
    { display: "Type", value: "type" },
  ];

  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<IFilter[]>(() =>
    searchParamsToFilter(searchParams, filterFields),
  );

  const {
    data: materialPagination,
    isFetching,
    isError,
    refetch,
  } = useMaterialPagination({
    page: pagination.pageIndex + 1,
    page_size: pagination.pageSize,
    search: debouncedSearch,
    sort_by: (sorting[0]?.id as keyof CMSMaterial) ?? "created_at",
    sort_order: sorting[0]?.desc ? "desc" : "asc",
    filters,
  });

  const table = useTable({
    data: materialPagination.data,
    columns: memoizedColumns,
    totalCount: 0,
    pageCount: materialPagination.pagination.total_page,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  const router = useRouter();

  return (
    <>
      <PageTitle>Materials</PageTitle>
      <div className="flex justify-end items-center gap-2 px-4 my-4">
        <SearchInput
          placeholder="Search materials..."
          className="w-full md:w-fit"
          value={search}
          onChange={setSearch}
        />
        <Button
          onClick={() => router.push("/cms/materials/new")}
          className="shrink-0"
        >
          <Plus size="1rem" />
          New material
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
        totalData={materialPagination.pagination.total_rows}
        containerRef={containerRef}
      />
    </>
  );
}

export default MaterialPage;
