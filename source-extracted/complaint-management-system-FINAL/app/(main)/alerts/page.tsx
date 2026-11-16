"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import { BellRing, Clock3, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const CLOSED = new Set(["مغلقة", "مكتملة", "تم الحل"])
const SLA_DAYS = 14

export default function AlertsPage() {
  const { scopedOperations } = useStore()
  const alerts = useMemo(() => {
    const now = Date.now()
    return scopedOperations
      .filter((op) => !CLOSED.has(op.status))
      .map((op) => {
        const due = new Date(new Date(op.createdAt).getTime() + SLA_DAYS * 86400000)
        const remaining = Math.ceil((due.getTime() - now) / 86400000)
        return { ...op, due, remaining, level: remaining < 0 ? "متأخرة" : remaining <= 3 ? "قريبة الاستحقاق" : "ضمن المدة" }
      })
      .filter((op) => op.level !== "ضمن المدة")
      .sort((a, b) => a.remaining - b.remaining)
  }, [scopedOperations])

  const overdue = alerts.filter((a) => a.remaining < 0).length
  const dueSoon = alerts.length - overdue

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 text-right sm:p-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-5">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black"><BellRing className="size-5" /> إدارة التنبيهات والتأخير</h1>
          <p className="mt-1 text-sm text-muted-foreground">متابعة العمليات القريبة من موعد الاستحقاق والمتجاوزة للمدة.</p>
        </div>
        <Link href="/operations" className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 hover:bg-slate-100">عرض سجل العمليات</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">إجمالي التنبيهات</p><p className="mt-1 text-2xl font-black">{alerts.length}</p></div><BellRing className="size-8 text-slate-500" /></CardContent></Card>
        <Card><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">قريبة الاستحقاق</p><p className="mt-1 text-2xl font-black">{dueSoon}</p></div><Clock3 className="size-8 text-amber-600" /></CardContent></Card>
        <Card><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">متأخرة</p><p className="mt-1 text-2xl font-black">{overdue}</p></div><AlertTriangle className="size-8 text-red-600" /></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">قائمة التنبيهات النشطة</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          {alerts.length === 0 ? (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 className="size-5" /> لا توجد عمليات متأخرة أو قريبة من الاستحقاق وفق البيانات المتاحة.</div>
          ) : (
            <table className="w-full min-w-[720px] text-sm">
              <thead><tr className="border-b text-right text-muted-foreground"><th className="p-3">رقم العملية</th><th className="p-3">الموضوع</th><th className="p-3">الفرع</th><th className="p-3">تاريخ الاستحقاق</th><th className="p-3">الحالة</th><th className="p-3">المتبقي / التأخير</th></tr></thead>
              <tbody>{alerts.map((a) => <tr key={a.id} className="border-b last:border-0"><td className="p-3 font-semibold">{a.operationNo}</td><td className="p-3">{a.subject || a.type}</td><td className="p-3">{a.branch}</td><td className="p-3">{a.due.toLocaleDateString("ar-YE")}</td><td className="p-3">{a.status}</td><td className={`p-3 font-bold ${a.remaining < 0 ? "text-red-700" : "text-amber-700"}`}>{a.remaining < 0 ? `متأخرة ${Math.abs(a.remaining)} يوم` : `باقي ${a.remaining} يوم`}</td></tr>)}</tbody>
            </table>
          )}
        </CardContent>
      </Card>
      <p className="text-xs leading-6 text-muted-foreground">تنبيه تنفيذي: هذه الصفحة في هذه النسخة الأولية تحسب مهلة 14 يوماً من تاريخ تسجيل العملية على بيانات مخزن الواجهة. لا تُعد بعدُ نظام تنبيهات إنتاجياً مرتبطاً بقاعدة البيانات أو بمحاضر فتح الصناديق؛ يلزم ربطها بخدمة المواعيد وقاعدة البيانات وإعدادات التصعيد قبل التشغيل الرسمي.</p>
    </div>
  )
}
