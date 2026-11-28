"use client"

import React, { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

type ProjectOption = { projectNumber: string; projectName: string; branch?: string | null }
type Attachment = { id: string; fileName: string; mimeType: string; fileSize: number }
type ComplaintBoxItem = {
  id: string; boxNumber: string; projectNumber: string; projectName: string
  installLocation: string; installDate: string; chosenBy: string; reasonForPlace: string
  boxCount: number; status: string; attachments: Attachment[]
}
type OpeningMinutesItem = {
  id: string; minuteNumber: string; boxNumber: string; projectNumber: string; projectName: string
  openingDate: string; minutesDate: string; deliveryDate: string; entryDate: string; expectedDate: string
  totalDocuments: number; totalOperations: number; acceptedAttachments: number; rejectedAttachments: number; rejectionReasons?: string | null
  complaintsCount: number; reportsCount: number; requestsCount: number; proposalsCount: number
  inquiriesCount: number; praisesCount: number; delayStatus: string; attachments: Attachment[]
}

function yemenToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Aden", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date())
}
function addDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}
function nextWednesday() {
  const today = yemenToday()
  const date = new Date(`${today}T00:00:00Z`)
  const days = (3 - date.getUTCDay() + 7) % 7 || 7
  return addDays(today, days)
}
function nextWeeklyDate(base: string) {
  let candidate = base || yemenToday()
  while (candidate <= yemenToday()) candidate = addDays(candidate, 7)
  return candidate
}

