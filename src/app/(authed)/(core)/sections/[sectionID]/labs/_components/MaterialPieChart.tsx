"use client";

import * as React from "react";
import { Pie, Label, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

export const description = "A donut chart with text";

const chartData = [
  { progress: "Todo", materials: 3, fill: "var(--color-todo)" },
  { progress: "Done", materials: 10, fill: "var(--color-done)" },
];

const chartConfig = {
  materials: {
    label: "Materials",
  },
  todo: {
    label: "Todo",
    color: "var(--chart-1)",
  },
  done: {
    label: "Done",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function MaterialPieChart() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.materials, 0);
  }, []);

  return (
    <ChartContainer config={chartConfig} className="mx-auto flex w-fit h-full ">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="materials"
          nameKey="progress"
          innerRadius={60}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalVisitors.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Materials
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
