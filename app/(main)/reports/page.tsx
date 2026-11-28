"use client"

import React from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ReportsAndSyncPage() {
  // تصدير واستخراج شيتات الأكسل والمستندات
  const handleExportExcel = (type: string) => {
    toast.success(`جاري استخراج وتنزيل تقارير ${type} بصيغة Excel...`)
    // استدعاء رابط التنزيل الداخلي
    window.location.href = `/api/export-excel?type=${type}`
  }

  const handleExportDoc = (format: "word" | "pdf") => {
    toast.info(`جاري توليد التقرير الربعي/الشهر بصيغة ${format.toUpperCase()}...`)
    window.location.href = `/api/export-report?format=${format}`
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 dir-rtl text-right font-sans">
      {/* الترويسة الرئيسية */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center border-l-4 border-l-blue-900">
        <div>
          <h1 className="text-xl font-black text-slate-900">الإحصائيات والتقارير والتصدير</h1>
          <p className="text-xs text-slate-500 mt-1">استعراض الإحصائيات ومخرجات التقارير التشغيلية</p>
        </div>
      </div>

      {/* قسم استخراج وتنزيل التقارير الأكسل والـ Word / PDF */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* أزرار تنزيل تقارير الأكسل */}
        <Card className="border bg-white shadow-sm">
          <CardHeader className="bg-slate-50 border-b py-3">
            <CardTitle className="text-sm font-bold text-slate-900">📊 تنزيل مخرجات وبيانات الأكسل الشاملة</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <Button 
              onClick={() => handleExportExcel("operations")} 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 flex justify-between"
            >
              <span>📊 تنزيل شيت العمليات الشامل (69 عموداً)</span>
              <span>Excel 💾</span>
            </Button>

            <Button 
              onClick={() => handleExportExcel("awareness")} 
              className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 flex justify-between"
            >
              <span>📢 تنزيل تقارير وبيانات التوعية الميدانية</span>
              <span>Excel 💾</span>
            </Button>

            <Button 
              onClick={() => handleExportExcel("boxes")} 
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 flex justify-between"
            >
              <span>📦 تنزيل مخرجات صناديق الشكاوى والمحاضر</span>
              <span>Excel 💾</span>
            </Button>
          </CardContent>
        </Card>

        {/* أزرار تصدير تقارير Word / PDF */}
        <Card className="border bg-white shadow-sm">
          <CardHeader className="bg-slate-50 border-b py-3">
            <CardTitle className="text-sm font-bold text-slate-900">📄 تصدير التقارير الشهرية والربعية</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <p className="text-slate-500">تصدير تقرير الإنجاز الربعي الشامل (مقدمة، الخطة، الجداول الإحصائية، والمصفوفات) بالهوية المعتمدة.</p>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button 
                onClick={() => handleExportDoc("word")} 
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5"
              >
                📝 تصدير ملف وورد (DOCX)
              </Button>

              <Button 
                onClick={() => handleExportDoc("pdf")} 
                className="bg-red-700 hover:bg-red-800 text-white font-bold py-2.5"
              >
                📕 تصدير ملف (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}