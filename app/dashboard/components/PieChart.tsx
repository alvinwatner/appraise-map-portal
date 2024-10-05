"use client";

import {
  LabelList,
  Pie,
  PieChart as RePieChart,
  Tooltip as ReTooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface PieChartProps {
  data: number[];
}

// Dynamic chart configuration
const chartConfig: ChartConfig = {
  currentYear: {
    label: new Date().getFullYear().toString(),
  },
  lastYear: {
    label: (new Date().getFullYear() - 1).toString(),
  },
  twoYearsAgo: {
    label: (new Date().getFullYear() - 2).toString(),
  },
} satisfies ChartConfig;

export function PieChart({ data }: PieChartProps) {
  const years = [
    new Date().getFullYear(),
    new Date().getFullYear() - 1,
    new Date().getFullYear() - 2,
  ];

  const chartData = data.map((value, index) => ({
    year: years[index],
    value,
    fill: `hsl(var(--chart-${index + 1}))`,
  }));

  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle>Pie Chart - Yearly Data</CardTitle>
        <CardDescription>Yearly Data Summary</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RePieChart>
            <ReTooltip formatter={(value) => [`${value}`]} cursor={false} />
            <Pie data={chartData} dataKey="value" cx="50%" cy="50%">
              <LabelList
                dataKey="year"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: number) => `${value}`}
              />
            </Pie>
          </RePieChart>
        </ChartContainer>
      </CardContent>
    </div>
  );
}

export default PieChart;
