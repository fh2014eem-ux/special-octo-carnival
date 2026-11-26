"use client"

import { useMemo, useState } from "react"
import { Plus, CheckCircle2, CircleAlert } from "lucide-react"
import { toast } from "sonner"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { complaintBoxes, openingMinutes } from "@/lib/mock-data"
import { boxStatusLabels, type BoxStatus } from "@/lib/types"

const boxStatusVariant: Partial<Record<BoxStatus, "default" | "secondary" | "outline">> =
  {
    ACTIVE: "default",
    REMOVED: "outline",
    MAINTENANCE: "secondary",
  }

function NewMinuteDialog() {
  const [open, setOpen] = useState(false)
  const [counts, setCounts] = useState({
    complaints: 0,
    reports: 0,
    requests: 0,
    proposals: 0,
    rejected: 0,
  })
  const [declaredTotal, setDeclaredTotal] = useState(0)

  const computedTotal = useMemo(
    () =>
      counts.complaints +
      counts.reports +
      counts.requests +
      counts.proposals +
      counts.rejected,
    [counts],
  )

  const isMatched = computedTotal === declaredTotal
  const num = (v: string) => Math.max(0, Number.parseInt(v || "0", 10) || 0)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isMatched) {
      toast.error("عدم تطابق الإجمالي", {
        description: "يجب أن يساوي الإجمالي المسجّل مجموع الأنواع قبل الحفظ.",
      })
      return
    }
    setOpen(false)
    toast.success("تم إنشاء محضر الفتح", {
      description: `تم التحقق من تطابق الإجمالي (${computedTotal} عملية).`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus data-icon="inline-start" />
        إنشاء محضر فتح
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>إنشاء محضر فتح صندوق</DialogTitle>
            <DialogDescription>
              أدخل توزيع العمليات، وسيتم التحقق تلقائياً من مطابقة الإجمالي.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="minuteNumber">رقم المحضر</FieldLabel>
                <Input id="minuteNumber" required placeholder="MIN-2026-000" />
              </Field>
              <Field>
                <FieldLabel>الصندوق</FieldLabel>
                <Select defaultValue={complaintBoxes[0]?.boxNumber}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {complaintBoxes.map((b) => (
                      <SelectItem key={b.id} value={b.boxNumber}>
                        {b.boxNumber} — {b.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="c-complaints">شكاوى</FieldLabel>
                <Input
                  id="c-complaints"
                  type="number"
                  min={0}
                  value={counts.complaints}
                  onChange={(e) =>
                    setCounts((p) => ({ ...p, complaints: num(e.target.value) }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="c-reports">بلاغات</FieldLabel>
                <Input
                  id="c-reports"
                  type="number"
                  min={0}
                  value={counts.reports}
                  onChange={(e) =>
                    setCounts((p) => ({ ...p, reports: num(e.target.value) }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="c-requests">طلبات</FieldLabel>
                <Input
                  id="c-requests"
                  type="number"
                  min={0}
                  value={counts.requests}
                  onChange={(e) =>
                    setCounts((p) => ({ ...p, requests: num(e.target.value) }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="c-proposals">مقترحات</FieldLabel>
                <Input
                  id="c-proposals"
                  type="number"
                  min={0}
                  value={counts.proposals}
                  onChange={(e) =>
                    setCounts((p) => ({ ...p, proposals: num(e.target.value) }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="c-rejected">مرفوضة</FieldLabel>
                <Input
                  id="c-rejected"
                  type="number"
                  min={0}
                  value={counts.rejected}
                  onChange={(e) =>
                    setCounts((p) => ({ ...p, rejected: num(e.target.value) }))
                  }
                />
              </Field>
              <Field data-invalid={!isMatched}>
                <FieldLabel htmlFor="c-total">الإجمالي المسجّل</FieldLabel>
                <Input
                  id="c-total"
                  type="number"
                  min={0}
                  aria-invalid={!isMatched}
                  value={declaredTotal}
                  onChange={(e) => setDeclaredTotal(num(e.target.value))}
                />
              </Field>
            </div>

            <Alert variant={isMatched ? "default" : "destructive"}>
              {isMatched ? <CheckCircle2 /> : <CircleAlert />}
              <AlertTitle>
                {isMatched
                  ? "الإجمالي مطابق"
                  : "الإجمالي غير مطابق"}
              </AlertTitle>
              <AlertDescription>
                مجموع الأنواع = {computedTotal} • الإجمالي المسجّل ={" "}
                {declaredTotal}
                {isMatched
                  ? " — يمكن حفظ المحضر."
                  : " — عدّل القيم حتى تتطابق."}
              </AlertDescription>
            </Alert>

            <Field>
              <FieldLabel htmlFor="notes">ملاحظات لجنة الفتح</FieldLabel>
              <Textarea id="notes" rows={2} placeholder="ملاحظات..." />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              إلغاء
            </DialogClose>
            <Button type="submit" disabled={!isMatched}>
              حفظ المحضر
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function BoxesSection() {
  return (
    <Tabs defaultValue="boxes" className="gap-4">
      <TabsList>
        <TabsTrigger value="boxes">صناديق الشكاوى</TabsTrigger>
        <TabsTrigger value="minutes">محاضر الفتح</TabsTrigger>
      </TabsList>

      <TabsContent value="boxes">
        <Card>
          <CardHeader>
            <CardTitle>الصناديق الميدانية</CardTitle>
            <CardDescription>
              مواقع الصناديق المعلّقة وحالتها وعدد محاضر الفتح المرتبطة بها
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الصندوق</TableHead>
                  <TableHead>المشروع</TableHead>
                  <TableHead>الموقع</TableHead>
                  <TableHead>تاريخ التركيب</TableHead>
                  <TableHead>المحاضر</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaintBoxes.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-xs">
                      {b.boxNumber}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {b.projectId}
                    </TableCell>
                    <TableCell className="font-medium">{b.location}</TableCell>
                    <TableCell className="text-muted-foreground tabular-nums">
                      {b.installDate}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {b.minutesCount}
                    </TableCell>
                    <TableCell>
                      <Badge variant={boxStatusVariant[b.status] ?? "outline"}>
                        {boxStatusLabels[b.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="minutes">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle>محاضر فتح الصناديق</CardTitle>
                <CardDescription>
                  توثيق عمليات الفتح مع التحقق من مطابقة إجمالي العمليات
                </CardDescription>
              </div>
              <NewMinuteDialog />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم المحضر</TableHead>
                  <TableHead>الصندوق</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>شكاوى</TableHead>
                  <TableHead>بلاغات</TableHead>
                  <TableHead>طلبات</TableHead>
                  <TableHead>مقترحات</TableHead>
                  <TableHead>مرفوضة</TableHead>
                  <TableHead>الإجمالي</TableHead>
                  <TableHead>التحقق</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openingMinutes.map((m) => {
                  const sum =
                    m.complaintsCount +
                    m.reportsCount +
                    m.requestsCount +
                    m.proposalsCount +
                    m.rejectedCount
                  const matched = sum === m.totalOperations
                  return (
                    <TableRow key={m.id}>
                      <TableCell className="font-mono text-xs">
                        {m.minuteNumber}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {m.boxNumber}
                      </TableCell>
                      <TableCell className="text-muted-foreground tabular-nums">
                        {m.openDate}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {m.complaintsCount}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {m.reportsCount}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {m.requestsCount}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {m.proposalsCount}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {m.rejectedCount}
                      </TableCell>
                      <TableCell className="font-semibold tabular-nums">
                        {m.totalOperations}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "flex items-center gap-1 text-xs font-medium",
                            matched
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-destructive",
                          )}
                        >
                          {matched ? (
                            <CheckCircle2 className="size-4" />
                          ) : (
                            <CircleAlert className="size-4" />
                          )}
                          {matched ? "مطابق" : "غير مطابق"}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
