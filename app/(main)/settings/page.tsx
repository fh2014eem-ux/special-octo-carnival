"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Counts = Record<string, { source: number; valid: number; duplicates: number; rejected: number }>
type Preview = { success: boolean; message?: string; counts?: Counts; sample?: Record<string, Record<string, string>[]> }

export default function SettingsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  async function send(mode: "preview" | "commit") {
    if (!file) { toast.error("يرجى اختيار ملف Excel أولاً."); return }
    setBusy(true)
    try {
      const body = new FormData()
      body.set("file", file)
      body.set("mode", mode)
      if (mode === "commit") body.set("confirm", "YES")
      const response = await fetch("/api/admin/reference-import", { method: "POST", body, credentials: "same-origin" })
      const result = await response.json() as Preview
      if (!response.ok || !result.success) throw new Error(result.message || "تعذر تنفيذ العملية.")
      if (mode === "preview") {
        setPreview(result)
        setDone(false)
        toast.success("اكتمل فحص الملف. راجع الأعداد قبل الاعتماد.")
      } else {
        setDone(true)
        toast.success(result.message || "تم تحديث البيانات المرجعية.")
        setPreview(result)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "حدث خطأ غير متوقع.")
    } finally { setBusy(false) }
  }

  const labels: Record<string, string> = { projects: "المشاريع", locations: "المواقع", categories: "التصنيفات" }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 dir-rtl text-right font-sans">
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h1 className="text-xl font-black text-slate-900">إعدادات النظام وتحديث قواعد البيانات</h1>
        <p className="text-xs text-slate-500 mt-2">رفع ملف Excel الموحد الذي يحتوي أوراق المواقع والمشاريع والتصنيفات، مع فحص مسبق قبل حفظ البيانات في Neon.</p>
      </div>

      <Card className="bg-white border">
        <CardHeader className="bg-slate-50 border-b py-3">
          <CardTitle className="text-sm font-bold">📥 استيراد البيانات المرجعية من Excel</CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4 text-sm">
          <div className="rounded-lg bg-blue-50 text-blue-900 p-3 text-xs leading-6">
            يجب أن يحتوي الملف على ثلاث أوراق بأسمائها: <b>المواقع</b> و<b>المشاريع</b> و<b>التصنيفات</b>. يتم استبدال مجموعة البيانات النشطة بما في الملف. تُحفظ السجلات السابقة غير الموجودة كسجلات غير نشطة، ولا تُحذف نهائياً.
          </div>
          <input type="file" accept=".xlsx" onChange={(e) => { setFile(e.target.files?.[0] || null); setPreview(null); setDone(false) }} className="w-full text-xs border rounded-lg p-3 bg-white" />
          {file && <p className="text-xs text-slate-600">الملف المحدد: <b>{file.name}</b> — {(file.size / 1024).toFixed(0)} كيلوبايت</p>}
          <div className="flex flex-wrap gap-2">
            <Button disabled={busy || !file} onClick={() => send("preview")} className="bg-blue-900 text-white font-bold">
              {busy ? "جارٍ المعالجة..." : "فحص الملف ومعاينة البيانات"}
            </Button>
            <Button disabled={busy || !preview?.success || done} onClick={() => send("commit")} className="bg-emerald-700 text-white font-bold">
              اعتماد الحفظ في Neon
            </Button>
          </div>
          {preview?.counts && (
            <div className="space-y-3 pt-3 border-t">
              <h3 className="font-bold">{done ? "نتيجة الاستيراد" : "نتيجة الفحص — لم يتم الحفظ بعد"}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead><tr className="bg-slate-100"><th className="p-2 border">البيانات</th><th className="p-2 border">المصدر</th><th className="p-2 border">صالحة</th><th className="p-2 border">مكررة</th><th className="p-2 border">مرفوضة</th></tr></thead>
                  <tbody>
                    {Object.entries(preview.counts).map(([key, value]) => <tr key={key}>
                      <td className="p-2 border font-bold">{labels[key] || key}</td>
                      <td className="p-2 border text-center">{value.source}</td>
                      <td className="p-2 border text-center">{value.valid}</td>
                      <td className="p-2 border text-center">{value.duplicates}</td>
                      <td className="p-2 border text-center">{value.rejected}</td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
              {done && <p className="text-emerald-700 font-bold text-xs">تم حفظ الدفعة في Neon وتسجيل عملية الاستيراد.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
