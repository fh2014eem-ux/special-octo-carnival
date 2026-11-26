"use client"

import { Clock, TriangleAlert, CheckCircle2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/dashboard/stat-card"
import { cn } from "@/lib/utils"
import { complaints } from "@/lib/mock-data"
import { priorityLabels, statusLabels } from "@/lib/types"

// التاريخ المرجعي الحالي للنظام
const TODAY = new Date("2026-09-16")

function daysLeft(due?: string) {
  if (!due) return null
  const d = new Date(due)
  return Math.round((d.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24))
}

export function SlaSection() {
  const open = complaints.filter(
    (c) => c.status === "NEW" || c.status === "IN_PROGRESS",
  )
  const overdue = open.filter((c) => (daysLeft(c.slaDueDate) ?? 1) < 0)
  const dueSoon = open.filter((c) => {
    const dl = daysLeft(c.slaDueDate)
    return dl !== null && dl >= 0 && dl <= 2
  })
  const onTrack = open.length - overdue.length - dueSoon.length

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="شكاوى متأخرة"
          value={overdue.length}
          icon={TriangleAlert}
          accent="danger"
        />
        <StatCard
          title="قرب انتهاء المهلة"
          value={dueSoon.length}
          icon={Clock}
          accent="warning"
        />
        <StatCard
          title="ضمن المهلة"
          value={Math.max(0, onTrack)}
          icon={CheckCircle2}
          accent="success"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>مراقبة اتفاقية مستوى الخدمة (SLA)</CardTitle>
          <CardDescription>
            متابعة المهل الزمنية للشكاوى المفتوحة والتنبيه عند التأخر
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الرقم المرجعي</TableHead>
                <TableHead>العنوان</TableHead>
                <TableHead>الأولوية</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الموعد النهائي</TableHead>
                <TableHead>المتبقي</TableHead>
                <TableHead>المؤشر</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {open.map((c) => {
                const dl = daysLeft(c.slaDueDate)
                const isOverdue = (dl ?? 1) < 0
                const isSoon = dl !== null && dl >= 0 && dl <= 2
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">
                      {c.referenceNo}
                    </TableCell>
                    <TableCell className="max-w-52 truncate font-medium">
                      {c.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {priorityLabels[c.priority]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {statusLabels[c.status]}
                    </TableCell>
                    <TableCell className="text-muted-foreground tabular-nums">
                      {c.slaDueDate ?? "—"}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "tabular-nums font-medium",
                        isOverdue && "text-destructive",
                        isSoon && "text-amber-600 dark:text-amber-400",
                      )}
                    >
                      {dl === null
                        ? "—"
                        : isOverdue
                          ? `متأخرة ${Math.abs(dl)} يوم`
                          : `${dl} يوم`}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          isOverdue
                            ? "destructive"
                            : isSoon
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {isOverdue
                          ? "متأخرة"
                          : isSoon
                            ? "قرب الانتهاء"
                            : "ضمن المهلة"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
