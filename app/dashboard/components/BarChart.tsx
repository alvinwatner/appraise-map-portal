"use client";

import {
  Bar,
  BarChart as ReBarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  Cell,
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
    label: "Valuation",
    color: "hsl(var(--teal-500))",
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

  // Find the peak month index
  const peakIndex = data.reduce(
    (maxIdx, val, idx, arr) => (val > arr[maxIdx] ? idx : maxIdx),
    0
  );

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2 shrink-0">
        <CardTitle className="text-base">Total Valuation Performance</CardTitle>
        <CardDescription>
          January - December {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ReBarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 24,
              right: 12,
              left: 12,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(173, 72%, 44%)" stopOpacity={0.9} />
                <stop offset="100%" stopColor="hsl(173, 72%, 44%)" stopOpacity={0.5} />
              </linearGradient>
              <linearGradient id="barGradientPeak" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(175, 77%, 36%)" stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(175, 77%, 36%)" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.3} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              fontSize={11}
            />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--teal-100))", opacity: 0.3 }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="valuation" radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === peakIndex ? "url(#barGradientPeak)" : "url(#barGradient)"}
                />
              ))}
              <LabelList
                position="top"
                offset={8}
                className="fill-foreground"
                fontSize={10}
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
