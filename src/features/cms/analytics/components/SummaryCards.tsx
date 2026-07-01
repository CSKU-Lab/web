"use client";

import { Card, CardContent, CardDescription, CardHeader } from "~/components/ui/card";
import type { AnalyticsSummary } from "../types";

interface Props {
  summary: AnalyticsSummary;
}

function SummaryCards({ summary }: Props) {
  const cards = [
    { label: "Total Users", value: summary.total_users.toLocaleString() },
    {
      label: "Active Today",
      value: summary.active_users_today.toLocaleString(),
    },
    {
      label: "Active Now",
      value: summary.currently_active_users.toLocaleString(),
    },
    {
      label: "Submissions Today",
      value: summary.submissions_today.toLocaleString(),
    },
    {
      label: "Pass Rate (graded)",
      value: `${(summary.pass_rate_of_graded * 100).toFixed(1)}%`,
    },
    {
      label: "Active Courses",
      value: summary.active_courses.toLocaleString(),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader>
            <CardDescription>{card.label}</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-semibold text-(--gray-12)">
              {card.value}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default SummaryCards;
