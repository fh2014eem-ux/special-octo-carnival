"use client"

import { Card, CardContent } from "@/components/ui/card"
import { formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { ClipboardList, CheckCircle2, Clock, AlertTriangle } from "lucide-react"

interface StatDef {
  label: string
  value: string
  icon: LucideIcon
  tone: string
  hint?: string
}

export function StatCards({
  total,
  closed,
  open,
  highSensitivity,
  closureRate,
}: {
  total: number
  closed: number
  open: number
  highSensitivity: number
  closureRate: number
}) {
  const stats: StatDef[] = [
    {
      label: "إجمالي العمليات",
      value: formatNumber(total),
      icon: ClipboardList,
      tone: "text-chart-1 bg-chart-1/10",
    },
    {
      label: "العمليات المغلقة",
      value: formatNumber(closed),
      icon: CheckCircle2,
      tone: "text-chart-3 bg-chart-3/10",
      hint: `نسبة الإغلاق ${formatNumber(closureRate)}%`,
    },
    {
      label: "قيد المعالجة",
      value: formatNumber(open),
      icon: Clock,
      tone: "text-chart-4 bg-chart-4/10",
    },
    {
      label: "شكاوى عالية الحساسية",
      value: formatNumber(highSensitivity),
      icon: AlertTriangle,
      tone: "text-chart-5 bg-chart-5/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => {
        const Icon = s.icon
        return (
          <Card key={s.label} className="border-border/60">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", s.tone)}>
                <Icon className="size-6" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold tabular-nums">{s.value}</p>
                {s.hint && <p className="text-xs text-muted-foreground">{s.hint}</p>}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
