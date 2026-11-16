import { Card } from '@/components/ui/card'
import { summary } from '@/lib/mock-data'
import { Clock, ThumbsUp, CheckCircle2, Percent } from 'lucide-react'

const resolutionRate = Math.round((summary.resolved / summary.total) * 100)

const kpis = [
  {
    label: 'متوسط زمن الحل',
    value: `${summary.avgResolutionDays.toLocaleString('ar-EG')} يوم`,
    icon: Clock,
    tint: 'bg-chart-1/12 text-chart-1',
  },
  {
    label: 'نسبة الحل',
    value: `${resolutionRate.toLocaleString('ar-EG')}%`,
    icon: CheckCircle2,
    tint: 'bg-chart-2/12 text-chart-2',
  },
  {
    label: 'رضا المستفيدين',
    value: `${summary.satisfaction.toLocaleString('ar-EG')}%`,
    icon: ThumbsUp,
    tint: 'bg-chart-4/12 text-chart-4',
  },
  {
    label: 'نسبة إعادة الفتح',
    value: `${(4).toLocaleString('ar-EG')}%`,
    icon: Percent,
    tint: 'bg-chart-3/12 text-chart-3',
  },
]

export function ReportKpis() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <Card key={kpi.label} className="flex items-center gap-4 p-5">
            <div className={`flex size-11 items-center justify-center rounded-xl ${kpi.tint}`}>
              <Icon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">{kpi.value}</p>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
