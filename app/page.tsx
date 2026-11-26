"use client"

import { AppShell } from "@/components/app-shell"
import { MainDashboardPage } from "@/components/main-dashboard-page"

export default function DashboardRoute() {
  return (
    <AppShell>
      <MainDashboardPage />
    </AppShell>
  )
}
