"use client";

import {
  flexRender,
  type VisibilityState,
  type Table as ITable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  Inbox,
  SearchX,
  ServerCrash,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/commons/Table";
import { cn } from "~/lib/utils";
import PageSize from "./PageSize";
import TablePagination from "./TablePagination";
import TableSkeleton from "./TableSkeleton";
import { useMemo } from "react";
import Loading from "./Loading";
import Error from "./Error";
import ErrorFallback from "./Error/ErrorFallback";

interface Props {
  table: ITable<any>;
  isLoading?: boolean;
  isError?: boolean;
  search?: string;
  totalData?: number;
  className?: string;
  hidePagination?: boolean;
  onRetry?: () => void;
}

function DataTable({
  table,
  isLoading,
  isError,
  search,
  totalData,
  className,
  hidePagination,
  onRetry,
}: Props) {
  const visibleColumns = useMemo(
    () =>
      table
        .getAllColumns()
        .filter(
          (column) =>
            table.getState().columnVisibility[
              column.id as keyof VisibilityState
            ] !== false,
        ),
    [table],
  );

  return (
    <div
      className={cn(
        "rounded-md border border-(--gray-4) overflow-hidden mt-4 h-full flex flex-col relative",
        className,
      )}
    >
      <Table className="flex-1">
        <TableHeader className="sticky top-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-(--gray-2) h-9">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                  >
                    <div
                      onClick={() => {
                        if (header.column.getCanSort()) {
                          header.column.toggleSorting();
                        }
                      }}
                      className={cn(
                        "flex gap-1.5 text-xs",
                        header.column.getCanSort() && "cursor-pointer",
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {{
                        asc: (
                          <ChevronDown
                            size="1rem"
                            className="text-(--gray-11) shrink-0"
                          />
                        ),
                        desc: (
                          <ChevronUp
                            size="1rem"
                            className="text-(--gray-11) shrink-0"
                          />
                        ),
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="flex-1">
          <Error
            isError={isError}
            fallback={
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-[calc(100vh-300px)]"
                >
                  <ErrorFallback
                    icon={<ServerCrash size="2rem" />}
                    title="Something went wrong"
                    message={
                      <>
                        {" "}
                        There was an error processing your request. <br />{" "}
                        Please try again later or report issue{" "}
                        <a href="#" className="text-(--grass-9)">
                          here
                        </a>
                        .
                      </>
                    }
                    onRetry={onRetry}
                  />
                </TableCell>
              </TableRow>
            }
          >
            <Loading
              fallback={<TableSkeleton columns={visibleColumns} />}
              isLoading={!!isLoading}
            >
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b last:border-none border-(--gray-4) h-9"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-1.5">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-[calc(100vh-300px)]"
                  >
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-(--gray-10)">
                        {search && table.getState().globalFilter !== "" ? (
                          <>
                            <SearchX size="2.5rem" />
                            <p className="text-sm font-medium">
                              No results found for &ldquo;
                              {table.getState().globalFilter}&rdquo;
                            </p>
                            <p className="text-xs text-(--gray-9)">
                              Try adjusting your search or filter to find what
                              you&apos;re looking for.
                            </p>
                          </>
                        ) : (
                          <>
                            <Inbox size="2.5rem" />
                            <p className="text-sm font-medium">
                              There is no data available
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Loading>
          </Error>
        </TableBody>
      </Table>
      <div className="p-2 border-t border-(--gray-4) flex justify-between items-center">
        <p className="text-xs text-(--gray-10) tracking-wide">
          Total{" "}
          <span className="ml-1 text-(--gray-12) font-semibold">
            {totalData}
          </span>
        </p>
        {!hidePagination && (
          <div className="flex items-center gap-4">
            <PageSize
              value={table.getState().pagination.pageSize}
              onChange={(value) => table.setPageSize(Number(value))}
            />
            <TablePagination
              totalPages={table.getPageCount()}
              currentPage={table.getState().pagination.pageIndex + 1}
              onPageChange={(page) => table.setPageIndex(page - 1)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default DataTable;
