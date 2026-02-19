import { useState, Fragment } from "react";
import { ChevronRight, ChevronDown, Clock, HardDrive } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import CodePreview from "~/components/Editor/CodePreview";
import type { CodeSubmissionData } from "~/types/cms-section-submission";
import type { CodeSubmissionResultStatus } from "~/types/core-code-submission";

interface CodeSubmissionDetailProps {
  created_at: string;
  submission: CodeSubmissionData;
}

const statusConfig: Record<
  CodeSubmissionResultStatus,
  { label: string; className: string }
> = {
  RUN_PASSED: { label: "Passed", className: "text-(--grass-11)" },
  RUN_FAILED: { label: "Failed", className: "text-(--tomato-11)" },
  COMPILE_FAILED: { label: "Compile Error", className: "text-(--tomato-11)" },
  GRADER_ERROR: { label: "Grader Error", className: "text-(--tomato-11)" },
  TIME_LIMIT_EXCEEDED: { label: "TLE", className: "text-(--yellow-11)" },
  MEMORY_LIMIT_EXCEEDED: { label: "MLE", className: "text-(--yellow-11)" },
  RUNTIME_ERROR: { label: "Runtime Error", className: "text-(--tomato-11)" },
  SIGNAL_ERROR: { label: "Signal Error", className: "text-(--tomato-11)" },
};

function getStatusConfig(status: string) {
  return (
    statusConfig[status as CodeSubmissionResultStatus] ?? {
      label: status,
      className: "text-(--gray-11)",
    }
  );
}

function formatTime(ms: number): string {
  if (ms <= 0) return "-";
  return `${ms.toFixed(2)}ms`;
}

function formatMemory(bytes: number): string {
  if (bytes <= 0) return "-";
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
  return `${(bytes / 1024).toFixed(2)}KB`;
}

function CodeSubmissionDetail({
  created_at,
  submission,
}: CodeSubmissionDetailProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allResults =
    submission.test_case_groups?.flatMap((group) => group.results) ?? [];

  return (
    <div className="p-4 space-y-4 overflow-auto">
      {/* Metrics */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-(--gray-11)">
          <Clock size="0.875rem" />
          <span>Avg Time: {formatTime(submission.avg_wall_time)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-(--gray-11)">
          <HardDrive size="0.875rem" />
          <span>Avg Memory: {formatMemory(submission.avg_memory)}</span>
        </div>
        <span className="text-xs text-(--gray-9)">
          Submitted: {new Date(created_at).toLocaleString()}
        </span>
      </div>

      {/* Code Preview */}
      <CodePreview files={submission.files} className="h-140" />

      {/* Test Case Table */}
      {allResults.length > 0 && (
        <>
          <h6 className="text-sm font-semibold text-(--gray-11)">Test Cases</h6>
          <Table className="overflow-visible">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead>Input</TableHead>
                <TableHead>Output</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Time</TableHead>
                <TableHead className="w-[80px]">Memory</TableHead>
                <TableHead className="w-[32px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {allResults.map((result, index) => {
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
                        {formatTime(result.wall_time)}
                      </TableCell>
                      <TableCell className="text-xs text-(--gray-11)">
                        {formatMemory(result.memory)}
                      </TableCell>
                      <TableCell className="p-0">
                        {hasMessage &&
                          (isExpanded ? (
                            <ChevronDown
                              size="0.875rem"
                              className="text-(--gray-9)"
                            />
                          ) : (
                            <ChevronRight
                              size="0.875rem"
                              className="text-(--gray-9)"
                            />
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
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}

export default CodeSubmissionDetail;
