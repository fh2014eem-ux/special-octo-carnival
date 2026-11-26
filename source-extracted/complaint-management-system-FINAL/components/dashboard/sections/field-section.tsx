"use client"

import { useState } from "react"
import { Plus, Users, Megaphone, PackageCheck, MapPin } from "lucide-react"
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
import { StatCard } from "@/components/dashboard/stat-card"
import { fieldActivities } from "@/lib/mock-data"

function NewActivityDialog() {
  const [open, setOpen] = useState(false)
  const [hasBox, setHasBox] = useState("no")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setOpen(false)
    toast.success("تم توثيق النشاط الميداني", {
      description: "تم تسجيل أعداد المستفيدين والملصقات الموزعة.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus data-icon="inline-start" />
        توثيق نشاط ميداني
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>توثيق نشاط توعية ميداني</DialogTitle>
            <DialogDescription>
              سجّل تفاصيل النشاط الأساسي أو المتكرر مع أعداد المستفيدين.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="projectId">رقم المشروع</FieldLabel>
                <Input id="projectId" required placeholder="PRJ-000" />
              </Field>
              <Field>
                <FieldLabel>نوع النشاط</FieldLabel>
                <Select defaultValue="BASIC">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BASIC">نشاط أساسي (توعية شاملة)</SelectItem>
                    <SelectItem value="RECURRING">نشاط متكرر</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="executor">المنفذ / المنسق</FieldLabel>
                <Input id="executor" required placeholder="اسم المنسق" />
              </Field>
              <Field>
                <FieldLabel htmlFor="location">الموقع</FieldLabel>
                <Input id="location" required placeholder="المحافظة - المديرية" />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="males">عدد الذكور</FieldLabel>
                <Input id="males" type="number" min={0} defaultValue={0} />
              </Field>
              <Field>
                <FieldLabel htmlFor="females">عدد الإناث</FieldLabel>
                <Input id="females" type="number" min={0} defaultValue={0} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="posters">الملصقات المستخدمة</FieldLabel>
                <Input id="posters" type="number" min={0} defaultValue={0} />
              </Field>
              <Field>
                <FieldLabel htmlFor="brochures">البروشورات الموزعة</FieldLabel>
                <Input id="brochures" type="number" min={0} defaultValue={0} />
              </Field>
            </div>

            <Field>
              <FieldLabel>هل تم تعليق صندوق شكاوى؟</FieldLabel>
              <Select
                value={hasBox}
                onValueChange={(v: string | null) => setHasBox(v ?? "no")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">نعم، تم التعليق</SelectItem>
                  <SelectItem value="no">لا</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {hasBox === "yes" ? (
              <Field>
                <FieldLabel htmlFor="boxNumber">رقم الصندوق المعلّق</FieldLabel>
                <Input id="boxNumber" placeholder="BOX-000" />
              </Field>
            ) : (
              <Field>
                <FieldLabel htmlFor="boxReason">سبب عدم التعليق</FieldLabel>
                <Input id="boxReason" placeholder="اذكر السبب" />
              </Field>
            )}

            <Field>
              <FieldLabel htmlFor="desc">ملاحظات النشاط</FieldLabel>
              <Textarea id="desc" rows={3} placeholder="وصف موجز للنشاط..." />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              إلغاء
            </DialogClose>
            <Button type="submit">حفظ النشاط</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function FieldSection() {
  const totalBeneficiaries = fieldActivities.reduce(
    (s, a) => s + a.malesCount + a.femalesCount,
    0,
  )
  const totalPosters = fieldActivities.reduce((s, a) => s + a.postersCount, 0)
  const totalBrochures = fieldActivities.reduce(
    (s, a) => s + a.brochuresCount,
    0,
  )
  const boxesInstalled = fieldActivities.filter((a) => a.hasBoxInstalled).length

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="إجمالي المستفيدين"
          value={totalBeneficiaries}
          icon={Users}
          accent="primary"
        />
        <StatCard
          title="الملصقات المستخدمة"
          value={totalPosters}
          icon={Megaphone}
          accent="warning"
        />
        <StatCard
          title="البروشورات الموزعة"
          value={totalBrochures}
          icon={Megaphone}
          accent="success"
        />
        <StatCard
          title="صناديق تم تعليقها"
          value={boxesInstalled}
          icon={PackageCheck}
          accent="primary"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <CardTitle>الأنشطة الميدانية والتوعوية</CardTitle>
              <CardDescription>
                توثيق الأنشطة الأساسية والمتكررة وأعداد المستفيدين وتعليق الصناديق
              </CardDescription>
            </div>
            <NewActivityDialog />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المشروع</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>المنفذ</TableHead>
                <TableHead>الموقع</TableHead>
                <TableHead>ذكور</TableHead>
                <TableHead>إناث</TableHead>
                <TableHead>ملصقات</TableHead>
                <TableHead>بروشورات</TableHead>
                <TableHead>الصندوق</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fieldActivities.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-mono text-xs">
                    {a.projectId}
                  </TableCell>
                  <TableCell>
                    <Badge variant={a.activityType === "BASIC" ? "default" : "secondary"}>
                      {a.activityType === "BASIC" ? "أساسي" : "متكرر"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{a.executor}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {a.location}
                    </span>
                  </TableCell>
                  <TableCell className="tabular-nums">{a.malesCount}</TableCell>
                  <TableCell className="tabular-nums">{a.femalesCount}</TableCell>
                  <TableCell className="tabular-nums">{a.postersCount}</TableCell>
                  <TableCell className="tabular-nums">{a.brochuresCount}</TableCell>
                  <TableCell>
                    {a.hasBoxInstalled ? (
                      <Badge variant="outline">{a.boxNumber}</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        لم يُعلّق
                      </span>
                    )}
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
