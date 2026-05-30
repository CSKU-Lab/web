"use client";

import { Pie, Label, PieChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

const chartConfig = {
  completed: {
    label: "Completed",
    color: "var(--color-done)",
  },
  remaining: {
    label: "Remaining",
    color: "var(--color-muted)",
  },
} satisfies ChartConfig;

interface MaterialPieChartProps {
  totalMaterials: number;
  completedMaterials: number;
}

export function MaterialPieChart({
  totalMaterials,
  completedMaterials,
}: MaterialPieChartProps) {
  const percentize = (number: number) => {
    return Number((number * (100 / totalMaterials)).toFixed(2));
  };

  const chartData = [
    { name: "Completed", value: completedMaterials, fill: "var(--color-done)" },
    {
      name: "Remaining",
      value: totalMaterials - completedMaterials,
      fill: "var(--color-muted)",
    },
  ];
  return (
    <ChartContainer config={chartConfig} className="mx-auto w-full h-full">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          innerRadius={90}
          outerRadius={100}
          startAngle={220}
          endAngle={-40}
          strokeWidth={0}
        >
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox))
                return null;

              const { cx, cy } = viewBox;

              return (
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan
                    x={cx}
                    y={cy}
                    className="fill-foreground text-3xl font-bold"
                  >
                    {percentize(completedMaterials)}%
                  </tspan>

                  <tspan
                    x={cx}
                    y={cy! + 40}
                    dy="1.6em"
                    className="fill-muted-foreground text-xs"
                  >
                    {completedMaterials} / {totalMaterials}
                  </tspan>

                  <tspan
                    x={cx}
                    dy="1.4em"
                    className="fill-muted-foreground text-sm"
                  >
                    Completed
                  </tspan>
                </text>
              );
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
