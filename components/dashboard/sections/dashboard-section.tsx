"use client"

import {
  MessageSquareWarning,
  CheckCircle2,
  Clock,
  Megaphone,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/dashboard/stat-card"
import {
  complaints,
  fieldActivities,
  openingMinutes,
} from "@/lib/mock-data"
import { statusLabels, type ComplaintStatus } from "@/lib/types"

const monthlyData = [
  { month: "أبريل", received: 42, resolved: 38 },
  { month: "مايو", received: 55, resolved: 49 },
  { month: "يونيو", received: 48, resolved: 45 },
  { month: "يوليو", received: 63, resolved: 52 },
  { month: "أغسطس", received: 71, resolved: 60 },
  { month: "سبتمبر", received: 58, resolved: 41 },
]

const trendConfig = {
  received: { label: "واردة", color: "var(--chart-1)" },
  resolved: { label: "تم حلها", color: "var(--chart-2)" },
} satisfies ChartConfig

const categoryData = [
  { category: "شكاوى", count: 24, fill: "var(--chart-1)" },
  { category: "بلاغات", count: 12, fill: "var(--chart-2)" },
  { category: "طلبات", count: 18, fill: "var(--chart-3)" },
  { category: "مقترحات", count: 7, fill: "var(--chart-4)" },
]

const categoryConfig = {
  count: { label: "العدد" },
} satisfies ChartConfig

const statusColors: Record<ComplaintStatus, string> = {
  NEW: "var(--chart-1)",
  IN_PROGRESS: "var(--chart-3)",
  RESOLVED: "var(--chart-2)",
  CLOSED: "var(--chart-4)",
  REJECTED: "var(--chart-5)",
}

export function DashboardSection() {
  const total = complaints.length
  const resolved = complaints.filter(
    (c) => c.status === "RESOLVED" || c.status === "CLOSED",
  ).length
  const pending = complaints.filter(
    (c) => c.status === "NEW" || c.status === "IN_PROGRESS",
  ).length
  const beneficiaries = fieldActivities.reduce(
    (sum, a) => sum + a.malesCount + a.femalesCount,
    0,
  )

  const statusCounts = (
    Object.keys(statusLabels) as ComplaintStatus[]
  ).map((s) => ({
    status: statusLabels[s],
    key: s,
    value: complaints.filter((c) => c.status === s).length,
    fill: statusColors[s],
  }))

  const statusConfig = statusCounts.reduce((acc, item) => {
    acc[item.key] = { label: item.status, color: item.fill }
    return acc
  }, {} as ChartConfig)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="إجمالي الشكاوى"
          value={total}
          icon={MessageSquareWarning}
          trend={12}
          trendLabel="عن الشهر الماضي"
        />
        <StatCard
          title="تمت المعالجة"
          value={resolved}
          icon={CheckCircle2}
          trend={8}
          trendLabel="عن الشهر الماضي"
          accent="success"
        />
        <StatCard
          title="قيد المتابعة"
          value={pending}
          icon={Clock}
          trend={-4}
          trendLabel="عن الشهر الماضي"
          accent="warning"
        />
        <StatCard
          title="المستفيدون من التوعية"
          value={beneficiaries}
          icon={Megaphone}
          trend={21}
          trendLabel="عن الشهر الماضي"
          accent="primary"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>حركة الشكاوى الشهرية</CardTitle>
            <CardDescription>
              مقارنة بين الشكاوى الواردة والتي تمت معالجتها
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendConfig} className="h-[280px] w-full">
              <AreaChart data={monthlyData} accessibilityLayer>
                <defs>
                  <linearGradient id="fillReceived" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-received)" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="var(--color-received)" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="fillResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-resolved)" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="var(--color-resolved)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  reversed
                />
                <YAxis tickLine={false} axisLine={false} width={30} orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey="received"
                  type="monotone"
                  fill="url(#fillReceived)"
                  stroke="var(--color-received)"
                  strokeWidth={2}
                />
                <Area
                  dataKey="resolved"
                  type="monotone"
                  fill="url(#fillResolved)"
                  stroke="var(--color-resolved)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>توزيع حالات الشكاوى</CardTitle>
            <CardDescription>النسب حسب الحالة الحالية</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={statusConfig} className="mx-auto h-[220px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
                <Pie
                  data={statusCounts}
                  dataKey="value"
                  nameKey="status"
                  innerRadius={55}
                  strokeWidth={4}
                >
                  {statusCounts.map((entry) => (
                    <Cell key={entry.key} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="mt-4 flex flex-col gap-2">
              {statusCounts.map((s) => (
                <div
                  key={s.key}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: s.fill }}
                    />
                    <span className="text-muted-foreground">{s.status}</span>
                  </div>
                  <span className="font-medium tabular-nums">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>الشكاوى حسب النوع</CardTitle>
            <CardDescription>تصنيف البلاغات الواردة</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={categoryConfig} className="h-[260px] w-full">
              <BarChart data={categoryData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  reversed
                />
                <YAxis tickLine={false} axisLine={false} width={30} orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={6}>
                  {categoryData.map((entry) => (
                    <Cell key={entry.category} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>آخر محاضر الفتح</CardTitle>
            <CardDescription>أحدث عمليات فتح الصناديق</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {openingMinutes.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{m.minuteNumber}</span>
                  <span className="text-xs text-muted-foreground">
                    {m.boxNumber} • {m.openDate}
                  </span>
                </div>
                <Badge variant="secondary">{m.totalOperations} عملية</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
