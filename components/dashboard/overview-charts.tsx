"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"
import type { Operation } from "@/lib/types"
import { STATUS_LIST, OPERATION_TYPES } from "@/lib/data/constants"
import { countBy } from "@/lib/stats"

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export function OverviewCharts({ ops }: { ops: Operation[] }) {
  const byType = countBy(ops, (o) => o.type)
  const typeData = OPERATION_TYPES.map((t) => ({ name: t, value: byType.get(t) ?? 0 })).filter(
    (d) => d.value > 0,
  )

  const byStatus = countBy(ops, (o) => o.status)
  const statusData = STATUS_LIST.map((s) => ({ name: s, value: byStatus.get(s) ?? 0 })).filter(
    (d) => d.value > 0,
  )

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">توزيع العمليات حسب النوع</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ value: { label: "العدد", color: "var(--chart-1)" } }}
            className="h-[260px] w-full"
          >
            <BarChart data={typeData} layout="vertical" margin={{ right: 12, left: 12 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={90}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={6} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">توزيع العمليات حسب الحالة</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ value: { label: "العدد" } }} className="h-[260px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
                {statusData.map((entry, i) => (
                  <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
            {statusData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
