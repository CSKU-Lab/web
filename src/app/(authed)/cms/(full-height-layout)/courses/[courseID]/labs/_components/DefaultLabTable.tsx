"use client";

import DataTable from "~/components/commons/DataTable";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import useTable from "~/hooks/useTable";
import useTableState from "~/hooks/useTableState";
import useInputDebounce from "~/hooks/useInputDebounce";
import SearchInput from "~/components/commons/SearchInput";
import { columns } from "../_columns/defaultLab";
import type { CMSDefaultLab } from "~/types/cms-default-lab";
import useDefaultLabPagination from "../_hooks/useDefaultLabPagination";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  cmsDefaultLabService,
  type UpdateDefaultLabParams,
} from "~/services/cms-default-lab.service";

export default function DefaultLabTable() {
  const { courseID } = useParams<{ courseID: string }>();
  const memoizedColumns = useMemo(() => columns, []);
  const { sorting, setSorting, pagination, setPagination } = useTableState();
  const [search, setSearch] = useState("");
  const debouncedSearch = useInputDebounce(search, 500);
  const [rows, setRows] = useState<CMSDefaultLab[]>([]);

  const {
    data: labPagination,
    isFetching,
    isError,
    refetch,
  } = useDefaultLabPagination({
    course_id: courseID!,
    args: {
      page: pagination.pageIndex + 1,
      page_size: -1,
      search: debouncedSearch,
      sort_by: "position",
      sort_order: "asc",
      filters: [],
    },
  });

  useEffect(() => {
    if (labPagination?.data) {
      setRows(labPagination.data);
    }
  }, [labPagination?.data]);

  const table = useTable({
    data: rows,
    columns: memoizedColumns,
    getRowId: (row) => row.lab_id,
    totalCount: labPagination.pagination.total_rows ?? 0,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  const updateDefaultLab = useMutation({
    mutationFn: async (params: UpdateDefaultLabParams) =>
      cmsDefaultLabService.update(params),
    onSuccess: () => {
      toast.success("Default Lab updated successfully");
      refetch();
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error("Error", {
          description:
            err.response?.data.error || "Failed to update Default Lab",
        });
        return;
      }
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    if (updateDefaultLab.isPending) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((r) => r.lab_id === active.id);
    const newIndex = rows.findIndex((r) => r.lab_id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const nextRows = arrayMove(rows, oldIndex, newIndex);
    setRows(nextRows);

    updateDefaultLab.mutate({
      courseID,
      payload: {
        lab_id: active.id as string,
        position: newIndex + 1,
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end items-center gap-2 px-4 my-4">
        <SearchInput
          placeholder="Search labs..."
          className="w-full md:w-fit"
          value={search}
          onChange={setSearch}
        />
      </div>

      <DataTable
        table={table}
        isError={isError}
        onRetry={refetch}
        isLoading={isFetching}
        totalData={labPagination.pagination.total_rows}
        hidePagination={true}
        rowIds={rows.map((r) => r.lab_id)}
        onDragEnd={handleDragEnd}
      />
    </div>
  );
}
