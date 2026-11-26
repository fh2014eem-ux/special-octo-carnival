"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useStore } from "@/lib/store"
import { StatusBadge, TypeBadge } from "@/components/shared"
import { ProcessingPanel } from "@/components/operations/processing-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDateTime } from "@/lib/format"
import { ArrowRight } from "lucide-react"

export default function OperationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { operations } = useStore()
  const op = operations.find((o) => o.id === id)

  if (!op) return notFound()

  const location = [op.province, op.directorate, op.isolation, op.village].filter(Boolean).join(" / ")

  return (
    <div className="mx-auto max-w-7xl space-y-6 dir-rtl text-right">
      {/* شريط رأس الشاشة البسيط بدون تكرار بيانات */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg font-bold text-blue-700">{op.operationNo}</span>
          <StatusBadge status={op.status} />
          <TypeBadge type={op.type} />
        </div>
        <Button asChild variant="outline" size="sm" className="gap-1">
          <Link href="/operations">
            <ArrowRight className="size-4" />
            عودة لسجل العمليات
          </Link>
        </Button>
      </div>

      {/* تفاصيل تسجيل العملية بشكل عرضي مدمج */}
      <Card className="border-border/60">
        <CardHeader className="bg-gray-50/50 py-3 border-b">
          <CardTitle className="text-sm font-bold text-gray-800">بيانات التسجيل الأساسية (المرحلة الأولى)</CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
          <div><span className="text-gray-400 block mb-0.5">مقدّم الطلب:</span><strong className="text-gray-800">{op.name || "—"}</strong></div>
          <div><span className="text-gray-400 block mb-0.5">رقم الهاتف:</span><strong className="text-gray-800 font-mono">{op.phone || "—"}</strong></div>
          <div><span className="text-gray-400 block mb-0.5">الصفة:</span><strong className="text-gray-800">{op.capacity || "—"}</strong></div>
          <div><span className="text-gray-400 block mb-0.5">الجهة المشتكى عليها:</span><strong className="text-gray-800">{op.against || "—"}</strong></div>
          <div><span className="text-gray-400 block mb-0.5">قناة الاستقبال:</span><strong className="text-blue-600 font-bold">{op.channel || "—"}</strong></div>
          <div><span className="text-gray-400 block mb-0.5">الموقع:</span><strong className="text-gray-800">{location || "—"}</strong></div>
          <div><span className="text-gray-400 block mb-0.5">المشروع:</span><strong className="text-gray-800">{op.projectName || "—"}</strong></div>
          <div><span className="text-gray-400 block mb-0.5">تاريخ التسجيل:</span><strong className="text-gray-800 font-mono">{formatDateTime(op.createdAt)}</strong></div>
          <div className="md:col-span-3 lg:col-span-4 bg-gray-50 p-2.5 rounded-lg border border-gray-100 mt-1">
            <span className="text-gray-400 block mb-0.5 font-bold">موضوع ووصف الشكوى/البلاغ:</span>
            <p className="text-gray-700 font-medium">{op.subject} — {op.description}</p>
          </div>
          {op.additionalData && <div className="md:col-span-3 lg:col-span-4 bg-amber-50 p-2.5 rounded-lg border border-amber-100"><span className="text-amber-800 block mb-0.5 font-bold">بيانات إضافية:</span><p className="text-gray-700">{op.additionalData}</p></div>}
          {op.attachmentRecords?.length ? <div className="md:col-span-3 lg:col-span-4 p-2.5 rounded-lg border"><span className="block mb-2 font-bold">المرفقات:</span><div className="flex flex-wrap gap-3">{op.attachmentRecords.map(file => <a key={file.id} className="text-blue-700 underline" href={`/api/operations/attachments/${file.id}`} target="_blank" rel="noreferrer">{file.fileName}</a>)}</div></div> : null}
        </CardContent>
      </Card>

      {/* لوحة المعالجة والتصنيف والإغلاق */}
      <ProcessingPanel op={op} />
    </div>
  )
}