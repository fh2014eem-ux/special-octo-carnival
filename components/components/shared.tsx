"use client"

import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { STATUS } from "@/lib/data/constants"

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl text-balance">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  )
}

const STATUS_STYLES: Record<string, string> = {
  [STATUS.NEW]: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  [STATUS.RECEIVED]: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  [STATUS.PROCESSING]: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  [STATUS.WAITING]: "bg-chart-5/15 text-chart-5 border-chart-5/30",
  [STATUS.CLOSED]: "bg-chart-3/15 text-chart-3 border-chart-3/30",
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", STATUS_STYLES[status] ?? "")}>
      {status}
    </Badge>
  )
}

export function TypeBadge({ type }: { type: string }) {
  return (
    <Badge variant="secondary" className="font-medium">
      {type}
    </Badge>
  )
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}
