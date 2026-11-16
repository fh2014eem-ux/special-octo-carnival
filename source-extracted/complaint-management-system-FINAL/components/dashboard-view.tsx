"use client"

import useSWR from "swr"
import Link from "next/link"
import {
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowLeft,
} from "lucide-react"
import {
  fetcher,
  type ComplaintsResponse,
  type ReportResponse,
} from "@/lib/api-client"
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/types"
import { PageHeader } from "@/components/page-header"
import { StatusBadge, PriorityBadge } from "@/components/badges"

const chartColor: Record<string, string> = {
  NEW: "bg-chart-1",
  IN_PROGRESS: "bg-chart-2",
  RESOLVED: "bg-chart-3",
  REJECTED: "bg-chart-4",
  CLOSED: "bg-chart-5",
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string | number
  hint?: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function DashboardView() {
  const { data: report } = useSWR<ReportResponse>("/api/reports", fetcher)
  const { data: list } = useSWR<ComplaintsResponse>("/api/complaints", fetcher)

  const summary = report?.summary
  const recent = list?.complaints.slice(0, 5) ?? []
  const maxStatus = summary
    ? Math.max(1, ...STATUS_ORDER.map((s) => summary.byStatus[s] ?? 0))
    : 1

  return (
    <div>
      <PageHeader
        title="لوحة التحكم"
        description="نظرة عامة على أداء معالجة الشكاوى"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="إجمالي الشكاوى"
          value={summary?.total ?? "—"}
          icon={FileText}
        />
        <StatCard
          label="قيد المعالجة"
          value={summary?.byStatus.IN_PROGRESS ?? "—"}
          icon={Clock}
        />
        <StatCard
          label="تم حلها"
          value={
            summary
              ? summary.byStatus.RESOLVED + summary.byStatus.CLOSED
              : "—"
          }
          icon={CheckCircle2}
        />
        <StatCard
          label="نسبة الحل"
          value={summary ? `${summary.resolvedRate}%` : "—"}
          hint={
            summary ? `متوسط زمن الحل ${summary.avgResolutionDays} يوم` : undefined
          }
          icon={TrendingUp}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* توزيع الحالات */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="text-base font-semibold text-foreground">
            توزيع الشكاوى حسب الحالة
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {STATUS_ORDER.map((s) => {
              const count = summary?.byStatus[s] ?? 0
              return (
                <div key={s}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {STATUS_LABELS[s]}
                    </span>
                    <span className="font-medium tabular-nums text-foreground">
                      {count}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${chartColor[s]}`}
                      style={{ width: `${(count / maxStatus) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* أحدث الشكاوى */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              أحدث الشكاوى
            </h2>
            <Link
              href="/complaints"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              عرض الكل
              <ArrowLeft className="size-4" />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {recent.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {c.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {c.referenceNo} · {c.category}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <PriorityBadge priority={c.priority} />
                  <StatusBadge status={c.status} />
                </div>
              </li>
            ))}
            {recent.length === 0 && (
              <li className="py-8 text-center text-sm text-muted-foreground">
                لا توجد شكاوى بعد
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
