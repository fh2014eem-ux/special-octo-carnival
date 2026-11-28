"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ReportsAndSyncPage() {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  const reportQuery = () => {
    const params = new URLSearchParams()
    params.set("format", "word")
    if (from) params.set("from", from)
    if (to) params.set("to", to)
    return params
  }

  const handleExportExcel = (type: string) => {
    toast.success(`جاري استخراج وتنزيل تقارير ${type} بصيغة Excel...`)
    window.location.href = `/api/export-excel?type=${encodeURIComponent(type)}`
  }

  const handleExportDoc = () => {
    const params = reportQuery()
    toast.info("جاري إعداد تقرير Word من البيانات المسجلة...")
    window.location.href = `/api/export-report?${params.toString()}`
  }

  const handleExportPdf = () => {
    if (from && to && from > to) {
      toast.error("تاريخ البداية يجب أن يسبق تاريخ النهاية.")
      return
    }
    const params = reportQuery()
    params.set("format", "pdf")
    toast.info("سيُفتح التقرير للطباعة؛ اختر «حفظ بتنسيق PDF» من نافذة الطباعة.")
    window.open(`/api/export-report?${params.toString()}`, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 dir-rtl text-right font-sans">
      <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center border-l-4 border-l-blue-900">
        <div>
          <h1 className="text-xl font-black text-slate-900">الإحصائيات والتقارير والتصدير</h1>
          <p className="text-xs text-slate-500 mt-1">تقارير دورية مستخرجة من السجلات الفعلية للنظام بحسب الفرع والفترة</p>
        </div>
      </div>

      <Card className="border bg-white shadow-sm">
        <CardHeader className="bg-slate-50 border-b py-3">
          <CardTitle className="text-sm font-bold text-slate-900">فترة التقرير</CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <label className="space-y-2">
            <span className="font-semibold text-slate-700">من تاريخ</span>
            <input type="date" value={from} onChange={event => setFrom(event.target.value)} className="w-full rounded-md border border-slate-300 p-2" />
          </label>
          <label className="space-y-2">
            <span className="font-semibold text-slate-700">إلى تاريخ</span>
            <input type="date" value={to} onChange={event => setTo(event.target.value)} className="w-full rounded-md border border-slate-300 p-2" />
          </label>
          <p className="md:col-span-2 text-xs text-slate-500">عند ترك التاريخين فارغين، يُنشأ التقرير عن الربع الحالي حتى اليوم. يقتصر التقرير تلقائياً على فرع المستخدم، ويعرض المدير الفروع التي يصرح له بها.</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border bg-white shadow-sm">
          <CardHeader className="bg-slate-50 border-b py-3">
            <CardTitle className="text-sm font-bold text-slate-900">📊 تنزيل مخرجات وبيانات Excel</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <Button onClick={() => handleExportExcel("operations")} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 flex justify-between">
              <span>📊 تنزيل شيت العمليات الشامل</span><span>Excel 💾</span>
            </Button>
            <Button onClick={() => handleExportExcel("awareness")} className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 flex justify-between">
              <span>📢 تنزيل تقارير وبيانات التوعية الميدانية</span><span>Excel 💾</span>
            </Button>
            <Button onClick={() => handleExportExcel("boxes")} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 flex justify-between">
              <span>📦 تنزيل مخرجات صناديق الشكاوى والمحاضر</span><span>Excel 💾</span>
            </Button>
            <p className="text-amber-700">ملاحظة: يجري استكمال ربط صادرات Excel بمصدر البيانات الموحد؛ لا تعتمد النسخ الحالية ككشوف نهائية قبل استكمال ذلك.</p>
          </CardContent>
        </Card>

        <Card className="border bg-white shadow-sm">
          <CardHeader className="bg-slate-50 border-b py-3">
            <CardTitle className="text-sm font-bold text-slate-900">📄 تقرير الإنجاز المؤسسي</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <p className="text-slate-600">يتضمن الترويسة الرسمية، الملخص التنفيذي، التوعية الميدانية، حركة الصناديق ومحاضر الفتح، وإحصائيات العمليات والجداول والتوقيعات.</p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button onClick={handleExportDoc} className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5">
                📝 تنزيل ملف Word
              </Button>
              <Button onClick={handleExportPdf} className="bg-red-700 hover:bg-red-800 text-white font-bold py-2.5">
                📕 طباعة / حفظ PDF
              </Button>
            </div>
            <p className="text-slate-500">للحصول على PDF: ستفتح نسخة منسقة للطباعة؛ اختر «حفظ بتنسيق PDF» من نافذة الطباعة. ملف Word الحالي بصيغة DOC المتوافقة مع Word، وليس DOCX أصلياً.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
