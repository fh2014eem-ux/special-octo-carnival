"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExcelUploader({ onDataUpdated }: { onDataUpdated?: (data: any) => void }) {
  const [loading, setLoading] = useState(false)
  const [selectedFileType, setSelectedFileType] = useState<"projects" | "locations" | "categories">("projects")

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    toast.info(`جاري قراءة ومعالجة ملف الأكسل (${file.name})...`)

    try {
      // إرسال الملف إلى API المعالجة الداخلية
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", selectedFileType)

      const response = await fetch("/api/upload-excel", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success(`تم تحديث قاعدة بيانات ${selectedFileType === "projects" ? "المشاريع" : selectedFileType === "locations" ? "المواقع" : "التصنيفات"} بنجاح! (${result.count} سجل)`)
        if (onDataUpdated) onDataUpdated(result.data)
      } else {
        toast.error(result.message || "حدث خطأ أثناء قراءة ملف الأكسل.")
      }
    } catch (error) {
      console.error(error)
      toast.error("فشل الاتصال بخدمة رفع الملفات.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border border-blue-200 bg-blue-50/30 shadow-sm mb-6">
      <CardHeader className="py-3 bg-blue-100/50 border-b border-blue-200">
        <CardTitle className="text-sm font-bold text-blue-950 flex items-center gap-2">
          📊 تحديث قاعدة بيانات النظام عبر رفع ملف الأكسل (Excel Upload)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3 text-xs">
        <p className="text-slate-600">
          يمكنك تحديث بيانات المشاريع (الـ 508 مشاريع)، المواقع، أو التصنيفات فورياً عن طريق اختيار نوع الملف ورفعه هنا:
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select
            value={selectedFileType}
            onChange={(e) => setSelectedFileType(e.target.value as any)}
            className="p-2 border rounded-lg bg-white font-bold text-blue-900 text-xs w-full sm:w-48"
          >
            <option value="projects">📂 ملف المشاريع (Projects)</option>
            <option value="locations">📍 ملف المواقع (Locations)</option>
            <option value="categories">🏷️ ملف التصنيفات (Categories)</option>
          </select>

          <div className="relative w-full sm:w-auto">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              disabled={loading}
              id="excel-input"
              className="hidden"
            />
            <label htmlFor="excel-input">
              <Button
                asChild
                disabled={loading}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer px-5"
              >
                <span>{loading ? "جاري التحديث..." : "📁 اختيار ملف الأكسل ورفعه"}</span>
              </Button>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}