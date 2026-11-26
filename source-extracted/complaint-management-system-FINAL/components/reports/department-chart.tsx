'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { departmentPerformance } from '@/lib/mock-data'

const config = {
  resolved: { label: 'تم حلها', color: 'var(--chart-2)' },
  pending: { label: 'قيد الانتظار', color: 'var(--chart-3)' },
} satisfies ChartConfig

export function DepartmentChart() {
  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle>أداء الإدارات</CardTitle>
        <CardDescription>عدد الشكاوى المحلولة مقابل قيد الانتظار لكل إدارة</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[300px] w-full">
          <BarChart data={departmentPerformance} margin={{ left: 4, right: 4, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="department"
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
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="resolved" fill="var(--color-resolved)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" fill="var(--color-pending)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
