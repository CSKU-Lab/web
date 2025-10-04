import {
  type TableOptions,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

interface Args<T extends { id: string }> extends Partial<TableOptions<T>> {
  data: TableOptions<T>["data"];
  columns: TableOptions<T>["columns"];
  totalCount: number;
}

function useTable<T extends { id: string }>({ ...opts }: Args<T>) {
  return useReactTable({
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableMultiSort: false,
    manualFiltering: true,
    manualPagination: true,
    getRowId: (row) => row.id,
    autoResetPageIndex: false,
    ...opts,
  });
}

export default useTable;
