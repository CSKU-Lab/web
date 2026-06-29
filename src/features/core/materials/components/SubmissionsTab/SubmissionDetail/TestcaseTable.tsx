import { useState, Fragment } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import type { TestCaseGroup } from "~/types/core-code-submission";
import { getStatusConfig } from "~/features/core/materials/utils/submission-detail/statusConfig";

interface Props {
  isLoading: boolean;
  groups?: TestCaseGroup[];
}

const LoadingData = () => {
  return (
    <div className="mt-2 space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="border border-(--gray-4) rounded-lg p-3 space-y-3"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="w-6 h-5" />
            <Skeleton className="w-20 h-5" />
            <Skeleton className="w-16 h-5" />
            <Skeleton className="w-16 h-5" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="w-full h-[120px]" />
            <Skeleton className="w-full h-[120px]" />
          </div>
        </div>
      ))}
    </div>
  );
};

const textareaClass =
  "w-full min-h-[120px] p-2 resize-none font-mono text-sm border border-gray-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-5";

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
      {isLoading ? (
        <LoadingData />
      ) : (
        <div className="mt-2 space-y-3">
          {groups?.map((group, groupIndex) => (
            <Fragment key={group.id}>
              {hasMultipleGroups && (
                <div className="px-1 pt-2">
                  <span className="text-xs font-semibold text-(--gray-11)">
                    Group {groupIndex + 1}
                  </span>
                </div>
              )}
              {group.results.map((result) => {
                const index = globalIndex++;
                const statusInfo = getStatusConfig(result.status);
                const hasMessage =
                  result.status !== "RUN_PASSED" && !!result.message;
                const isExpanded = expandedRows.has(result.id);

                return (
                  <div
                    key={result.id}
                    className="border border-(--gray-4) rounded-lg p-3 space-y-3"
                  >
                    {/* Detail line */}
                    <div className="flex items-center gap-4 text-xs">
                      <span className="font-medium text-(--gray-12)">
                        #{index + 1}
                      </span>
                      <span
                        className={cn("font-medium", statusInfo.className)}
                      >
                        {statusInfo.label}
                      </span>
                      <span className="text-(--gray-11)">
                        Time:{" "}
                        {result.wall_time > 0
                          ? `${result.wall_time.toFixed(2)}ms`
                          : "-"}
                      </span>
                      <span className="text-(--gray-11)">
                        Memory:{" "}
                        {result.memory > 0
                          ? `${(result.memory / 1024).toFixed(2)}KB`
                          : "-"}
                      </span>
                      {hasMessage && (
                        <button
                          type="button"
                          onClick={() => toggleRow(result.id)}
                          className="ml-auto flex items-center gap-1 text-(--gray-9)"
                        >
                          {isExpanded ? "Hide details" : "Show details"}
                          {isExpanded ? (
                            <ChevronDown size="0.875rem" />
                          ) : (
                            <ChevronRight size="0.875rem" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Input | Expected Output */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-xs text-(--gray-11)">Input</span>
                        <textarea
                          value={result.input || "-"}
                          readOnly
                          disabled
                          className={textareaClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-(--gray-11)">
                          Expected Output
                        </span>
                        <textarea
                          value={result.output || "-"}
                          readOnly
                          disabled
                          className={textareaClass}
                        />
                      </div>
                    </div>

                    {hasMessage && isExpanded && (
                      <pre className="text-xs text-(--gray-12) whitespace-pre-wrap font-mono bg-(--gray-3) p-3 rounded-md">
                        {result.message}
                      </pre>
                    )}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      )}
    </>
  );
}

export default TestcaseTable;
