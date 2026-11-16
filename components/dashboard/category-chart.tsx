'use client'

import { Pie, PieChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { categoryBreakdown } from '@/lib/mock-data'

const config = {
  value: { label: 'عدد' },
} satisfies ChartConfig

export function CategoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>التوزيع حسب التصنيف</CardTitle>
        <CardDescription>نسبة الشكاوى لكل فئة</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="mx-auto aspect-square h-[220px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="category" hideLabel />} />
            <Pie
              data={categoryBreakdown}
              dataKey="value"
              nameKey="category"
              innerRadius={55}
              strokeWidth={4}
            />
          </PieChart>
        </ChartContainer>
        <ul className="mt-4 space-y-2">
          {categoryBreakdown.map((item) => (
            <li key={item.category} className="flex items-center gap-2 text-sm">
              <span className="size-3 rounded-sm" style={{ background: item.fill }} />
              <span className="text-muted-foreground">{item.category}</span>
              <span className="mr-auto font-semibold">{item.value}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
