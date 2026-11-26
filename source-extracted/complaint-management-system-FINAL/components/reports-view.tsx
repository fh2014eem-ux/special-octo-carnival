"use client"

import useSWR from "swr"
import { Database, HardDrive } from "lucide-react"
import { fetcher, type ReportResponse } from "@/lib/api-client"
import {
  PRIORITY_LABELS,
  PRIORITY_ORDER,
  STATUS_LABELS,
  STATUS_ORDER,
} from "@/lib/types"
import { PageHeader } from "@/components/page-header"

const statusColor: Record<string, string> = {
  NEW: "bg-chart-1",
  IN_PROGRESS: "bg-chart-2",
  RESOLVED: "bg-chart-3",
  REJECTED: "bg-chart-4",
  CLOSED: "bg-chart-5",
}

function BarRow({
  label,
  count,
  max,
  color,
}: {
  label: string
  count: number
  max: number
  color: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-sm text-muted-foreground">{label}</span>
      <div className="h-6 flex-1 overflow-hidden rounded-md bg-muted">
        <div
          className={`flex h-full items-center justify-start rounded-md ${color} px-2 text-xs font-medium text-white`}
          style={{ width: `${(count / max) * 100}%`, minWidth: count ? "1.5rem" : 0 }}
        >
          {count > 0 ? count : ""}
        </div>
      </div>
    </div>
  )
}

export function ReportsView() {
  const { data } = useSWR<ReportResponse>("/api/reports", fetcher)
  const summary = data?.summary

  const maxStatus = summary
    ? Math.max(1, ...STATUS_ORDER.map((s) => summary.byStatus[s] ?? 0))
    : 1
  const maxPriority = summary
    ? Math.max(1, ...PRIORITY_ORDER.map((p) => summary.byPriority[p] ?? 0))
    : 1
  const categories: [string, number][] = summary ? Object.entries(summary.byCategory) as [string, number][] : []
  const maxCategory = Math.max(1, ...categories.map(([, n]) => n))

  return (
    <div>
      <PageHeader
        title="التقارير والإحصائيات"
        description="ملخص أداء معالجة الشكاوى حسب الحالة والأولوية والفئة"
        action={
          data && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              {data.source === "database" ? (
                <>
                  <Database className="size-3.5" /> مصدر البيانات: قاعدة البيانات
                </>
              ) : (
                <>
                  <HardDrive className="size-3.5" /> مصدر البيانات: الذاكرة (تجريبي)
                </>
              )}
            </span>
          )
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard label="إجمالي الشكاوى" value={summary?.total ?? "—"} />
        <SummaryCard
          label="نسبة الحل"
          value={summary ? `${summary.resolvedRate}%` : "—"}
        />
        <SummaryCard
          label="متوسط زمن الحل"
          value={summary ? `${summary.avgResolutionDays} يوم` : "—"}
        />
        <SummaryCard
          label="عدد الفئات"
          value={summary ? Object.keys(summary.byCategory).length : "—"}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            حسب الحالة
          </h2>
          <div className="flex flex-col gap-3">
            {STATUS_ORDER.map((s) => (
              <BarRow
                key={s}
                label={STATUS_LABELS[s]}
                count={summary?.byStatus[s] ?? 0}
                max={maxStatus}
                color={statusColor[s]}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            حسب الأولوية
          </h2>
          <div className="flex flex-col gap-3">
            {PRIORITY_ORDER.map((p) => (
              <BarRow
                key={p}
                label={PRIORITY_LABELS[p]}
                count={summary?.byPriority[p] ?? 0}
                max={maxPriority}
                color="bg-primary"
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            حسب الفئة
          </h2>
          <div className="flex flex-col gap-3">
            {categories.map(([cat, n]) => (
              <BarRow
                key={cat}
                label={cat}
                count={n}
                max={maxCategory}
                color="bg-chart-1"
              />
            ))}
            {categories.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                لا توجد بيانات
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">
        {value}
      </p>
    </div>
  )
}
