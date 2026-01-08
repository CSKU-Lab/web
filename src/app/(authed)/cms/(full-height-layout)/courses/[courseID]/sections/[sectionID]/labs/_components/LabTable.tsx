"use client";

import DataTable from "~/components/commons/DataTable";
import { Button } from "~/components/commons/Button";
import { useParams, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import useTable from "~/hooks/useTable";
import useTableState from "~/hooks/useTableState";
import useInputDebounce from "~/hooks/useInputDebounce";
import type { IFilter } from "~/types/filter";
import type { CMSSectionLab } from "~/types/cms-section-lab";
import { searchParamsToFilter } from "~/lib/searchparams-to-filter";
import Filters from "~/components/commons/Filters";
import SearchInput from "~/components/commons/SearchInput";
import useLabPagination from "../_hooks/useLabPagination";
import { generateColumns } from "../_columns/lab";
import { getCoreRowModel } from "@tanstack/react-table";
import AddLabDialog from "./AddLabDialog";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cmsSectionService } from "~/services/cms-section.service";

export default function LabTable() {
  const { courseID, sectionID } = useParams<{ courseID: string; sectionID: string }>();
  const memoizedColumns = useMemo(() => generateColumns(courseID, sectionID), [courseID, sectionID]);
  const { pagination, setPagination } = useTableState();
  const [search, setSearch] = useState("");
  const debouncedSearch = useInputDebounce(search, 500);
  const filterFields = [{ display: "Name", value: "display_name" }];
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<IFilter[]>(() =>
    searchParamsToFilter(searchParams, filterFields),
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [rows, setRows] = useState<CMSSectionLab[]>([]);

  const {
    data: labPagination,
    isFetching,
    isError,
    refetch,
  } = useLabPagination({
    page: pagination.pageIndex + 1,
    page_size: pagination.pageSize,
    search: debouncedSearch,
    sort_by: "position",
    sort_order: "asc",
    filters,
  });

  useEffect(() => {
    if (labPagination?.data) {
      setRows(labPagination.data);
    }
  }, [labPagination?.data]);

  const existingLabIds = useMemo(
    () => new Set(labPagination.data.map((lab) => lab.lab_id)),
    [labPagination.data],
  );

  const table = useTable({
    data: rows,
    columns: memoizedColumns,
    getRowId: (row) => row.lab_id,
    totalCount: 0,
    pageCount: labPagination.pagination.total_page,
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
    onPaginationChange: setPagination,
  });

  const updateSectionLabPosition = useMutation({
    mutationFn: async ({ labID, position }: { labID: string; position: number }) =>
      cmsSectionService.updateSectionLabPosition(sectionID!, labID, position),
    onSuccess: () => {
      toast.success("Lab order updated successfully");
      refetch();
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error("Error", {
          description: err.response?.data?.error || "Failed to update lab order",
        });
        return;
      }
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    if (updateSectionLabPosition.isPending) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((r) => r.lab_id === active.id);
    const newIndex = rows.findIndex((r) => r.lab_id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const nextRows = arrayMove(rows, oldIndex, newIndex);
    setRows(nextRows);

    updateSectionLabPosition.mutate({
      labID: active.id as string,
      position: newIndex + 1,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <AddLabDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        courseID={courseID!}
        existingLabIds={existingLabIds}
        onLabAdded={refetch}
      />
      <div className="flex justify-end items-center gap-2 px-4 my-4">
        <SearchInput
          placeholder="Search labs..."
          className="w-full md:w-fit"
          value={search}
          onChange={setSearch}
        />
        <Button className="shrink-0" onClick={() => setIsAddDialogOpen(true)}>
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
        rowIds={rows.map((r) => r.lab_id)}
        onDragEnd={handleDragEnd}
      />
    </div>
  );
}
