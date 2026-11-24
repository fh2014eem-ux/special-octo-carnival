"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Counts = { source: number; valid: number; duplicates: number; rejected: number }
type Preview = { success: boolean; message?: string; dataset?: string; counts?: Counts; sample?: Record<string, string>[] }

export default function SettingsPage() {
  const [dataset, setDataset] = useState<"locations" | "projects">("locations")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  async function send(mode: "preview" | "commit") {
    if (!file) { toast.error("يرجى اختيار ملف Excel أو CSV أولاً."); return }
    setBusy(true)
    try {
      const body = new FormData()
      body.set("file", file)
      body.set("dataset", dataset)
      body.set("mode", mode)
      if (mode === "commit") body.set("confirm", "YES")
      const response = await fetch("/api/admin/reference-import/separate", { method: "POST", body, credentials: "same-origin" })
      const result = await response.json() as Preview
      if (!response.ok || !result.success) throw new Error(result.message || "تعذر تنفيذ العملية.")
      if (mode === "preview") {
        setPreview(result); setDone(false)
        toast.success("اكتمل فحص الملف. راجع الأعداد قبل الاعتماد.")
      } else {
        setDone(true); setPreview(result)
        toast.success(result.message || "تم تحديث البيانات المرجعية.")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "حدث خطأ غير متوقع.")
    } finally { setBusy(false) }
  }

  const label = dataset === "locations" ? "المواقع" : "المشاريع"
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 dir-rtl text-right font-sans">
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h1 className="text-xl font-black text-slate-900">إعدادات النظام وتحديث قواعد البيانات</h1>
        <p className="text-xs text-slate-500 mt-2">تحديث مستقل لملف المواقع أو ملف المشاريع. لا تتأثر التصنيفات أو مجموعة البيانات الأخرى عند الاستيراد.</p>
      </div>
      <Card className="bg-white border">
        <CardHeader className="bg-slate-50 border-b py-3">
          <CardTitle className="text-sm font-bold">📥 استيراد البيانات المرجعية من Excel أو CSV</CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button type="button" onClick={() => { setDataset("locations"); setFile(null); setPreview(null); setDone(false) }} className={`rounded-lg border p-3 font-bold ${dataset === "locations" ? "border-blue-800 bg-blue-50 text-blue-900" : "bg-white"}`}>ملف المواقع</button>
            <button type="button" onClick={() => { setDataset("projects"); setFile(null); setPreview(null); setDone(false) }} className={`rounded-lg border p-3 font-bold ${dataset === "projects" ? "border-blue-800 bg-blue-50 text-blue-900" : "bg-white"}`}>ملف المشاريع</button>
          </div>
          <div className="rounded-lg bg-amber-50 text-amber-900 p-3 text-xs leading-6">
            اختر نوع الملف أولاً ثم ارفع ملف Excel أو CSV المطابق فقط. تتم معاينة السجلات قبل الحفظ. عند الاعتماد يتم تحديث المجموعة المحددة وحدها، مع إبقاء المجموعة الأخرى والتصنيفات دون تغيير. السجلات غير الموجودة في الملف تصبح غير نشطة ولا تُحذف نهائياً.
          </div>
          <input key={dataset} type="file" accept=".xlsx,.csv" onChange={(e) => { setFile(e.target.files?.[0] || null); setPreview(null); setDone(false) }} className="w-full text-xs border rounded-lg p-3 bg-white" />
          {file && <p className="text-xs text-slate-600">الملف المحدد: <b>{file.name}</b> — {(file.size / 1024).toFixed(0)} كيلوبايت</p>}
          <div className="flex flex-wrap gap-2">
            <Button disabled={busy || !file} onClick={() => send("preview")} className="bg-blue-900 text-white font-bold">{busy ? "جارٍ المعالجة..." : "فحص الملف ومعاينة البيانات"}</Button>
            <Button disabled={busy || !preview?.success || done} onClick={() => send("commit")} className="bg-emerald-700 text-white font-bold">اعتماد تحديث {label} في Neon</Button>
          </div>
          {preview?.counts && (
            <div className="space-y-3 pt-3 border-t">
              <h3 className="font-bold">{done ? "نتيجة الاستيراد" : "نتيجة الفحص — لم يتم الحفظ بعد"}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead><tr className="bg-slate-100"><th className="p-2 border">المجموعة</th><th className="p-2 border">المصدر</th><th className="p-2 border">صالحة</th><th className="p-2 border">مكررة</th><th className="p-2 border">مرفوضة</th></tr></thead>
                  <tbody><tr><td className="p-2 border font-bold">{label}</td><td className="p-2 border text-center">{preview.counts.source}</td><td className="p-2 border text-center">{preview.counts.valid}</td><td className="p-2 border text-center">{preview.counts.duplicates}</td><td className="p-2 border text-center">{preview.counts.rejected}</td></tr></tbody>
                </table>
              </div>
              {preview.sample && <div className="max-h-48 overflow-auto rounded border p-2 text-xs"><pre className="whitespace-pre-wrap">{JSON.stringify(preview.sample.slice(0, 3), null, 2)}</pre></div>}
              {done && <p className="text-emerald-700 font-bold text-xs">تم تحديث {label} وتسجيل عملية الاستيراد.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
