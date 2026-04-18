import type { SortingState, VisibilityState } from "@tanstack/react-table";
import { useState } from "react";

function useTableState(initialPageSize = 10) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    email: false,
    username: false,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  return {
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    sorting,
    setSorting,
    pagination,
    setPagination,
  };
}

export default useTableState;
