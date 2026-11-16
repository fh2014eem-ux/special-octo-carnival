import { cn } from '@/lib/utils'

type ComplaintStatus = 'new' | 'in_progress' | 'resolved' | 'closed'
type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent'

const statusLabels: Record<ComplaintStatus, string> = { new: 'جديدة', in_progress: 'قيد المعالجة', resolved: 'تم الحل', closed: 'مغلقة' }
const priorityLabels: Record<ComplaintPriority, string> = { low: 'منخفضة', medium: 'متوسطة', high: 'عالية', urgent: 'عاجلة' }
const statusStyles: Record<ComplaintStatus, string> = {
  new: 'bg-chart-1/15 text-chart-1 ring-chart-1/25', in_progress: 'bg-chart-3/15 text-chart-3 ring-chart-3/30',
  resolved: 'bg-chart-2/15 text-chart-2 ring-chart-2/30', closed: 'bg-muted text-muted-foreground ring-border',
}
const priorityStyles: Record<ComplaintPriority, string> = {
  low: 'bg-muted text-muted-foreground ring-border', medium: 'bg-chart-1/15 text-chart-1 ring-chart-1/25',
  high: 'bg-chart-3/15 text-chart-3 ring-chart-3/30', urgent: 'bg-destructive/15 text-destructive ring-destructive/30',
}

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset', statusStyles[status])}>{statusLabels[status]}</span>
}
export function PriorityBadge({ priority }: { priority: ComplaintPriority }) {
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset', priorityStyles[priority])}><span className="size-1.5 rounded-full bg-current" />{priorityLabels[priority]}</span>
}
