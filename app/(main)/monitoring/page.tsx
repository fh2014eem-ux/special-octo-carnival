"use client"

import React, { useMemo, useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PROJECTS } from "@/lib/data/projects"

interface MonitoringRecord {
  id: number
  projectNo: string
  projectName: string
  dateFrom: string
  dateTo: string
  location: string
  officer: string
  objective: string
  result: string
  photoNames: string[]
  reportName: string
}

export default function FieldMonitoringPage() {
  const [monitorings, setMonitorings] = useState<MonitoringRecord[]>([
    {
      id: 1,
      projectNo: "800-13413",
      projectName: "مشروع تحسين سبل العيش",
      dateFrom: "2026-10-15",
      dateTo: "2026-10-15",
      location: "تعز - ماوية",
      officer: "أحمد المظفري",
      objective: "متابعة سير تنفيذ أنشطة المشروع",
      result: "التنفيذ يسير وفق الجدول الزمني المعتمد.",
      photoNames: [],
      reportName: "",
    },
  ])

  const [projectSearch, setProjectSearch] = useState("")
  const [selectedProject, setSelectedProject] = useState<(typeof PROJECTS)[number] | null>(null)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [location, setLocation] = useState("")
  const [officer, setOfficer] = useState("")
  const [objective, setObjective] = useState("")
  const [result, setResult] = useState("")
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [reportFile, setReportFile] = useState<File | null>(null)

  const filteredProjects = useMemo(() => {
    const query = projectSearch.trim().toLocaleLowerCase()
    if (!query) return []
    return PROJECTS.filter((project) =>
      String(project.number).toLocaleLowerCase().includes(query) ||
      project.name.toLocaleLowerCase().includes(query) ||
      project.arabic.toLocaleLowerCase().includes(query),
    ).slice(0, 10)
  }, [projectSearch])

  const handleSelectProject = (project: (typeof PROJECTS)[number]) => {
    setSelectedProject(project)
    setProjectSearch(`${project.number} — ${project.name}`)
    toast.success("تم استجلاب بيانات المشروع من قاعدة بيانات المشاريع.")
  }

  const handleAdd = () => {
    if (!selectedProject) {
      toast.error("يرجى البحث عن المشروع واختياره من قاعدة البيانات.")
      return
    }
    if (!dateFrom || !dateTo || dateTo < dateFrom) {
      toast.error("يرجى تحديد تاريخ بداية الزيارة ونهايتها بصورة صحيحة.")
      return
    }
    if (!officer.trim() || !objective.trim() || !result.trim()) {
      toast.error("يرجى إدخال منفذ/فريق المتابعة وهدف الزيارة ونتائج المتابعة.")
      return
    }

    setMonitorings((current) => [
      ...current,
      {
        id: Date.now(),
        projectNo: selectedProject.number,
        projectName: selectedProject.name,
        dateFrom,
        dateTo,
        location,
        officer,
        objective,
        result,
        photoNames: photoFiles.map((file) => file.name),
        reportName: reportFile?.name ?? "",
      },
    ])

    setProjectSearch("")
    setSelectedProject(null)
    setDateFrom("")
    setDateTo("")
    setLocation("")
    setOfficer("")
    setObjective("")
    setResult("")
    setPhotoFiles([])
    setReportFile(null)
    toast.success("تمت إضافة بيانات تقرير المتابعة إلى السجل المعروض.")
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 dir-rtl text-right font-sans">
      <div className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-gray-900">📍 المحور السادس: المتابعة الميدانية والرقابة</h1>
          <p className="text-xs text-gray-500 mt-0.5">توثيق زيارات ومتابعات المشاريع الميدانية، وتسجيل أهداف الزيارة ونتائجها ومرفقاتها.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-gray-50 py-3 border-b">
          <CardTitle className="text-sm font-bold">تسجيل تقرير متابعة ميدانية جديد</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-xs">
          <div className="space-y-2 rounded-xl border bg-slate-50 p-4">
            <label className="block font-semibold mb-1">البحث عن المشروع برقم المشروع أو اسمه *</label>
            <Input
              value={projectSearch}
              onChange={(e) => {
                setProjectSearch(e.target.value)
                setSelectedProject(null)
              }}
              placeholder="أدخل رقم المشروع أو جزءاً من اسمه..."
              className="bg-white"
            />
            {projectSearch && !selectedProject && (
              <div className="max-h-48 overflow-y-auto rounded-lg border bg-white p-2 space-y-1">
                {filteredProjects.length ? filteredProjects.map((project) => (
                  <button
                    type="button"
                    key={project.id}
                    onClick={() => handleSelectProject(project)}
                    className="w-full rounded-md p-2 text-right hover:bg-blue-50"
                  >
                    <span className="font-bold text-blue-900">{project.number}</span>
                    <span className="mx-2 text-slate-400">—</span>
                    <span>{project.name}</span>
                  </button>
                )) : <p className="p-2 text-slate-500">لا توجد نتائج مطابقة في قاعدة بيانات المشاريع.</p>}
              </div>
            )}
            {selectedProject && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
                <div><strong>رقم المشروع:</strong> {selectedProject.number}</div>
                <div><strong>اسم المشروع:</strong> {selectedProject.name}</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">تاريخ بداية الزيارة *</label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div>
              <label className="block font-semibold mb-1">تاريخ انتهاء الزيارة *</label>
              <Input type="date" min={dateFrom || undefined} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <div>
              <label className="block font-semibold mb-1">منفذ المتابعة / فريق المتابعة *</label>
              <Input value={officer} onChange={(e) => setOfficer(e.target.value)} placeholder="اسم المنفذ أو أسماء فريق المتابعة" />
            </div>
            <div>
              <label className="block font-semibold mb-1">الموقع / العزلة</label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="موقع تنفيذ الزيارة" />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">الهدف من الزيارة *</label>
            <Textarea rows={2} value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="اكتب الهدف من الزيارة والمتابعة..." />
          </div>
          <div>
            <label className="block font-semibold mb-1">نتائج المتابعة والملاحظات *</label>
            <Textarea rows={3} value={result} onChange={(e) => setResult(e.target.value)} placeholder="اكتب نتائج المتابعة الميدانية والملاحظات الإدارية والفنية..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border bg-slate-50 p-3 space-y-2">
              <label className="block font-semibold">📷 إرفاق صور الزيارة</label>
              <Input type="file" accept="image/*" multiple onChange={(e) => setPhotoFiles(Array.from(e.target.files ?? []))} className="bg-white" />
              <p className="text-slate-500">{photoFiles.length ? `تم اختيار ${photoFiles.length} صورة` : "يمكن اختيار أكثر من صورة."}</p>
            </div>
            <div className="rounded-lg border bg-slate-50 p-3 space-y-2">
              <label className="block font-semibold">📎 إرفاق تقرير الزيارة</label>
              <Input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(e) => setReportFile(e.target.files?.[0] ?? null)} className="bg-white" />
              <p className="text-slate-500">{reportFile ? reportFile.name : "PDF أو Word أو Excel"}</p>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={handleAdd}>حفظ تقرير المتابعة الميدانية</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gray-50 py-3 border-b">
          <CardTitle className="text-sm font-bold">سجل تقارير المتابعة الميدانية المسجلة</CardTitle>
        </CardHeader>
        <CardContent className="p-4 overflow-x-auto text-xs">
          <table className="w-full border-collapse border bg-white">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2 border">#</th>
                <th className="p-2 border">رقم المشروع</th>
                <th className="p-2 border">اسم المشروع</th>
                <th className="p-2 border">فترة الزيارة</th>
                <th className="p-2 border">منفذ / فريق المتابعة</th>
                <th className="p-2 border">هدف الزيارة</th>
                <th className="p-2 border">النتائج والملاحظات</th>
                <th className="p-2 border">المرفقات المختارة</th>
              </tr>
            </thead>
            <tbody>
              {monitorings.map((m, idx) => (
                <tr key={m.id} className="border-b align-top">
                  <td className="p-2 border text-center">{idx + 1}</td>
                  <td className="p-2 border font-mono">{m.projectNo}</td>
                  <td className="p-2 border font-bold text-blue-700">{m.projectName}</td>
                  <td className="p-2 border whitespace-nowrap">{m.dateFrom} إلى {m.dateTo}</td>
                  <td className="p-2 border">{m.officer}</td>
                  <td className="p-2 border">{m.objective}</td>
                  <td className="p-2 border">{m.result}</td>
                  <td className="p-2 border">
                    {[...m.photoNames, ...(m.reportName ? [m.reportName] : [])].length
                      ? [...m.photoNames, ...(m.reportName ? [m.reportName] : [])].join("، ")
                      : "لا توجد مرفقات"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
        تنبيه تقني: عناصر الصور والتقرير تُختار وتُعرض أسماؤها في السجل الحالي؛ لم يتم بعد ربط رفع الملفات بتخزين مركزي دائم، كما أن سجل هذه الصفحة محلي داخل الجلسة.
      </p>
    </div>
  )
}
