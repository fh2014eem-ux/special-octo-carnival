'use client'

import { Pie, PieChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { statusDistribution } from '@/lib/mock-data'

const config = {
  value: { label: 'عدد' },
} satisfies ChartConfig

export function StatusChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>توزيع الحالات</CardTitle>
        <CardDescription>نسبة الشكاوى حسب حالة المعالجة</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="mx-auto aspect-square h-[240px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
            <Pie data={statusDistribution} dataKey="value" nameKey="status" strokeWidth={4} />
          </PieChart>
        </ChartContainer>
        <ul className="mt-4 space-y-2">
          {statusDistribution.map((item) => (
            <li key={item.status} className="flex items-center gap-2 text-sm">
              <span className="size-3 rounded-sm" style={{ background: item.fill }} />
              <span className="text-muted-foreground">{item.status}</span>
              <span className="mr-auto font-semibold">{item.value}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
