"use client";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import DataTable from "~/components/commons/DataTable";
import PageTitle from "~/components/commons/PageTitle";
import RouteNavigation from "~/features/cms/sections/components/RouteNavigation";
import { getGradebookColumns } from "~/features/cms/sections/columns/gradebook/gradebook.columns";
import useGradebook from "~/features/cms/sections/hooks/gradebook/useGradebook";
import { ExportGradebookButton } from "~/features/cms/sections/components/gradebook/ExportGradebookButton";
import { ExportTypingButton } from "~/features/cms/sections/components/gradebook/ExportTypingButton";

function SectionGradebookView() {
  const { data, isLoading, isError } = useGradebook();

  const columns = useMemo(() => {
    if (!data) return [];
    return getGradebookColumns(data.lab_cols ?? []);
  }, [data]);

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    columns,
    data: data?.student_rows ?? [],
  });

  return (
    <>
      <RouteNavigation
        headerContent={
          <div className="flex items-center justify-between w-full">
            <PageTitle>Gradebook</PageTitle>
            <div className="mr-4 flex items-center gap-2">
              <ExportTypingButton />
              <ExportGradebookButton />
            </div>
          </div>
        }
      />
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

export default SectionGradebookView;
