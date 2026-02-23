'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import AppDrawer from '@/components/common/AppDrawer';
import UpdateValueForm from '@/components/UpdateValue/UpdateValueForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

type Props = {
  data: { date: string; value: number }[];
  playerId: string;
  type?: 'linear' | 'natural' | 'monotone' | 'step';
  actionDisabled?: boolean;
};

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export default function PlayerValueChart({
  data,
  playerId,
  type = 'linear',
  actionDisabled,
}: Props) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Player Value History</CardTitle>
        <AppDrawer
          labelBtn="Update value"
          title="Update value"
          disabled={actionDisabled}
        >
          <UpdateValueForm playerId={playerId} />
        </AppDrawer>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-70 w-full">
          <AreaChart
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString('en-US', {
                  month: '2-digit',
                  year: '2-digit',
                  timeZone: 'UTC',
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideIndicator
                  labelFormatter={(value) =>
                    new Date(value as string).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                      timeZone: 'UTC',
                    })
                  }
                />
              }
            />
            <Area
              dataKey="value"
              type={type}
              fill="var(--color-value)"
              fillOpacity={0.25}
              stroke="var(--color-value)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
