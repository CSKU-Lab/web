import { useState, Fragment } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import type { TestCaseGroup } from "~/types/core-code-submission";
import { getStatusConfig } from "~/features/core/materials/utils/submission-detail/statusConfig";

interface Props {
  isLoading: boolean;
  groups?: TestCaseGroup[];
}

const LoadingData = () => {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="w-6 h-6" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-24 h-6" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-24 h-6" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-24 h-6" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-16 h-6" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-16 h-6" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

function TestcaseTable({ isLoading, groups }: Props) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const hasMultipleGroups = (groups?.length ?? 0) > 1;
  let globalIndex = 0;

  return (
    <>
      {!isLoading && (
        <h6 className="text-sm font-semibold text-(--gray-11) mt-4">
          Testcases
        </h6>
      )}
      <Table className="mt-2 overflow-visible">
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Input</TableHead>
            <TableHead>Expected Output</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Time</TableHead>
            <TableHead className="w-[80px]">Memory</TableHead>
            <TableHead className="w-[32px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <LoadingData />
          ) : (
            groups?.map((group, groupIndex) => (
              <Fragment key={group.id}>
                {hasMultipleGroups && (
                  <TableRow className="bg-(--gray-3) hover:bg-(--gray-3)">
                    <TableCell colSpan={7} className="py-1.5 px-3">
                      <span className="text-xs font-semibold text-(--gray-11)">
                        Group {groupIndex + 1}
                      </span>
                    </TableCell>
                  </TableRow>
                )}
                {group.results.map((result) => {
                  const index = globalIndex++;
                  const statusInfo = getStatusConfig(result.status);
                  const hasMessage =
                    result.status !== "RUN_PASSED" && !!result.message;
                  const isExpanded = expandedRows.has(result.id);

                  return (
                    <Fragment key={result.id}>
                      <TableRow
                        className={cn(hasMessage && "cursor-pointer")}
                        onClick={
                          hasMessage ? () => toggleRow(result.id) : undefined
                        }
                      >
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-(--gray-4) px-1 py-0.5 rounded">
                            {result.input || "-"}
                          </code>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-(--gray-4) px-1 py-0.5 rounded">
                            {result.output || "-"}
                          </code>
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "text-xs font-medium",
                              statusInfo.className,
                            )}
                          >
                            {statusInfo.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-(--gray-11)">
                          {result.wall_time > 0
                            ? `${result.wall_time.toFixed(2)}ms`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-xs text-(--gray-11)">
                          {result.memory > 0
                            ? `${(result.memory / 1024).toFixed(2)}KB`
                            : "-"}
                        </TableCell>
                        <TableCell className="p-0">
                          {hasMessage &&
                            (isExpanded ? (
                              <ChevronDown size="0.875rem" className="text-(--gray-9)" />
                            ) : (
                              <ChevronRight size="0.875rem" className="text-(--gray-9)" />
                            ))}
                        </TableCell>
                      </TableRow>
                      {hasMessage && isExpanded && (
                        <TableRow>
                          <TableCell colSpan={7} className="bg-(--gray-3) p-3">
                            <pre className="text-xs text-(--gray-12) whitespace-pre-wrap font-mono">
                              {result.message}
                            </pre>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}
              </Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}

export default TestcaseTable;
