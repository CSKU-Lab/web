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
import TablePagination from "./TablePagination";
import TableSkeleton from "./TableSkeleton";
import { useMemo, useRef, useEffect } from "react";
import Loading from "./Loading";
import Error from "./Error";
import ErrorFallback from "./Error/ErrorFallback";

import SortableRow from "./SortableRow";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface Props {
  table: ITable<any>;
  isLoading?: boolean;
  isError?: boolean;
  search?: string;
  totalData?: number;
  className?: string;
  hidePagination?: boolean;
  onRetry?: () => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;

  rowIds?: string[];
  onDragEnd?: (event: any) => void;
  headerTextAlign?: "left" | "center" | "right";
  columnBordered?: boolean;
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
  containerRef,

  rowIds,
  onDragEnd,
  headerTextAlign,
  columnBordered = false,
}: Props) {
  const innerRef = useRef<HTMLDivElement>(null);
  const effectiveRef = containerRef ?? innerRef;
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
      ref={effectiveRef}
      className={cn(
        "border border-(--gray-4) overflow-hidden mt-4 h-full flex flex-col relative 2xl:rounded-md border-l-1 2xl:border-l",
        className,
      )}
    >
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <Table
          containerClassName="flex-1"
          className="border-separate border-spacing-0"
        >
          <TableHeader className="sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-(--gray-2) hover:bg-(--gray-3) h-9"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                      className={cn(
                        "sticky relative",
                        columnBordered && "border-b border-r",
                      )}
                    >
                      <div
                        onClick={() => {
                          if (header.column.getCanSort()) {
                            header.column.toggleSorting();
                          }
                        }}
                        className={cn(
                          "flex gap-1.5 text-xs",
                          headerTextAlign === "center" && "justify-center",
                          headerTextAlign === "right" && "justify-end",
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
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={cn(
                          "absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none opacity-0 hover:opacity-100",
                          header.column.getIsResizing() && "opacity-100",
                        )}
                        style={{
                          background:
                            header.column.getIsResizing()
                              ? "var(--accent-9)"
                              : "transparent",
                        }}
                      />
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="flex-1">
            <SortableContext
              items={rowIds ?? []}
              strategy={verticalListSortingStrategy}
            >
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
                      <SortableRow
                        key={row.id}
                        row={row}
                        columnBordered={columnBordered}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className={cn("py-1.5")}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </SortableRow>
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
                                  {search}&rdquo;
                                </p>
                                <p className="text-xs text-(--gray-9)">
                                  Try adjusting your search or filter to find
                                  what you&apos;re looking for.
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
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
      <div className="p-2 border-t border-(--gray-4) flex justify-between items-center">
        <p className="text-xs text-(--gray-10) tracking-wide">
          Total{" "}
          <span className="ml-1 text-(--gray-12) font-semibold">
            {totalData}
          </span>
        </p>
        {!hidePagination && (
          <div className="flex items-center gap-4">
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
