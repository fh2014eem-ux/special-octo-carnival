import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  accent = "primary",
}: {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  trend?: number
  trendLabel?: string
  accent?: "primary" | "success" | "warning" | "danger"
}) {
  const accentClass = {
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    danger: "bg-destructive/10 text-destructive",
  }[accent]

  const isUp = (trend ?? 0) >= 0

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-lg",
            accentClass,
          )}
        >
          <Icon className="size-5" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <span className="text-2xl font-bold tabular-nums">{value}</span>
        {trend !== undefined ? (
          <div className="flex items-center gap-1 text-xs">
            <span
              className={cn(
                "flex items-center gap-0.5 font-medium",
                isUp ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
              )}
            >
              {isUp ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownRight className="size-3.5" />
              )}
              {Math.abs(trend)}%
            </span>
            {trendLabel ? (
              <span className="text-muted-foreground">{trendLabel}</span>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
