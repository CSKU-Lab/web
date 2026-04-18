"use client";

import PageTitle from "~/components/commons/PageTitle";
import { Button } from "~/components/commons/Button";
import { useParams, useSearchParams } from "next/navigation";
import useMaterialPagination from "~/app/(authed)/cms/(full-height-layout)/materials/_hooks/useMaterialPagination";
import { useEffect, useMemo, useState } from "react";
import { columns } from "./_columns";
import useTableState from "~/hooks/useTableState";
import useInputDebounce from "~/hooks/useInputDebounce";
import useTablePageSize from "~/hooks/useTablePageSize";
import type { IFilter } from "~/types/filter";
import { searchParamsToFilter } from "~/lib/searchparams-to-filter";
import type { CMSMaterial } from "~/types/cms-material";
import SearchInput from "~/components/commons/SearchInput";
import { Save } from "lucide-react";
import Filters from "~/components/commons/Filters";
import DataTable from "~/components/commons/DataTable";
import useTable from "~/hooks/useTable";
import useGetLabMaterial from "./_hooks/useGetLabMaterial";
import { useSaveLabMaterials } from "./_hooks/useSaveLabMaterials";

export default function NewLabMaterialPage() {
  const { labID } = useParams<{ labID: string }>();
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

  const filterFields = [
    { display: "Name", value: "name" },
    { display: "Type", value: "type" },
  ];

  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<IFilter[]>(() =>
    searchParamsToFilter(searchParams, filterFields),
  );

  const {
    data: labMaterials,
    isError: isLabMatError,
    isFetching: isLabMatFetching,
  } = useGetLabMaterial({ labID });

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

  const initialSelectedRowIds = useMemo<Record<string, boolean>>(() => {
    if (!labMaterials) return {};
    return labMaterials.reduce<Record<string, boolean>>((acc, m) => {
      acc[String(m.material_id)] = true;
      return acc;
    }, {});
  }, [labMaterials]);

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
    initialSelectedRowIds,
  );

  useEffect(() => {
    setRowSelection(initialSelectedRowIds);
  }, [initialSelectedRowIds]);

  const table = useTable({
    data: materialPagination.data,
    columns: memoizedColumns,
    totalCount: 0,
    pageCount: materialPagination.pagination.total_page,
    state: {
      pagination,
      sorting,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  const { handleSaveLabMaterials } = useSaveLabMaterials({
    labMaterials,
    rowSelection,
    labID,
  });

  return (
    <div className="flex flex-col h-[100vh] w-full overflow-y-auto space-y-4">
      <PageTitle>Create a lab material</PageTitle>
      <div className="flex justify-end items-center gap-2 px-4 my-4">
        <SearchInput
          placeholder="Search materials..."
          className="w-full md:w-fit"
          value={search}
          onChange={setSearch}
        />
        <Button onClick={handleSaveLabMaterials} className="shrink-0">
          <Save size="1rem" />
          Save lab materials
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
        totalData={
          materialPagination.pagination.total_page *
          materialPagination.pagination.total_rows
        }
        table={table}
        isError={isError || isLabMatError}
        onRetry={refetch}
        isLoading={isFetching || isLabMatFetching}
        containerRef={containerRef}
      />
    </div>
  );
}
