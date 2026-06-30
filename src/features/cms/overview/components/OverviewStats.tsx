"use client";

import type { AnalyticsSummary } from "~/features/cms/analytics/types";

interface Props {
  summary: AnalyticsSummary;
}

// Quiet inline metrics — the courses below are the hero, so stats read as a
// single glanceable line rather than a row of boxed cards.
function OverviewStats({ summary }: Props) {
  const items = [
    { label: "submissions today", value: summary.submissions_today.toLocaleString() },
    { label: "active today", value: summary.active_users_today.toLocaleString() },
    {
      label: "pass rate",
      value: `${(summary.pass_rate_of_graded * 100).toFixed(0)}%`,
    },
    { label: "active courses", value: summary.active_courses.toLocaleString() },
    { label: "total users", value: summary.total_users.toLocaleString() },
  ];

  return (
    <dl className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline gap-2">
          <dd className="text-2xl font-semibold tabular-nums text-(--gray-12)">
            {item.value}
          </dd>
          <dt className="text-xs text-(--gray-10)">{item.label}</dt>
        </div>
      ))}
    </dl>
  );
}

export default OverviewStats;
