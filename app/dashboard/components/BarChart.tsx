"use client";

import {
  Bar,
  BarChart as ReBarChart,
  CartesianGrid,
  LabelList,
  XAxis,
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

// List of months to be used for labels
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const chartConfig = {
  valuation: {
    label: " ",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// Utility function to format numbers with K and M
const formatValue = (value: number): string => {
  if (value >= 1_000_000) {
    return `${Math.round(value / 1_000_000).toLocaleString()}M`; // Millions
  } else if (value >= 1_000) {
    return `${Math.round(value / 1_000).toLocaleString()}K`; // Thousands
  }
  return `${value.toLocaleString()}`; // Below 1K
};

// Modify BarChart to accept dynamic data through props
export function BarChart({ data }: { data: number[] }) {
  // Create chartData dynamically by combining months with valuation data
  const chartData = months.map((month, index) => ({
    month,
    valuation: data[index] || 0,
  }));

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Bar Chart - Total Valuation</CardTitle>
        <CardDescription>
          January - December {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full h-5/6">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ReBarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="valuation" fill="var(--color-valuation)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => formatValue(value as number)}
              />
            </Bar>
          </ReBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default BarChart;
