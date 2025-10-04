import type { SortingState, VisibilityState } from "@tanstack/react-table";
import { useState } from "react";

function useTableState() {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    email: false,
    username: false,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "created_at",
      desc: true,
    },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
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
