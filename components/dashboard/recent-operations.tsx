"use client"

import Link from "next/link"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { StatusBadge, TypeBadge } from "@/components/shared"
import { formatDateShort } from "@/lib/format"
import type { Operation } from "@/lib/types"

import { ArrowLeft } from "lucide-react"

export function RecentOperations({ ops }: { ops: Operation[] }) {
  const recent = ops.slice(0, 6)

  return (
    <Card className="border-border/60">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">
          أحدث العمليات
        </CardTitle>

        <Button
          render={<Link href="/operations" />}
          variant="ghost"
          size="sm"
          className="gap-1 text-primary"
        >
          عرض الكل
          <ArrowLeft className="size-4" />
        </Button>
      </CardHeader>

      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">
                  رقم العملية
                </TableHead>

                <TableHead className="text-right">
                  النوع
                </TableHead>

                <TableHead className="text-right">
                  مقدّم الطلب
                </TableHead>

                <TableHead className="text-right">
                  الموضوع
                </TableHead>

                <TableHead className="text-right">
                  الحالة
                </TableHead>

                <TableHead className="text-right">
                  التاريخ
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {recent.map((op) => (
                <TableRow key={op.id}>
                  <TableCell className="font-mono text-xs font-medium">
                    {op.operationNo}
                  </TableCell>

                  <TableCell>
                    <TypeBadge type={op.type} />
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {op.name}
                  </TableCell>

                  <TableCell className="max-w-[220px] truncate text-muted-foreground">
                    {op.subject}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={op.status} />
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatDateShort(op.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}