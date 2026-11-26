"use client"

import React, { useMemo, useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ALL_PROJECTS_DATABASE } from "@/lib/appData"

type MonitoringRecord = {
  id: number
  projectNumber: string
  projectName: string
  visitStartDate: string
  visitEndDate: string
  location: string
  team: string
  goal: string
  result: string
  images: string[]
  report: string
}

export default function FieldMonitoringPage() {
  const [monitorings, setMonitorings] = useState<MonitoringRecord[]>([])
  const [projectNo, setProjectNo] = useState("")
  const [projectName, setProjectName] = useState("")
  const [visitStartDate, setVisitStartDate] = useState("")
  const [visitEndDate, setVisitEndDate] = useState("")
  const [location, setLocation] = useState("")
  const [team, setTeam] = useState("")
  const [goal, setGoal] = useState("")
  const [result, setResult] = useState("")
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [reportFile, setReportFile] = useState<File | null>(null)

  const filteredProjects = useMemo(() => ALL_PROJECTS_DATABASE.filter((p) => {
    const byNumber = !projectNo || p.id.toLowerCase().includes(projectNo.toLowerCase())
    const byName = !projectName || p.name.toLowerCase().includes(projectName.toLowerCase())
    return byNumber && byName
  }).slice(0, 8), [projectNo, projectName])

  const chooseProject = (p: typeof ALL_PROJECTS_DATABASE[number]) => {
    setProjectNo(p.id)
    setProjectName(p.name)
  }

  const handleAdd = () => {
    if (!projectNo || !projectName || !visitStartDate || !visitEndDate || !team.trim() || !goal.trim() || !result.trim()) {
      toast.error("يرجى استكمال المشروع وفترة الزيارة وفريق المتابعة والهدف والنتائج.")
      return
    }
    if (visitEndDate < visitStartDate) {
      toast.error("تاريخ انتهاء الزيارة يجب ألا يسبق تاريخ بدايتها.")
      return
    }
    const newRecord: MonitoringRecord = {
      id: Date.now(), projectNumber: projectNo, projectName, visitStartDate, visitEndDate,
      location, team, goal, result,
      images: imageFiles.map((file) => file.name),
      report: reportFile?.name ?? "",
    }
    setMonitorings((current) => [newRecord, ...current])
    setProjectNo("")
    setProjectName("")
    setVisitStartDate("")
    setVisitEndDate("")
    setLocation("")
    setTeam("")
    setGoal("")
    setResult("")
    setImageFiles([])
    setReportFile(null)
    toast.success("تمت إضافة بيانات الزيارة إلى قائمة الصفحة.")
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 dir-rtl text-right font-sans">
      <div className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-gray-900">📍 المحور السادس: المتابعة الميدانية والرقابة</h1>
          <p className="text-xs text-gray-500 mt-0.5">توثيق الزيارات الميدانية وفترة التنفيذ والهدف وفريق المتابعة والمرفقات</p>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-gray-50 py-3 border-b">
          <CardTitle className="text-sm font-bold">تسجيل زيارة متابعة ميدانية جديدة</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">رقم المشروع *</label>
              <Input value={projectNo} onChange={(e) => setProjectNo(e.target.value)} placeholder="ابحث برقم المشروع" />
            </div>
            <div>
              <label className="block font-semibold mb-1">اسم المشروع *</label>
              <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="ابحث باسم المشروع" />
            </div>
          </div>
          {(projectNo || projectName) && filteredProjects.length > 0 && (
            <div className="max-h-40 overflow-y-auto rounded-lg border bg-white p-2 space-y-1">
              {filteredProjects.map((p) => (
                <button type="button" key={p.id} onClick={() => chooseProject(p)} className="w-full rounded p-2 text-right hover:bg-blue-50 flex justify-between gap-3">
                  <span className="font-mono font-bold text-blue-900">{p.id}</span>
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
            </div>
          )}
          <div className="rounded-lg border bg-blue-50/50 p-3 text-blue-950">
            المشروع المحدد: <strong>{projectNo || "—"}</strong> — {projectName || "لم يتم اختيار مشروع"}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold mb-1">تاريخ بداية الزيارة *</label>
              <Input type="date" value={visitStartDate} onChange={(e) => setVisitStartDate(e.target.value)} />
            </div>
            <div>
              <label className="block font-semibold mb-1">تاريخ انتهاء الزيارة *</label>
              <Input type="date" min={visitStartDate || undefined} value={visitEndDate} onChange={(e) => setVisitEndDate(e.target.value)} />
            </div>
            <div>
              <label className="block font-semibold mb-1">منفذ المتابعة / فريق المتابعة *</label>
              <Input value={team} onChange={(e) => setTeam(e.target.value)} placeholder="أسماء الفريق أو الجهة المنفذة" />
            </div>
            <div>
              <label className="block font-semibold mb-1">الموقع / العزلة</label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="الموقع" />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">الهدف من الزيارة *</label>
            <Textarea rows={2} value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="حدد الهدف من الزيارة والمتابعة..." />
          </div>
          <div>
            <label className="block font-semibold mb-1">نتائج المتابعة والملاحظات والتقرير *</label>
            <Textarea rows={3} value={result} onChange={(e) => setResult(e.target.value)} placeholder="اكتب نتائج المتابعة والملاحظات الإدارية والفنية..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border bg-slate-50 p-3 space-y-2">
              <label className="block font-semibold">📷 إرفاق صور الزيارة</label>
              <Input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))} className="bg-white" />
              <p className="text-[10px] text-slate-500">{imageFiles.length ? imageFiles.map((file) => file.name).join("، ") : "لم يتم اختيار صور"}</p>
            </div>
            <div className="rounded-lg border bg-slate-50 p-3 space-y-2">
              <label className="block font-semibold">📄 إرفاق تقرير المتابعة</label>
              <Input type="file" accept=".pdf,.doc,.docx,.xlsx,.xls" onChange={(e) => setReportFile(e.target.files?.[0] ?? null)} className="bg-white" />
              <p className="text-[10px] text-slate-500">{reportFile?.name ?? "لم يتم اختيار تقرير"}</p>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={handleAdd}>إضافة الزيارة إلى السجل</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gray-50 py-3 border-b">
          <CardTitle className="text-sm font-bold">سجل زيارات المتابعة الميدانية في الجلسة الحالية</CardTitle>
        </CardHeader>
        <CardContent className="p-4 overflow-x-auto text-xs">
          <table className="w-full border-collapse border bg-white">
            <thead><tr className="bg-gray-100 border-b">
              <th className="p-2 border">#</th><th className="p-2 border">رقم المشروع</th><th className="p-2 border">اسم المشروع</th>
              <th className="p-2 border">فترة الزيارة</th><th className="p-2 border">فريق المتابعة</th><th className="p-2 border">الهدف</th>
              <th className="p-2 border">النتائج</th><th className="p-2 border">المرفقات</th>
            </tr></thead>
            <tbody>
              {monitorings.map((m, idx) => <tr key={m.id} className="border-b">
                <td className="p-2 border text-center">{idx + 1}</td><td className="p-2 border font-mono">{m.projectNumber}</td>
                <td className="p-2 border">{m.projectName}</td><td className="p-2 border">{m.visitStartDate} إلى {m.visitEndDate}</td>
                <td className="p-2 border">{m.team}</td><td className="p-2 border">{m.goal}</td><td className="p-2 border">{m.result}</td>
                <td className="p-2 border">{[...m.images, m.report].filter(Boolean).join("، ") || "—"}</td>
              </tr>)}
              {monitorings.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-slate-500">لا توجد زيارات مضافة في هذه الجلسة.</td></tr>}
            </tbody>
          </table>
          <p className="mt-3 text-[10px] text-amber-700">تنبيه فني: هذه الواجهة تجمع بيانات النموذج في ذاكرة الصفحة فقط حالياً؛ لم يُفعّل بعد الحفظ الدائم للزيارة أو رفع الملفات إلى التخزين المركزي.</p>
        </CardContent>
      </Card>
    </div>
  )
}
