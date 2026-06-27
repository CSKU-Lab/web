"use client";

import { useMemo } from "react";
import { Pie, PieChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import type { TypeCount } from "../types";

const PALETTE = ["var(--blue-9)", "var(--grass-9)", "var(--amber-9)", "var(--plum-9)"];

interface Props {
  data: TypeCount[];
}

function SubmissionsByTypeChart({ data }: Props) {
  const { chartData, chartConfig } = useMemo(() => {
    const config: ChartConfig = {};
    const rows = data.map((row, i) => {
      const color = PALETTE[i % PALETTE.length];
      config[row.type] = { label: row.type, color };
      return { ...row, fill: color };
    });
    return { chartData: rows, chartConfig: config };
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-(--gray-10)">
        No submissions in range
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="mx-auto h-64">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="type" hideLabel />} />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="type"
          innerRadius={60}
          outerRadius={100}
          strokeWidth={0}
        />
      </PieChart>
    </ChartContainer>
  );
}

export default SubmissionsByTypeChart;
