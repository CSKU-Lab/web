"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ArrowLeft, Inbox, RotateCcw, Loader2, AlertCircle, ChevronDown, ChevronUp, Crown } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Skeleton } from "~/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import useMaterialSubmissionPagination from "~/features/core/materials/hooks/useMaterialSubmisionPagination";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import { SUBMISSION_PAGE_SIZE } from "~/features/core/materials/constants/submissions";
import type { TypingSubmissionOverview } from "~/features/core/materials/components/TypingSection/types";
import { coreMaterialService } from "~/services/core-material.service";
import { queryKeys } from "~/queryKeys";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const chartConfig = {
  adj_wpm: { label: "Adj WPM", color: "var(--grass-9)" },
  raw_wpm: { label: "Raw WPM", color: "var(--gray-7)" },
} satisfies ChartConfig;

interface Props {
  onBack: () => void;
  onRetry?: () => void;
  results?: TypingSubmissionOverview | null;
  isSubmitting?: boolean;
  submitError?: Error | null;
  isExam?: boolean;
  latestAutoScore?: number | null;
}

function ResultsSkeleton() {
  return (
    <div className="mb-6 pb-6 border-b border-(--gray-4)">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-7 w-24 rounded-md" />
      </div>
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex flex-col gap-2 bg-(--gray-2) rounded-lg px-4 py-3">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-7 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SubmissionStatusArea({
  isSubmitting,
  submitError,
}: {
  isSubmitting: boolean;
  submitError: Error | null;
}) {
  const [expanded, setExpanded] = useState(false);

  if (isSubmitting) {
    return (
      <div className="flex items-center gap-2 text-(--amber-9) text-sm mt-3">
        <Loader2 size="0.875rem" className="animate-spin" />
        Submitting...
      </div>
    );
  }

  if (submitError) {
    const apiMessage =
      submitError instanceof AxiosError
        ? (submitError.response?.data?.error ?? submitError.message)
        : submitError.message;
    const requestId =
      submitError instanceof AxiosError
        ? (submitError.response?.headers?.["x-request-id"] as string | undefined)
        : undefined;

    return (
      <div className="mt-3 rounded-md border border-(--tomato-6) bg-(--tomato-2) overflow-hidden">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-(--tomato-11)"
        >
          <div className="flex items-center gap-2">
            <AlertCircle size="0.875rem" />
            Submission failed
          </div>
          {expanded ? <ChevronUp size="0.75rem" /> : <ChevronDown size="0.75rem" />}
        </button>
        {expanded && (
          <div className="px-3 pb-3 border-t border-(--tomato-6) pt-2 space-y-1">
            <p className="text-xs text-(--tomato-10) font-mono">
              {apiMessage || "An unexpected error occurred"}
            </p>
            {requestId && (
              <p className="text-xs text-(--tomato-9) font-mono">
                Request ID: {requestId}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}

function ResultsSummary({
  results,
  isSubmitting = false,
  submitError = null,
  onRetry,
  isExam = false,
  autoScore = null,
}: {
  results: TypingSubmissionOverview;
  isSubmitting?: boolean;
  submitError?: Error | null;
  onRetry?: () => void;
  isExam?: boolean;
  autoScore?: number | null;
}) {
  const stats = [
    { label: "Raw WPM", value: Math.round(results.raw_wpm) },
    { label: "Adj WPM", value: Math.round(results.adjusted_wpm) },
    { label: "Accuracy", value: `${Math.round(100 - results.error_rate)}%` },
    { label: "Error Rate", value: `${results.error_rate.toFixed(1)}%` },
    { label: "Duration", value: `${Math.round(results.duration)}s` },
    ...(isExam && autoScore !== null ? [{ label: "Score", value: `${autoScore}` }] : []),
  ];

  return (
    <div className="mb-6 pb-6 border-b border-(--gray-4)">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-(--gray-12)">Latest Result</h3>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-(--gray-11) hover:text-(--gray-12) bg-(--gray-2) hover:bg-(--gray-3) border border-(--gray-4) rounded-md transition-colors"
          >
            <RotateCcw size="0.75rem" />
            Try Again
            <span className="opacity-40 font-mono">esc</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-5 gap-3 mb-4" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
        {stats.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-0.5 bg-(--gray-2) rounded-lg px-4 py-3">
            <span className="text-xs text-(--gray-9) uppercase tracking-wider font-mono">{label}</span>
            <span className="text-2xl font-bold text-(--gray-12) font-mono">{value}</span>
          </div>
        ))}
      </div>

      <SubmissionStatusArea isSubmitting={isSubmitting} submitError={submitError} />
    </div>
  );
}

export default function TypingSubmissionsList({
  onBack,
  onRetry,
  results = null,
  isSubmitting = false,
  submitError = null,
  isExam = false,
  latestAutoScore = null,
}: Props) {
  const { materialID, slug: labID, sectionID } = useParams<{
    materialID: string;
    slug: string;
    sectionID: string;
  }>();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (results != null && onRetry) onRetry();
      else onBack();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [results, onRetry, onBack]);

  const { data, fetchNextPage, hasNextPage, isFetching } =
    useMaterialSubmissionPagination<TypingSubmissionOverview>({});

  const { data: bestData } = useQuery({
    queryKey: queryKeys.core.material.getBestTypingSubmission(materialID, labID, sectionID),
    queryFn: () => coreMaterialService.getBestTypingSubmission(materialID, labID, sectionID),
  });
  const bestSubmissionId = bestData?.id ?? null;

  const submissions = data?.pages.flatMap((page) => page.data) ?? [];
  const totalRows = data?.pages[0]?.pagination.total_rows ?? 0;

  const loadMoreRef = useOnElementAppear({
    onAppear: () => {
      if (hasNextPage && !isFetching) fetchNextPage();
    },
    enabled: hasNextPage && !isFetching,
  });

  const chartData = [...submissions]
    .reverse()
    .map((s, i) => {
      const p = s.payload as TypingSubmissionOverview | undefined;
      return {
        index: i + 1,
        adj_wpm: p ? Math.round(p.adjusted_wpm) : 0,
        raw_wpm: p ? Math.round(p.raw_wpm) : 0,
      };
    });

  const showSkeleton = isFetching && submissions.length === 0;

  return (
    <div className="flex flex-col h-full bg-(--gray-1) overflow-hidden">
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-(--gray-10) hover:text-(--gray-12) transition-colors mb-6"
        >
          <ArrowLeft size="0.75rem" />
          Back to typing
        </button>

        {/* Results summary — shown after completing a test */}
        {isSubmitting && !results ? (
          <ResultsSkeleton />
        ) : results ? (
          <ResultsSummary
            results={results}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onRetry={onRetry}
            isExam={isExam}
            autoScore={latestAutoScore}
          />
        ) : null}

        {showSkeleton ? (
          <div className="space-y-6">
            <Skeleton className="h-36 w-full rounded-lg" />
            <div className="space-y-2">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-(--gray-11)">
            <Inbox className="h-10 w-10 mb-3" />
            <p className="text-sm">No submissions yet</p>
          </div>
        ) : (
          <>
            {chartData.length > 1 && (
              <div className="mb-6">
                <ChartContainer config={chartConfig} className="h-36 w-full">
                  <LineChart data={chartData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="var(--gray-4)" />
                    <XAxis
                      dataKey="index"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: "var(--gray-10)" }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: "var(--gray-10)" }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      dataKey="raw_wpm"
                      stroke="var(--color-raw_wpm)"
                      strokeWidth={1.5}
                      dot={false}
                      strokeDasharray="4 2"
                    />
                    <Line
                      dataKey="adj_wpm"
                      stroke="var(--color-adj_wpm)"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "var(--color-adj_wpm)", strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            )}

            <table className="w-full text-sm">
              <thead>
                <tr className="bg-(--gray-3) text-(--gray-10) text-xs uppercase tracking-wider">
                  <th className="px-3 py-2 text-left font-medium rounded-l-md">#</th>
                  <th className="px-3 py-2 text-left font-medium">Date</th>
                  <th className="px-3 py-2 text-right font-medium">Raw WPM</th>
                  <th className="px-3 py-2 text-right font-medium">Adj WPM</th>
                  <th className="px-3 py-2 text-right font-medium">Accuracy</th>
                  <th className="px-3 py-2 text-right font-medium">Error Rate</th>
                  <th className={`px-3 py-2 text-right font-medium ${!isExam ? "rounded-r-md" : ""}`}>Duration</th>
                  {isExam && (
                    <th className="px-3 py-2 text-right font-medium rounded-r-md">Score</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data?.pages.map((page, pageIndex) =>
                  page.data.map((submission, index) => {
                    const p = submission.payload as TypingSubmissionOverview | undefined;
                    const order = totalRows - pageIndex * SUBMISSION_PAGE_SIZE - index;
                    const accuracy = p ? Math.round(100 - p.error_rate) : null;
                    const dateObj = dayjs(submission.created_at);
                    const date = Math.abs(dateObj.diff(dayjs(), "day")) <= 2
                      ? dateObj.fromNow()
                      : dateObj.format("DD MMM YYYY HH:mm");

                    const isBest = submission.id === bestSubmissionId;
                    return (
                      <tr
                        key={submission.id}
                        className="border-b border-(--gray-3) hover:bg-(--gray-2) transition-colors"
                      >
                        <td className="px-3 py-2.5 font-mono text-xs">
                          {isBest ? (
                            <Crown size="0.875rem" className="text-(--amber-9)" />
                          ) : (
                            <span className="text-(--gray-10)">{order}</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-(--gray-9) text-xs">{date}</td>
                        <td className="px-3 py-2.5 text-right text-(--gray-11) font-mono">
                          {p ? Math.round(p.raw_wpm) : "—"}
                        </td>
                        <td className="px-3 py-2.5 text-right text-(--grass-11) font-mono font-medium">
                          {p ? Math.round(p.adjusted_wpm) : "—"}
                        </td>
                        <td className="px-3 py-2.5 text-right text-(--gray-11) font-mono">
                          {accuracy !== null ? `${accuracy}%` : "—"}
                        </td>
                        <td className="px-3 py-2.5 text-right text-(--tomato-11) font-mono">
                          {p ? `${p.error_rate.toFixed(1)}%` : "—"}
                        </td>
                        <td className="px-3 py-2.5 text-right text-(--gray-9) font-mono text-xs">
                          {p ? `${Math.round(p.duration)}s` : "—"}
                        </td>
                        {isExam && (
                          <td className="px-3 py-2.5 text-right font-mono text-xs">
                            {submission.auto_score > 0 ? (
                              <span className="text-(--grass-11) font-medium">{submission.auto_score}</span>
                            ) : (
                              <span className="text-(--tomato-11)">0</span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {hasNextPage && (
              <div ref={loadMoreRef} className="pt-2">
                <Skeleton className="h-8 w-full" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
