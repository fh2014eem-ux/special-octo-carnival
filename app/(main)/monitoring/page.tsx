"use client"

import React, { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type ProjectOption = {
  projectNumber: string
  projectName: string
  branch?: string | null
}

type MonitoringAttachment = {
  id: string
  fileName: string
  mimeType: string
  fileSize: number
}

type MonitoringRecord = {
  id: string
  projectNumber: string
  projectName: string
  visitStartDate: string
  visitEndDate: string
  location: string | null
  team: string
  goal: string
  result: string
  branch: string
  createdAt: string
  attachments: MonitoringAttachment[]
}

export default function FieldMonitoringPage() {
  const [monitorings, setMonitorings] = useState<MonitoringRecord[]>([])
  const [projects, setProjects] = useState<ProjectOption[]>([])
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const [projectsResponse, visitsResponse] = await Promise.all([
          fetch("/api/reference/projects", { cache: "no-store" }),
          fetch("/api/monitoring", { cache: "no-store" }),
        ])
        const projectsBody = await projectsResponse.json()
        const visitsBody = await visitsResponse.json()
        if (!projectsResponse.ok) throw new Error(projectsBody.error || "تعذر تحميل المشاريع المرجعية")
        if (!visitsResponse.ok) throw new Error(visitsBody.error || "تعذر تحميل سجل المتابعة")
        if (cancelled) return
        setProjects(Array.isArray(projectsBody.projects) ? projectsBody.projects : [])
        setMonitorings(Array.isArray(visitsBody.visits) ? visitsBody.visits : [])
      } catch (error) {
        if (!cancelled) toast.error(error instanceof Error ? error.message : "تعذر تحميل بيانات المتابعة")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [])

  const filteredProjects = useMemo(() => projects.filter((project) => {
    const number = project.projectNumber.toLowerCase()
    const name = project.projectName.toLowerCase()
    const byNumber = !projectNo || number.includes(projectNo.trim().toLowerCase())
    const byName = !projectName || name.includes(projectName.trim().toLowerCase())
    return byNumber && byName
  }).slice(0, 10), [projects, projectNo, projectName])

  const chooseProject = (project: ProjectOption) => {
    setProjectNo(project.projectNumber)
    setProjectName(project.projectName)
  }

  const resetForm = () => {
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
  }

  const handleAdd = async () => {
    if (!projectNo || !projectName || !visitStartDate || !visitEndDate || !team.trim() || !goal.trim() || !result.trim()) {
      toast.error("يرجى استكمال المشروع وفترة الزيارة وفريق المتابعة والهدف والنتائج.")
      return
    }
    if (visitEndDate < visitStartDate) {
      toast.error("تاريخ انتهاء الزيارة يجب ألا يسبق تاريخ بدايتها.")
      return
    }
    if (imageFiles.length > 10) {
      toast.error("الحد الأقصى 10 صور للزيارة.")
      return
    }

    const form = new FormData()
    form.set("projectNumber", projectNo)
    form.set("projectName", projectName)
    form.set("visitStartDate", visitStartDate)
    form.set("visitEndDate", visitEndDate)
    form.set("location", location)
    form.set("team", team)
    form.set("goal", goal)
    form.set("result", result)
    imageFiles.forEach((file) => form.append("images", file))
    if (reportFile) form.set("report", reportFile)

    setSaving(true)
    try {
      const response = await fetch("/api/monitoring", { method: "POST", body: form })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || "تعذر حفظ الزيارة")
      setMonitorings((current) => [body.visit as MonitoringRecord, ...current])
      resetForm()
      toast.success("تم حفظ زيارة المتابعة ومرفقاتها في قاعدة البيانات بنجاح.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر حفظ الزيارة")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 dir-rtl text-right font-sans">
      <div className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-gray-900">📍 المحور السادس: المتابعة الميدانية والرقابة</h1>
          <p className="text-xs text-gray-500 mt-0.5">تسجيل الزيارات وربطها بالمشاريع وحفظ التقارير والصور مركزياً</p>
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
            <div className="max-h-48 overflow-y-auto rounded-lg border bg-white p-2 space-y-1">
              {filteredProjects.map((project) => (
                <button type="button" key={project.projectNumber} onClick={() => chooseProject(project)} className="w-full rounded p-2 text-right hover:bg-blue-50 flex justify-between gap-3">
                  <span className="font-mono font-bold text-blue-900">{project.projectNumber}</span>
                  <span className="truncate">{project.projectName}</span>
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
            <Button onClick={handleAdd} disabled={saving || loading}>{saving ? "جارٍ الحفظ..." : "حفظ الزيارة والمرفقات"}</Button>
          </div>
          <p className="text-[10px] text-slate-500">يُحفظ السجل ضمن فرع المستخدم. الحد الأقصى 10 صور (8 ميجابايت للصورة) وتقرير واحد (12 ميجابايت).</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gray-50 py-3 border-b">
          <CardTitle className="text-sm font-bold">سجل زيارات المتابعة الميدانية المحفوظة</CardTitle>
        </CardHeader>
        <CardContent className="p-4 overflow-x-auto text-xs">
          <table className="w-full border-collapse border bg-white">
            <thead><tr className="bg-gray-100 border-b">
              <th className="p-2 border">#</th><th className="p-2 border">رقم المشروع</th><th className="p-2 border">اسم المشروع</th>
              <th className="p-2 border">فترة الزيارة</th><th className="p-2 border">فريق المتابعة</th><th className="p-2 border">الهدف</th>
              <th className="p-2 border">النتائج</th><th className="p-2 border">المرفقات</th>
            </tr></thead>
            <tbody>
              {monitorings.map((visit, index) => (
                <tr key={visit.id} className="border-b align-top">
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border font-mono">{visit.projectNumber}</td>
                  <td className="p-2 border min-w-48">{visit.projectName}</td>
                  <td className="p-2 border whitespace-nowrap">{visit.visitStartDate.slice(0, 10)} إلى {visit.visitEndDate.slice(0, 10)}</td>
                  <td className="p-2 border">{visit.team}</td>
                  <td className="p-2 border min-w-36">{visit.goal}</td>
                  <td className="p-2 border min-w-48">{visit.result}</td>
                  <td className="p-2 border min-w-32">
                    {visit.attachments.length ? visit.attachments.map((attachment) => (
                      <a key={attachment.id} className="block text-blue-700 underline mb-1" href={`/api/monitoring/${visit.id}/attachments/${attachment.id}`} target="_blank" rel="noreferrer">
                        {attachment.fileName}
                      </a>
                    )) : "—"}
                  </td>
                </tr>
              ))}
              {!loading && monitorings.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-slate-500">لا توجد زيارات محفوظة لهذا النطاق حتى الآن.</td></tr>}
              {loading && <tr><td colSpan={8} className="p-6 text-center text-slate-500">جارٍ تحميل سجل الزيارات...</td></tr>}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
