import Link from "next/link"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { StatusBadge, PriorityBadge } from "@/components/status-badges"
import { complaints } from "@/lib/mock-data"

import { ArrowLeft } from "lucide-react"

export function RecentComplaints() {
  const recent = complaints.slice(0, 6)

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>أحدث الشكاوى</CardTitle>

        <Button
          render={
            <Link href="/complaints" />
          }
          variant="ghost"
          size="sm"
          className="text-primary"
        >
          عرض الكل
          <ArrowLeft className="size-4" />
        </Button>
      </CardHeader>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">المرجع</TableHead>
              <TableHead className="text-right">الموضوع</TableHead>
              <TableHead className="text-right">التصنيف</TableHead>
              <TableHead className="text-right">الأولوية</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {recent.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {c.id}
                </TableCell>

                <TableCell className="max-w-[220px]">
                  <p className="truncate font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.citizen}
                  </p>
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {c.category}
                </TableCell>

                <TableCell>
                  <PriorityBadge
                    priority={
                      c.priority === "CRITICAL"
                        ? "urgent"
                        : (c.priority.toLowerCase() as
                            | "low"
                            | "medium"
                            | "high"
                            | "urgent")
                    }
                  />
                </TableCell>

                <TableCell>
                  <StatusBadge
                    status={
                      c.status.toLowerCase() as
                        | "new"
                        | "in_progress"
                        | "resolved"
                        | "closed"
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}