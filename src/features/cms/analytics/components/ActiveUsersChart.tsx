"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import type { DailyCount } from "../types";

const chartConfig = {
  count: { label: "Active Users", color: "var(--plum-9)" },
} satisfies ChartConfig;

interface Props {
  data: DailyCount[];
}

const formatDate = (date: string) => date.slice(5);

function ActiveUsersChart({ data }: Props) {
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
          dataKey="count"
          stroke="var(--color-count)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

export default ActiveUsersChart;
