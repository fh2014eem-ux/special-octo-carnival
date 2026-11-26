'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { monthlyTrend } from '@/lib/mock-data'

const config = {
  received: { label: 'واردة', color: 'var(--chart-1)' },
  resolved: { label: 'تم حلها', color: 'var(--chart-2)' },
} satisfies ChartConfig

export function TrendChart() {
  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle>حركة الشكاوى الشهرية</CardTitle>
        <CardDescription>مقارنة الشكاوى الواردة مع التي تم حلها خلال العام</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[280px] w-full">
          <AreaChart data={monthlyTrend} margin={{ left: 4, right: 4, top: 8 }}>
            <defs>
              <linearGradient id="fillReceived" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-received)" stopOpacity={0.7} />
                <stop offset="95%" stopColor="var(--color-received)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-resolved)" stopOpacity={0.7} />
                <stop offset="95%" stopColor="var(--color-resolved)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              reversed
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={32}
              orientation="right"
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="received"
              type="monotone"
              stroke="var(--color-received)"
              fill="url(#fillReceived)"
              strokeWidth={2}
            />
            <Area
              dataKey="resolved"
              type="monotone"
              stroke="var(--color-resolved)"
              fill="url(#fillResolved)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
