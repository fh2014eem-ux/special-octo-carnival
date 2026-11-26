"use client"

import Link from "next/link"

import { useStore } from "@/lib/store"
import { operationStats } from "@/lib/stats"

import { PageHeader } from "@/components/shared"
import { StatCards } from "@/components/dashboard/stat-cards"
import { OverviewCharts } from "@/components/dashboard/overview-charts"
import { RecentOperations } from "@/components/dashboard/recent-operations"

import { Button } from "@/components/ui/button"
import { FilePlus2 } from "lucide-react"

export function MainDashboardPage() {
  const { scopedOperations, isAdmin } = useStore()

  const stats = operationStats(scopedOperations)

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

      <div className="flex flex-col gap-6">
        <StatCards {...stats} />
        <OverviewCharts ops={scopedOperations} />
        <RecentOperations ops={scopedOperations} />
      </div>
    </div>
  )
}