// src/components/AnalyticsCharts.tsx
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";

interface ChartData {
  date: string;
  tasks: number;
}

interface AnalyticsChartsProps {
  data: ChartData[];
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Tasks Completed Per Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={data} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)} // Show "Sep" instead of "September"
            />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="tasks" fill="var(--color-primary)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}