import { cn } from "@/lib/utils"
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  type ComplaintPriority,
  type ComplaintStatus,
} from "@/lib/types"

const statusStyles: Record<ComplaintStatus, string> = {
  NEW: "bg-chart-1/15 text-chart-1 ring-chart-1/30",
  IN_PROGRESS: "bg-chart-2/15 text-chart-2 ring-chart-2/30",
  RESOLVED: "bg-chart-3/15 text-chart-3 ring-chart-3/30",
  REJECTED: "bg-chart-4/15 text-chart-4 ring-chart-4/30",
  CLOSED: "bg-muted text-muted-foreground ring-border",
}

const priorityStyles: Partial<Record<ComplaintPriority, string>> = {
  URGENT: "bg-chart-4/15 text-chart-4 ring-chart-4/30",
  HIGH: "bg-chart-2/15 text-chart-2 ring-chart-2/30",
  MEDIUM: "bg-chart-1/15 text-chart-1 ring-chart-1/30",
  LOW: "bg-muted text-muted-foreground ring-border",
}

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        statusStyles[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: ComplaintPriority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        priorityStyles[priority],
      )}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  )
}
