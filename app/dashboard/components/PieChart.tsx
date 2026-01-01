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

  // Use teal color palette for consistency
  const chartData = data.map((value, index) => ({
    year: years[index],
    value,
    fill: [
      "hsl(173, 72%, 44%)",  // teal-500
      "hsl(170, 73%, 70%)",  // teal-300
      "hsl(167, 76%, 90%)",  // teal-100
    ][index],
  }));

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2 shrink-0">
        <CardTitle className="text-base">Yearly Valuation Comparison</CardTitle>
        <CardDescription>Last 3 years performance</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center min-h-0 p-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-square h-full w-full"
        >
          <RePieChart>
            <ReTooltip
              formatter={(value) => [`${Number(value).toLocaleString()}`]}
              cursor={false}
            />
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius="35%"
              outerRadius="70%"
            >
              <LabelList
                dataKey="year"
                className="fill-foreground"
                stroke="none"
                fontSize={12}
                fontWeight={600}
                formatter={(value: number) => `${value}`}
              />
            </Pie>
          </RePieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default PieChart;