export default function ComplaintBoxesPage() {
  const [activeTab, setActiveTab] = useState<"boxes" | "minutes">("boxes")
  const [projects, setProjects] = useState<ProjectOption[]>([])
  const [registeredBoxes, setRegisteredBoxes] = useState<ComplaintBoxItem[]>([])
  const [registeredMinutes, setRegisteredMinutes] = useState<OpeningMinutesItem[]>([])
  const [loading, setLoading] = useState(true)
  const [savingBox, setSavingBox] = useState(false)
  const [savingMinute, setSavingMinute] = useState(false)

  const [searchProjectNo, setSearchProjectNo] = useState("")
  const [searchProjectName, setSearchProjectName] = useState("")
  const [selectedProject, setSelectedProject] = useState<ProjectOption | null>(null)
  const [boxNumber, setBoxNumber] = useState("")
  const [boxesCount, setBoxesCount] = useState(1)
  const [installDate, setInstallDate] = useState(yemenToday())
  const [boxLocation, setBoxLocation] = useState("")
  const [boxReason, setBoxReason] = useState("")
  const [boxChosenBy, setBoxChosenBy] = useState("")
  const [boxFiles, setBoxFiles] = useState<File[]>([])

  const [minutesProjectNo, setMinutesProjectNo] = useState("")
  const [minutesProjectName, setMinutesProjectName] = useState("")
  const [selectedBoxId, setSelectedBoxId] = useState("")
  const [selectedMinute, setSelectedMinute] = useState<OpeningMinutesItem | null>(null)
  const [lastSavedMinutesId, setLastSavedMinutesId] = useState("")
  const [minutesDate, setMinutesDate] = useState("")
  const [totalDocuments, setTotalDocuments] = useState(0)
  const [totalAccepted, setTotalAccepted] = useState(0)
  const [totalRejected, setTotalRejected] = useState(0)
  const [rejectionReason, setRejectionReason] = useState("")
  const [complaints, setComplaints] = useState(0)
  const [reports, setReports] = useState(0)
  const [requests, setRequests] = useState(0)
  const [suggestions, setSuggestions] = useState(0)
  const [inquiries, setInquiries] = useState(0)
  const [compliments, setCompliments] = useState(0)
  const [minutesFiles, setMinutesFiles] = useState<File[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const [projectResponse, boxResponse] = await Promise.all([
          fetch("/api/reference/projects", { cache: "no-store" }),
          fetch("/api/complaint-boxes", { cache: "no-store" }),
        ])
        const projectBody = await projectResponse.json()
        const boxBody = await boxResponse.json()
        if (!projectResponse.ok) throw new Error(projectBody.error || "تعذر تحميل المشاريع")
        if (!boxResponse.ok) throw new Error(boxBody.error || "تعذر تحميل الصناديق والمحاضر")
        if (cancelled) return
        setProjects(Array.isArray(projectBody.projects) ? projectBody.projects : [])
        setRegisteredBoxes(Array.isArray(boxBody.boxes) ? boxBody.boxes : [])
        setRegisteredMinutes(Array.isArray(boxBody.minutes) ? boxBody.minutes : [])
      } catch (error) {
        if (!cancelled) toast.error(error instanceof Error ? error.message : "تعذر تحميل بيانات الصناديق")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [])

  const filteredProjects = useMemo(() => projects.filter(project => {
    const byNumber = !searchProjectNo || project.projectNumber.toLowerCase().includes(searchProjectNo.trim().toLowerCase())
    const byName = !searchProjectName || project.projectName.toLowerCase().includes(searchProjectName.trim().toLowerCase())
    return byNumber && byName
  }).slice(0, 10), [projects, searchProjectNo, searchProjectName])

  const handleSelectProject = (project: ProjectOption) => {
    setSelectedProject(project)
    setSearchProjectNo(project.projectNumber)
    setSearchProjectName(project.projectName)
  }

  const filteredBoxesList = registeredBoxes.filter(box =>
    (!searchProjectNo || box.projectNumber.toLowerCase().includes(searchProjectNo.toLowerCase())) &&
    (!searchProjectName || box.projectName.toLowerCase().includes(searchProjectName.toLowerCase()))
  )
  const filteredBoxesForMinutes = registeredBoxes.filter(box =>
    (!minutesProjectNo || box.projectNumber.toLowerCase().includes(minutesProjectNo.toLowerCase())) &&
    (!minutesProjectName || box.projectName.toLowerCase().includes(minutesProjectName.toLowerCase()))
  )
  const filteredMinutesList = registeredMinutes.filter(minute =>
    (!minutesProjectNo || minute.projectNumber.toLowerCase().includes(minutesProjectNo.toLowerCase())) &&
    (!minutesProjectName || minute.projectName.toLowerCase().includes(minutesProjectName.toLowerCase()))
  )

  const selectedBoxObj = registeredBoxes.find(box => box.boxNumber === selectedBoxId) ?? null
  const latestMinute = registeredMinutes.find(minute => minute.boxNumber === selectedBoxId)
  const todayDate = yemenToday()
  const lastOpeningDate = latestMinute?.openingDate.slice(0, 10) ?? ""
  const lastMinuteDate = latestMinute?.minutesDate.slice(0, 10) ?? ""
  const expectedDate = lastOpeningDate ? nextWeeklyDate(lastOpeningDate) : nextWednesday()
  const deliveryDate = latestMinute ? nextWeeklyDate(latestMinute.deliveryDate.slice(0, 10)) : addDays(expectedDate, 1)
  const entryDate = todayDate
  const calculatedSum = complaints + reports + requests + suggestions + inquiries + compliments
  const isValidSum = calculatedSum === totalAccepted
  const isValidDocumentCount = totalAccepted + totalRejected === totalDocuments
  const delayDays = Math.round((new Date(`${todayDate}T00:00:00Z`).getTime() - new Date(`${expectedDate}T00:00:00Z`).getTime()) / 86400000)
  const delayStatus = delayDays <= 0 ? "🟢 ضمن المدة" : delayDays <= 3 ? "🟡 تأخير بسيط" : "🔴 متأخر"

  const resetMinuteForm = () => {
    setMinutesDate("")
    setTotalDocuments(0)
    setTotalAccepted(0)
    setTotalRejected(0)
    setRejectionReason("")
    setComplaints(0); setReports(0); setRequests(0); setSuggestions(0); setInquiries(0); setCompliments(0)
    setMinutesFiles([])
  }

  const handleSaveBox = async () => {
    if (!selectedProject || !boxNumber.trim() || !boxLocation.trim() || !installDate || !boxReason.trim() || !boxChosenBy.trim() || boxesCount < 1) {
      toast.error("يرجى اختيار المشروع واستكمال جميع بيانات الصندوق.")
      return
    }
    const form = new FormData()
    form.set("boxNumber", boxNumber.trim())
    form.set("projectNumber", selectedProject.projectNumber)
    form.set("projectName", selectedProject.projectName)
    form.set("installLocation", boxLocation)
    form.set("installDate", installDate)
    form.set("reasonForPlace", boxReason)
    form.set("chosenBy", boxChosenBy)
    form.set("boxCount", String(boxesCount))
    boxFiles.forEach(file => form.append("images", file))
    setSavingBox(true)
    try {
      const response = await fetch("/api/complaint-boxes", { method: "POST", body: form })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || "تعذر حفظ الصندوق")
      setRegisteredBoxes(current => [body.box as ComplaintBoxItem, ...current])
      setBoxNumber(""); setBoxLocation(""); setBoxReason(""); setBoxChosenBy(""); setBoxFiles([]); setSelectedProject(null)
      toast.success("تم حفظ الصندوق ومرفقاته في قاعدة البيانات.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر حفظ الصندوق")
    } finally {
      setSavingBox(false)
    }
  }

  const handleSaveMinutes = async () => {
    if (!selectedBoxObj) return toast.error("يرجى اختيار صندوق الشكاوى أولاً.")
    if (!minutesDate) return toast.error("يرجى إدخال تاريخ استلام المحضر.")
    if (!isValidDocumentCount) return toast.error("عدد الوثائق يجب أن يساوي المقبولة + المرفوضة.")
    if (!isValidSum) return toast.error("مجموع العمليات الموزعة يجب أن يساوي عدد الوثائق المقبولة.")
    if (!minutesFiles.length) return toast.error("إرفاق صورة أو PDF للمحضر إلزامي قبل الحفظ.")

    const form = new FormData()
    form.set("boxNumber", selectedBoxObj.boxNumber)
    form.set("projectNumber", selectedBoxObj.projectNumber)
    form.set("projectName", selectedBoxObj.projectName)
    form.set("minutesDate", minutesDate)
    form.set("totalDocuments", String(totalDocuments))
    form.set("accepted", String(totalAccepted))
    form.set("rejected", String(totalRejected))
    form.set("rejectionReasons", rejectionReason)
    form.set("complaints", String(complaints))
    form.set("reports", String(reports))
    form.set("requests", String(requests))
    form.set("proposals", String(suggestions))
    form.set("inquiries", String(inquiries))
    form.set("praises", String(compliments))
    minutesFiles.forEach(file => form.append("files", file))

    setSavingMinute(true)
    try {
      const response = await fetch("/api/complaint-boxes/minutes", { method: "POST", body: form })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || "تعذر حفظ المحضر")
      const minute = body.minute as OpeningMinutesItem
      setRegisteredMinutes(current => [minute, ...current])
      setSelectedMinute(minute)
      setLastSavedMinutesId(minute.minuteNumber)
      resetMinuteForm()
      toast.success(`تم حفظ المحضر ${minute.minuteNumber} مع مرفقاته.`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر حفظ المحضر")
    } finally {
      setSavingMinute(false)
    }
  }

  const getBoxAlerts = (box: ComplaintBoxItem) => {
    const latest = registeredMinutes.find(minute => minute.boxNumber === box.boxNumber)
    const openingDue = latest ? nextWeeklyDate(latest.openingDate.slice(0, 10)) : nextWednesday()
    const deliveryDue = latest ? nextWeeklyDate(latest.deliveryDate.slice(0, 10)) : addDays(openingDue, 1)
    return { openingDue, deliveryDue, openingLate: openingDue < todayDate, deliveryLate: deliveryDue < todayDate }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 dir-rtl text-right font-sans">
      <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-l-blue-900">
        <div>
          <h1 className="text-xl font-black text-slate-900">صناديق الشكاوى ومحاضر الفتح 📦</h1>
          <p className="text-xs text-slate-500 mt-1">تثبيت الصناديق الميدانية، تحرير محاضر الفتح، والتحقق الآلي والحفظ المركزي</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <Button variant={activeTab === "boxes" ? "default" : "outline"} onClick={() => setActiveTab("boxes")} className={activeTab === "boxes" ? "bg-blue-900 text-white" : ""}>📦 صناديق الشكاوى</Button>
          <Button variant={activeTab === "minutes" ? "default" : "outline"} onClick={() => setActiveTab("minutes")} className={activeTab === "minutes" ? "bg-blue-900 text-white" : ""}>📑 محاضر الفتح</Button>
        </div>
      </div>

      {activeTab === "boxes" && (
        <div className="space-y-6">
          <Card className="border bg-white shadow-sm">
            <CardHeader className="bg-slate-50 border-b py-3"><CardTitle className="text-sm font-bold text-slate-900">تسجيل صندوق شكاوى ميداني جديد</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
                <span className="font-bold text-blue-900">1. اختيار المشروع بالرقم أو الاسم:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className="block font-semibold mb-1">رقم المشروع</label><Input value={searchProjectNo} onChange={e => { setSearchProjectNo(e.target.value); setSelectedProject(null) }} placeholder="أدخل رقم المشروع" className="bg-white font-mono" /></div>
                  <div><label className="block font-semibold mb-1">اسم المشروع</label><Input value={searchProjectName} onChange={e => { setSearchProjectName(e.target.value); setSelectedProject(null) }} placeholder="ابحث باسم المشروع" className="bg-white" /></div>
                </div>
                {(searchProjectNo || searchProjectName) && filteredProjects.length > 0 && !selectedProject && (
                  <div className="max-h-40 overflow-y-auto border bg-white rounded-lg p-2 space-y-1">
                    {filteredProjects.map(project => <button type="button" key={project.projectNumber} onClick={() => handleSelectProject(project)} className="w-full p-2 hover:bg-blue-50 rounded flex justify-between items-center text-right gap-3"><span className="font-bold font-mono text-blue-900">{project.projectNumber}</span><span className="truncate">{project.projectName}</span></button>)}
                  </div>
                )}
              </div>
              {selectedProject && <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-xs text-blue-900">المشروع المحدد: <b>{selectedProject.projectNumber}</b> — <b>{selectedProject.projectName}</b></div>}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="block font-semibold mb-1">رقم الصندوق *</label><Input value={boxNumber} onChange={e => setBoxNumber(e.target.value)} placeholder="مثال: BOX-800-01" className="font-mono font-bold" /></div>
                <div><label className="block font-semibold mb-1">عدد الصناديق *</label><Input type="number" min={1} value={boxesCount} onChange={e => setBoxesCount(Number(e.target.value))} /></div>
                <div><label className="block font-semibold mb-1">تاريخ التعليق *</label><Input type="date" value={installDate} onChange={e => setInstallDate(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="block font-semibold mb-1">مكان التعليق *</label><Input value={boxLocation} onChange={e => setBoxLocation(e.target.value)} /></div>
                <div><label className="block font-semibold mb-1">سبب اختيار المكان *</label><Input value={boxReason} onChange={e => setBoxReason(e.target.value)} /></div>
                <div><label className="block font-semibold mb-1">من اختار المكان *</label><Input value={boxChosenBy} onChange={e => setBoxChosenBy(e.target.value)} /></div>
              </div>
              <div className="border p-3 rounded-lg bg-slate-50 space-y-2">
                <label className="block font-semibold mb-1">📷 صور تعليق الصندوق واللوحة الإرشادية (اختياري)</label>
                <Input type="file" accept="image/*" multiple onChange={e => setBoxFiles(Array.from(e.target.files ?? []))} className="text-xs bg-white" />
                <p className="text-[10px] text-slate-500">{boxFiles.map(file => file.name).join("، ") || "لم يتم اختيار صور"}</p>
              </div>
              <div className="flex justify-end"><Button onClick={handleSaveBox} disabled={savingBox || loading} className="bg-blue-900 text-white font-bold px-8">{savingBox ? "جارٍ الحفظ..." : "حفظ الصندوق الميداني ✓"}</Button></div>
            </CardContent>
          </Card>

          <Card className="border bg-white shadow-sm">
            <CardHeader className="bg-slate-50 border-b py-3"><CardTitle className="text-sm font-bold text-slate-900">سجل صناديق الشكاوى الميدانية المسجلة</CardTitle></CardHeader>
            <CardContent className="p-4 overflow-x-auto text-xs">
              <table className="w-full text-right">
                <thead className="bg-slate-100 border-b"><tr><th className="p-2 border-l">رقم الصندوق</th><th className="p-2 border-l">رقم المشروع</th><th className="p-2 border-l">اسم المشروع</th><th className="p-2 border-l">مكان التعليق</th><th className="p-2 border-l">تاريخ التركيب</th><th className="p-2 border-l">عدد الصناديق</th><th className="p-2">الحالة</th></tr></thead>
                <tbody>
                  {filteredBoxesList.map(box => <tr key={box.id} className="border-b hover:bg-slate-50"><td className="p-2 border-l font-bold font-mono text-blue-900">{box.boxNumber}</td><td className="p-2 border-l font-mono">{box.projectNumber}</td><td className="p-2 border-l">{box.projectName}</td><td className="p-2 border-l">{box.installLocation}</td><td className="p-2 border-l">{box.installDate.slice(0, 10)}</td><td className="p-2 border-l">{box.boxCount}</td><td className="p-2">{box.status}</td></tr>)}
                  {!loading && filteredBoxesList.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-slate-500">لا توجد صناديق مسجلة مطابقة للبحث.</td></tr>}
                  {loading && <tr><td colSpan={7} className="p-6 text-center text-slate-500">جارٍ تحميل الصناديق...</td></tr>}
                </tbody>
              </table>
              {registeredBoxes.some(box => box.attachments.length > 0) && <div className="mt-3 space-y-1">{registeredBoxes.flatMap(box => box.attachments.map(file => <a key={file.id} className="block text-blue-700 underline" href={`/api/complaint-boxes/attachments/${file.id}`} target="_blank" rel="noreferrer">{box.boxNumber}: {file.fileName}</a>))}</div>}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "minutes" && (
        <div className="space-y-6">
          <Card className="border bg-white shadow-sm">
            <CardHeader className="bg-slate-50 border-b py-3"><CardTitle className="text-sm font-bold text-slate-900">تسجيل محضر فتح صندوق شكاوى (الربط التلقائي والتحقق)</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-6 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
                <span className="font-bold text-blue-900">1. البحث عن المشروع واختيار الصندوق:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className="block font-semibold mb-1">رقم المشروع</label><Input value={minutesProjectNo} onChange={e => { setMinutesProjectNo(e.target.value); setSelectedBoxId("") }} placeholder="أدخل رقم المشروع" className="bg-white font-mono" /></div>
                  <div><label className="block font-semibold mb-1">اسم المشروع</label><Input value={minutesProjectName} onChange={e => { setMinutesProjectName(e.target.value); setSelectedBoxId("") }} placeholder="ابحث باسم المشروع" className="bg-white" /></div>
                </div>
                <label className="block font-semibold mb-1">الصندوق المرتبط بالمشروع</label>
                <select value={selectedBoxId} onChange={e => { setSelectedBoxId(e.target.value); setSelectedMinute(null); resetMinuteForm() }} className="w-full p-2 border rounded-lg bg-white font-bold text-slate-800">
                  <option value="">-- اختر رقم الصندوق --</option>
                  {filteredBoxesForMinutes.map(box => <option key={box.id} value={box.boxNumber}>{box.boxNumber} | {box.projectNumber} — {box.projectName}</option>)}
                </select>
                {selectedBoxObj && <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-3 text-emerald-900 font-semibold"><div>رقم الصندوق: <b>{selectedBoxObj.boxNumber}</b></div><div>رقم المشروع: <b>{selectedBoxObj.projectNumber}</b></div><div>اسم المشروع: <b>{selectedBoxObj.projectName}</b></div><div>موقع التثبيت: <b>{selectedBoxObj.installLocation}</b></div></div>}
              </div>

              {selectedBoxObj && <>
                <div className="space-y-2">
                  <span className="font-bold text-slate-900">2. تواريخ المحضر وتتبع التأخير (أسبوعياً):</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border">
                    <div><label className="block font-semibold mb-1">تاريخ آخر محضر مدخل</label><Input type="date" value={lastMinuteDate} disabled className="bg-slate-200 font-mono" /></div>
                    <div><label className="block font-semibold mb-1">تاريخ آخر فتح للصندوق</label><Input type="date" value={lastOpeningDate} disabled className="bg-slate-200 font-mono" /></div>
                    <div><label className="block font-semibold mb-1">التاريخ المتوقع للفتح (الأربعاء الأسبوعي)</label><Input type="date" value={expectedDate} disabled className="bg-slate-200 font-mono" /></div>
                    <div><label className="block font-semibold mb-1">تاريخ استلام المحضر *</label><Input type="date" value={minutesDate} onChange={e => setMinutesDate(e.target.value)} className="bg-white" /></div>
                    <div><label className="block font-semibold mb-1">التاريخ المتوقع لتسليم المحضر</label><Input type="date" value={deliveryDate} disabled className="bg-slate-200 font-mono" /></div>
                    <div><label className="block font-semibold mb-1">تاريخ إدخال المحضر</label><Input type="date" value={entryDate} disabled className="bg-slate-200 font-mono" /></div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-900 text-white rounded-xl font-bold"><span>حالة الالتزام بموعد الفتح وتسليم المحضر:</span><span className="text-sm">{delayStatus}</span></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border">
                  <div><label className="block font-bold text-slate-800 mb-1">عدد الوثائق الموجودة في الصندوق *</label><Input type="number" min={0} value={totalDocuments} onChange={e => setTotalDocuments(Number(e.target.value))} className="font-bold text-lg bg-white" /></div>
                  <div><label className="block font-bold text-emerald-800 mb-1">إجمالي المقبول *</label><Input type="number" min={0} value={totalAccepted} onChange={e => setTotalAccepted(Number(e.target.value))} className="font-bold text-lg bg-white border-emerald-300 text-emerald-900" /></div>
                  <div><label className="block font-bold text-rose-800 mb-1">المرفوض *</label><Input type="number" min={0} value={totalRejected} onChange={e => setTotalRejected(Number(e.target.value))} className="font-bold text-lg bg-white border-rose-300 text-rose-900" /></div>
                  <div><label className="block font-semibold mb-1">سبب الرفض</label><Input value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} placeholder="أسباب الرفض..." className="bg-white" /></div>
                </div>
                {!isValidDocumentCount && <div className="p-3 bg-rose-100 border border-rose-300 text-rose-800 rounded-xl text-center font-bold">عدد الوثائق يجب أن يساوي المقبولة + المرفوضة ({totalAccepted + totalRejected} / {totalDocuments}).</div>}

                <div className="space-y-3 bg-blue-50/30 p-5 rounded-2xl border border-blue-200">
                  <div className="flex justify-between items-center border-b border-blue-200 pb-2"><span className="font-bold text-blue-900 text-sm">3. توزيع العمليات المقبولة حسب النوع:</span><div className="flex items-center gap-2"><span className="text-xs font-semibold">المجموع الموزع:</span><span className={`font-mono text-sm font-black px-3 py-1 rounded-lg ${isValidSum ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>{calculatedSum} / {totalAccepted}</span></div></div>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
                    {[[ "الشكاوى", complaints, setComplaints ],[ "البلاغات", reports, setReports ],[ "الطلبات", requests, setRequests ],[ "المقترحات", suggestions, setSuggestions ],[ "الاستعلامات", inquiries, setInquiries ],[ "الإطراءات", compliments, setCompliments ]].map(([label, value, setter]) => <div key={String(label)}><label className="block font-semibold mb-1 text-slate-800">{String(label)}</label><Input type="number" min={0} value={Number(value)} onChange={e => (setter as (value: number) => void)(Number(e.target.value))} className="bg-white text-center font-bold" /></div>)}
                  </div>
                  {!isValidSum && <div className="p-3 bg-rose-100 border border-rose-300 text-rose-800 rounded-xl text-center font-bold">مجموع الأعداد الموزعة ({calculatedSum}) لا يطابق الوثائق المقبولة ({totalAccepted}).</div>}
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2">
                  <label className="block font-bold text-emerald-900 text-xs">📎 إرفاق محضر الفتح (PDF أو صور) — إلزامي:</label>
                  <Input type="file" accept="image/*,.pdf,application/pdf" multiple required onChange={e => setMinutesFiles(Array.from(e.target.files ?? []))} className="bg-white text-xs cursor-pointer" />
                  <p className="text-[10px] text-emerald-700">{minutesFiles.map(file => file.name).join("، ") || "لم يتم اختيار ملف بعد."}</p>
                </div>
                <div className="flex justify-end"><Button onClick={handleSaveMinutes} disabled={savingMinute || !isValidSum || !isValidDocumentCount || minutesFiles.length === 0}>{savingMinute ? "جارٍ الحفظ..." : "حفظ وتوليد محضر الفتح ✓"}</Button></div>
              </>}
            </CardContent>
          </Card>

          <Card className="border bg-white shadow-sm">
            <CardHeader className="bg-slate-50 border-b py-3">
              <CardTitle className="text-sm font-bold text-slate-900">سجل محاضر فتح الصناديق المحفوظة</CardTitle>
              {lastSavedMinutesId && <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-950"><strong>تم إنشاء المحضر: {lastSavedMinutesId}</strong></div>}
            </CardHeader>
            <CardContent className="p-4 overflow-x-auto text-xs">
              <table className="w-full text-right">
                <thead className="bg-slate-100 border-b"><tr><th className="p-2 border-l">رقم المحضر</th><th className="p-2 border-l">رقم الصندوق</th><th className="p-2 border-l">رقم المشروع</th><th className="p-2 border-l">اسم المشروع</th><th className="p-2 border-l">تاريخ الفتح</th><th className="p-2 border-l">إجمالي العمليات</th><th className="p-2 border-l">الوثائق المقبولة</th><th className="p-2">التأخير</th></tr></thead>
                <tbody>
                  {filteredMinutesList.map(minute => <tr key={minute.id} onClick={() => setSelectedMinute(minute)} className="border-b hover:bg-slate-50 cursor-pointer"><td className="p-2 border-l font-bold font-mono text-emerald-800">{minute.minuteNumber}</td><td className="p-2 border-l font-mono text-blue-900">{minute.boxNumber}</td><td className="p-2 border-l font-mono">{minute.projectNumber}</td><td className="p-2 border-l min-w-48">{minute.projectName}</td><td className="p-2 border-l">{minute.openingDate.slice(0, 10)}</td><td className="p-2 border-l">{minute.totalOperations}</td><td className="p-2 border-l">{minute.acceptedAttachments}</td><td className="p-2 font-bold">{minute.delayStatus}</td></tr>)}
                  {!loading && filteredMinutesList.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-slate-500">لا توجد محاضر محفوظة مطابقة للبحث.</td></tr>}
                  {loading && <tr><td colSpan={8} className="p-6 text-center text-slate-500">جارٍ تحميل المحاضر...</td></tr>}
                </tbody>
              </table>
              {selectedMinute && <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-2">
                <div className="flex items-center justify-between gap-2"><strong className="text-blue-950">تفاصيل المحضر {selectedMinute.minuteNumber}</strong><Button size="sm" variant="outline" onClick={() => setSelectedMinute(null)}>إغلاق التفاصيل</Button></div>
                <p>رقم الصندوق: {selectedMinute.boxNumber} — المشروع: {selectedMinute.projectNumber} / {selectedMinute.projectName}</p>
                <p>تاريخ الفتح: {selectedMinute.openingDate.slice(0, 10)} — تاريخ استلام المحضر: {selectedMinute.minutesDate} — تاريخ التسليم المتوقع: {selectedMinute.deliveryDate}</p>
                <p>إجمالي الوثائق: {selectedMinute.totalDocuments} — المقبولة: {selectedMinute.acceptedAttachments} — المرفوضة: {selectedMinute.rejectedAttachments}</p>
                <p>توزيع المقبولة: شكاوى {selectedMinute.complaintsCount} — بلاغات {selectedMinute.reportsCount} — طلبات {selectedMinute.requestsCount} — مقترحات {selectedMinute.proposalsCount} — استعلامات {selectedMinute.inquiriesCount} — إطراءات {selectedMinute.praisesCount}</p>
                <div className="pt-2 border-t">{selectedMinute.attachments.map(file => <a key={file.id} className="block text-blue-700 underline" href={`/api/complaint-boxes/attachments/${file.id}`} target="_blank" rel="noreferrer">{file.fileName}</a>)}</div>
              </div>}
            </CardContent>
          </Card>

          <Card className="border border-amber-200 bg-amber-50/40 shadow-sm">
            <CardHeader className="border-b border-amber-200 py-3"><CardTitle className="text-sm font-bold text-amber-950">تنبيهات الصناديق ومواعيد الفتح والتسليم</CardTitle></CardHeader>
            <CardContent className="p-4 space-y-2 text-xs">
              {registeredBoxes.map(box => {
                const alert = getBoxAlerts(box)
                return <div key={box.id} className="rounded-lg border bg-white p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"><div><strong>{box.boxNumber}</strong> — {box.projectNumber} / {box.projectName}</div><div className="flex flex-wrap gap-3"><span className={alert.openingLate ? "font-bold text-rose-700" : "text-emerald-700"}>الفتح المتوقع: {alert.openingDue} — {alert.openingLate ? "متأخر" : "موعد قادم"}</span><span className={alert.deliveryLate ? "font-bold text-rose-700" : "text-emerald-700"}>التسليم المتوقع: {alert.deliveryDue} — {alert.deliveryLate ? "متأخر" : "موعد قادم"}</span></div></div>
              })}
              {!registeredBoxes.length && <p className="text-slate-500">لا توجد صناديق مسجلة لعرض التنبيهات.</p>}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
