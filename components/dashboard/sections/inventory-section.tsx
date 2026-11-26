"use client"

import { useState } from "react"
import { Plus, TriangleAlert, ArrowDownRight, ArrowUpRight } from "lucide-react"
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
import { Progress } from "@/components/ui/progress"
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
import { cn } from "@/lib/utils"
import { inventoryItems, inventoryMovements } from "@/lib/mock-data"
import { inventoryTypeLabels } from "@/lib/types"

function NewMovementDialog() {
  const [open, setOpen] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setOpen(false)
    toast.success("تم تسجيل حركة المخزون", {
      description: "تم تحديث الكمية المتبقية للصنف تلقائياً.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus data-icon="inline-start" />
        تسجيل حركة
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>تسجيل حركة مخزون</DialogTitle>
            <DialogDescription>
              أضف حركة وارد أو صادر لأحد أصناف المخزون.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-2">
            <Field>
              <FieldLabel>الصنف</FieldLabel>
              <Select defaultValue={inventoryItems[0]?.itemType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {inventoryItems.map((i) => (
                    <SelectItem key={i.id} value={i.itemType}>
                      {i.itemName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>نوع الحركة</FieldLabel>
                <Select defaultValue="OUT">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">وارد (إضافة للمخزن)</SelectItem>
                    <SelectItem value="OUT">صادر (صرف)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="qty">الكمية</FieldLabel>
                <Input id="qty" type="number" min={1} required defaultValue={1} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="ref">المرجع</FieldLabel>
              <Input id="ref" placeholder="نشاط ميداني / أمر توريد" />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              إلغاء
            </DialogClose>
            <Button type="submit">حفظ الحركة</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function InventorySection() {
  const lowStock = inventoryItems.filter(
    (i) => i.remainingQuantity <= i.minAlertLimit,
  )

  return (
    <div className="flex flex-col gap-6">
      {lowStock.length > 0 ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>تنبيه انخفاض المخزون</AlertTitle>
          <AlertDescription>
            {lowStock.length} من الأصناف وصلت إلى حد التنبيه:{" "}
            {lowStock.map((i) => i.itemName).join("، ")}. يُنصح بإعادة التوريد.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {inventoryItems.map((item) => {
          const isLow = item.remainingQuantity <= item.minAlertLimit
          const pct = Math.min(
            100,
            Math.round((item.remainingQuantity / item.totalSupplied) * 100),
          )
          return (
            <Card key={item.id}>
              <CardHeader className="gap-1">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm font-medium">
                    {item.itemName}
                  </CardTitle>
                  <Badge variant={isLow ? "destructive" : "secondary"}>
                    {inventoryTypeLabels[item.itemType]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold tabular-nums">
                    {item.remainingQuantity}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    من {item.totalSupplied}
                  </span>
                </div>
                <Progress
                  value={pct}
                  className={cn(isLow && "[&>[data-slot=progress-indicator]]:bg-destructive")}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>حد التنبيه: {item.minAlertLimit}</span>
                  <span className={cn(isLow && "font-medium text-destructive")}>
                    {isLow ? "منخفض" : "متوفر"}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <CardTitle>حركة المخزون</CardTitle>
              <CardDescription>
                سجل الوارد والصادر للملصقات والبروشورات والصناديق ودفاتر المحاضر
              </CardDescription>
            </div>
            <NewMovementDialog />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الصنف</TableHead>
                <TableHead>نوع الحركة</TableHead>
                <TableHead>الكمية</TableHead>
                <TableHead>المرجع</TableHead>
                <TableHead>ملاحظات</TableHead>
                <TableHead>التاريخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryMovements.map((mv) => (
                <TableRow key={mv.id}>
                  <TableCell className="font-medium">{mv.itemName}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "flex items-center gap-1 text-xs font-medium",
                        mv.movementType === "IN"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400",
                      )}
                    >
                      {mv.movementType === "IN" ? (
                        <ArrowUpRight className="size-4" />
                      ) : (
                        <ArrowDownRight className="size-4" />
                      )}
                      {mv.movementType === "IN" ? "وارد" : "صادر"}
                    </span>
                  </TableCell>
                  <TableCell className="tabular-nums">{mv.quantity}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {mv.reference ?? "—"}
                  </TableCell>
                  <TableCell className="max-w-48 truncate text-muted-foreground">
                    {mv.note ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {mv.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
