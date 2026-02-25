"use client";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import DataTable from "~/components/commons/DataTable";
import RouteNavigation from "../_components/RouteNavigation";
import { getGradebookColumns } from "./_columns/gradebook.columns";
import useGradebook from "./_hooks/useGradebook";

function GradebookPage() {
  const { data, isLoading, isError } = useGradebook();

  const columns = useMemo(() => {
    if (!data) return [];
    return getGradebookColumns(data.lab_cols);
  }, [data]);

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    columns,
    data: data?.student_rows ?? [],
  });

  return (
    <>
      <RouteNavigation title="Gradebook" />
      <DataTable
        table={table}
        columnBordered
        hidePagination
        headerTextAlign="center"
        isLoading={isLoading}
        isError={isError}
        totalData={data?.student_rows.length ?? 0}
        className="font-[Boon]"
      />
    </>
  );
}

export default GradebookPage;
