"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import type { DailySubmissions } from "../types";

const chartConfig = {
  total: { label: "Total", color: "var(--blue-9)" },
  passed: { label: "Passed", color: "var(--grass-9)" },
} satisfies ChartConfig;

interface Props {
  data: DailySubmissions[];
}

// Show only month-day so a 30-point axis stays readable.
const formatDate = (date: string) => date.slice(5);

function SubmissionsTrendChart({ data }: Props) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tickLine={false}
          axisLine={false}
          minTickGap={24}
        />
        <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={32} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          dataKey="total"
          stroke="var(--color-total)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="passed"
          stroke="var(--color-passed)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

export default SubmissionsTrendChart;
