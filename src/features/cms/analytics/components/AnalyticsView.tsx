"use client";

import { useState } from "react";
import PageTitle from "~/components/commons/PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import useAnalyticsOverview from "../hooks/useAnalyticsOverview";
import ActiveUsersChart from "./ActiveUsersChart";
import SubmissionsByTypeChart from "./SubmissionsByTypeChart";
import SubmissionsTrendChart from "./SubmissionsTrendChart";
import SummaryCards from "./SummaryCards";
import TopCoursesList from "./TopCoursesList";

const RANGES = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

function AnalyticsView() {
  const [days, setDays] = useState(30);
  const { data, isLoading, isError, refetch } = useAnalyticsOverview(days);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      <div className="flex items-center justify-between">
        <PageTitle>Analytics</PageTitle>
        <div className="flex gap-1 rounded-lg bg-(--gray-3) p-1">
          {RANGES.map((range) => (
            <button
              key={range.days}
              onClick={() => setDays(range.days)}
              className={`rounded-md px-3 py-1 text-sm transition-colors ${
                days === range.days
                  ? "bg-(--gray-1) font-medium text-(--gray-12) shadow-sm"
                  : "text-(--gray-11) hover:text-(--gray-12)"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {isError && (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <p className="text-(--gray-11)">Failed to load analytics.</p>
          <button
            onClick={() => refetch()}
            className="rounded-md bg-(--gray-12) px-4 py-2 text-sm text-(--gray-1)"
          >
            Retry
          </button>
        </div>
      )}

      {isLoading && !data && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
          <Skeleton className="h-72 w-full" />
        </div>
      )}

      {data && (
        <>
          <SummaryCards summary={data.summary} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Submissions per day</CardTitle>
              </CardHeader>
              <CardContent>
                <SubmissionsTrendChart data={data.submissions_per_day} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active users per day</CardTitle>
              </CardHeader>
              <CardContent>
                <ActiveUsersChart data={data.active_users_per_day} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submissions by type</CardTitle>
              </CardHeader>
              <CardContent>
                <SubmissionsByTypeChart data={data.submissions_by_type} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top courses</CardTitle>
              </CardHeader>
              <CardContent>
                <TopCoursesList data={data.top_courses} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsView;
