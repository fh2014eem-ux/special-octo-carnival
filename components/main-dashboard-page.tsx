"use client"

import Link from "next/link"

import { useStore } from "@/lib/store"
import { operationStats } from "@/lib/stats"

import { PageHeader } from "@/components/shared"
import { StatCards } from "@/components/dashboard/stat-cards"
import { OverviewCharts } from "@/components/dashboard/overview-charts"
import { RecentOperations } from "@/components/dashboard/recent-operations"

import { Button } from "@/components/ui/button"
import { FilePlus2, ClipboardList, MapPin, Inbox, BarChart3, Microscope, ListChecks, Boxes, BellRing, Users, Settings } from "lucide-react"

export function MainDashboardPage() {
  const { scopedOperations, isAdmin } = useStore()

  const stats = operationStats(scopedOperations)
  const modules = [
    { title: "إدارة العمليات", href: "/operations", icon: ClipboardList },
    { title: "الإدارة الميدانية", href: "/field-activities", icon: MapPin },
    { title: "صناديق الشكاوى ومحاضر الفتح", href: "/complaint-boxes", icon: Inbox },
    { title: "الإحصائيات والتقارير والتصدير", href: "/reports", icon: BarChart3 },
    { title: "التحليل والإجراءات التصحيحية", href: "/corrective-actions", icon: Microscope },
    { title: "إدارة المتابعة والتقييم", href: "/monitoring", icon: ListChecks },
    { title: "إدارة المخزون", href: "/inventory", icon: Boxes },
    { title: "التنبيهات والتأخير", href: "/alerts", icon: BellRing },
    ...(isAdmin ? [{ title: "إدارة المستخدمين والصلاحيات", href: "/users", icon: Users }, { title: "إعدادات النظام والبيانات المرجعية", href: "/settings", icon: Settings }] : []),
  ]

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="لوحة التحكم"
        description={
          isAdmin
            ? "نظرة عامة على جميع الفروع"
            : "نظرة عامة على عمليات فرعك"
        }
        action={
          <Button
            render={<Link href="/operations/new" />}
            className="gap-2"
          >
            <FilePlus2 className="size-4" />
            إدخال عملية جديدة
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map(({ title, href, icon: Icon }) => (
          <Link key={href} href={href} className="flex items-center gap-3 rounded-xl border bg-card p-4 text-sm font-bold transition hover:border-primary/40 hover:bg-muted/50">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></span>
            <span>{title}</span>
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-6">
        <StatCards {...stats} />
        <OverviewCharts ops={scopedOperations} />
        <RecentOperations ops={scopedOperations} />
      </div>
    </div>
  )
}