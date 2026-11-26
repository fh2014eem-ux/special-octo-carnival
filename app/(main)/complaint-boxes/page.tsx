"use client"

import React, { useState, useMemo } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ALL_PROJECTS_DATABASE } from "@/lib/appData"

interface ComplaintBoxItem {
  boxId: string
  projectId: string
  projectName: string
  location: string
  installDate: string
  chosenBy: string
  reason: string
  boxCount: number
  status: "نشط" | "يحتاج فتح" | "متأخر"
}

interface OpeningMinutesItem {
  minutesId: string
  boxId: string
  projectId: string
  projectName: string
  openingDate: string
  minutesDate: string
  deliveryDate: string
  entryDate: string
  expectedDate: string
  totalAccepted: number
  totalRejected: number
  rejectionReason?: string
  complaints: number
  reports: number
  requests: number
  suggestions: number
  inquiries: number
  compliments: number
  delayStatus: "🟢 ضمن المدة" | "🟡 تأخير بسيط" | "🔴 متأخر"
  totalDocuments?: number
  attachmentNames?: string[]
}

export default function ComplaintBoxesPage() {
  const [activeTab, setActiveTab] = useState<"boxes" | "minutes">("boxes")

  const [searchProjectNo, setSearchProjectNo] = useState("")
  const [searchProjectName, setSearchProjectName] = useState("")
  const [selectedProject, setSelectedProject] = useState<any | null>(null)

  const [boxNumber, setBoxNumber] = useState("BOX-800-01")
  const [boxesCount, setBoxesCount] = useState<number>(1)
  const [installDate, setInstallDate] = useState("2026-10-25")
  const [boxLocation, setBoxLocation] = useState("المدخل الرئيسي لموقع المشروع")
  const [boxReason, setBoxReason] = useState("مكان بارز وآمن ومناسب لجميع المستفيدين")
  const [boxChosenBy, setBoxChosenBy] = useState("ضابط التوعية الميدانية واللجنة")

  // الاحتفاظ بكافة البيانات المسجلة السابقة
  const [registeredBoxes, setRegisteredBoxes] = useState<ComplaintBoxItem[]>([
    {
      boxId: "BOX-800-01",
      projectId: "800-13076",
      projectName: "بناء جدران حماية واستصلاح أراضي زراعية - مقبنة",
      location: "المدخل الرئيسي للموقع",
      installDate: "2026-10-15",
      chosenBy: "ضابط التوعية واللجنة",
      reason: "مكان بارز وسهل الوصول",
      boxCount: 1,
      status: "يحتاج فتح"
    },
    {
      boxId: "BOX-900-02",
      projectId: "900-13569",
      projectName: "حماية الأراضي الزراعية وإنشاء مناسح - التعزية",
      location: "مقر اللجنة المجتمعية",
      installDate: "2026-09-20",
      chosenBy: "المهندس المقيم واللجنة",
      reason: "مقر مرتفع وآمن",
      boxCount: 1,
      status: "نشط"
    }
  ])

  const filteredProjects = ALL_PROJECTS_DATABASE.filter(p => {
    const matchNo = searchProjectNo ? p.id.includes(searchProjectNo) : true
    const matchName = searchProjectName ? p.name.includes(searchProjectName) : true
    return matchNo && matchName
  })

  const handleSelectProject = (p: typeof ALL_PROJECTS_DATABASE[0]) => {
    setSelectedProject(p)
    setSearchProjectNo(p.id)
    setSearchProjectName(p.name)
    toast.success(`تم استجلاب بيانات المشروع: ${p.id}`)
  }

  const handleSaveBox = () => {
    if (!selectedProject) {
      toast.error("يرجى اختيار المشروع المرتبط بالصندوق أولاً.")
      return
    }
    const newBox: ComplaintBoxItem = {
      boxId: boxNumber,
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      location: boxLocation,
      installDate,
      chosenBy: boxChosenBy,
      reason: boxReason,
      boxCount: boxesCount,
      status: "نشط"
    }
    setRegisteredBoxes([newBox, ...registeredBoxes])
    toast.success("تم تسجيل بيانات صندوق الشكاوى الميداني وتثبيته بنجاح!")
  }

  // ===================== محاضر فتح الصناديق =====================
  const [selectedBoxId, setSelectedBoxId] = useState("")
  const [selectedBoxObj, setSelectedBoxObj] = useState<ComplaintBoxItem | null>(null)
  const [minutesProjectNo, setMinutesProjectNo] = useState("")
  const [minutesProjectName, setMinutesProjectName] = useState("")
  const [lastSavedMinutesId, setLastSavedMinutesId] = useState("")
  const [selectedMinute, setSelectedMinute] = useState<OpeningMinutesItem | null>(null)
  const [minutesFiles, setMinutesFiles] = useState<File[]>([])
  const [totalDocuments, setTotalDocuments] = useState<number>(6)

  const [minutesDate, setMinutesDate] = useState("")


  const [totalAccepted, setTotalAccepted] = useState<number>(5)
  const [totalRejected, setTotalRejected] = useState<number>(0)
  const [rejectionReason, setRejectionReason] = useState("")

  const [complaints, setComplaints] = useState<number>(2)
  const [reports, setReports] = useState<number>(1)
  const [requests, setRequests] = useState<number>(1)
  const [suggestions, setSuggestions] = useState<number>(1)
  const [inquiries, setInquiries] = useState<number>(0)
  const [compliments, setCompliments] = useState<number>(0)

  const calculatedSum = useMemo(() => {
    return Number(complaints) + Number(reports) + Number(requests) + Number(suggestions) + Number(inquiries) + Number(compliments)
  }, [complaints, reports, requests, suggestions, inquiries, compliments])

  const isValidSum = calculatedSum === Number(totalAccepted)
  const isValidDocumentCount = Number(totalAccepted) + Number(totalRejected) === Number(totalDocuments)

  // البيانات والمحاضر القديمة محفوظة بالكامل
  const [registeredMinutes, setRegisteredMinutes] = useState<OpeningMinutesItem[]>([
    {
      minutesId: "MIN-2026-001",
      boxId: "BOX-800-01",
      projectId: "800-13076",
      projectName: "بناء جدران حماية - مقبنة",
      openingDate: "2026-10-28",
      minutesDate: "2026-10-28",
      deliveryDate: "2026-10-29",
      entryDate: "2026-10-30",
      expectedDate: "2026-10-28",
      totalAccepted: 5,
      totalRejected: 1,
      rejectionReason: "ورقة غير واضحة",
      complaints: 2,
      reports: 1,
      requests: 1,
      suggestions: 1,
      inquiries: 0,
      compliments: 0,
      delayStatus: "🟢 ضمن المدة"
    }
  ])

  const todayDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)
  const latestMinute = registeredMinutes[0]
  const lastOpeningDate = latestMinute?.openingDate ?? ""
  const lastMinuteDate = latestMinute?.minutesDate ?? ""
  const addDays = (value: string, days: number) => {
    const date = new Date(`${value}T00:00:00`)
    date.setDate(date.getDate() + days)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }
  const nextWeeklyDate = (base: string) => {
    let candidate = base || todayDate
    while (candidate <= todayDate) candidate = addDays(candidate, 7)
    return candidate
  }
  const nextWednesday = () => {
    const date = new Date(`${todayDate}T00:00:00`)
    const daysUntilWednesday = (3 - date.getDay() + 7) % 7 || 7
    return addDays(todayDate, daysUntilWednesday)
  }
  const expectedDate = lastOpeningDate ? nextWeeklyDate(lastOpeningDate) : nextWednesday()
  const deliveryDate = latestMinute?.deliveryDate ? nextWeeklyDate(latestMinute.deliveryDate) : addDays(expectedDate, 1)
  const minutesOpeningDate = todayDate
  const entryDate = todayDate

  const handleSelectBoxForMinutes = (boxId: string) => {
    setSelectedBoxId(boxId)
    const box = registeredBoxes.find(b => b.boxId === boxId)
    if (box) {
      setSelectedBoxObj(box)
      toast.success(`تم استجلاب بيانات الصندوق رقم ${box.boxId}`)
    }
  }

  const calculateDelay = (): "🟢 ضمن المدة" | "🟡 تأخير بسيط" | "🔴 متأخر" => {
    if (!expectedDate || !minutesOpeningDate) return "🟢 ضمن المدة"
    const exp = new Date(expectedDate).getTime()
    const act = new Date(minutesOpeningDate).getTime()
    const diffDays = Math.ceil((act - exp) / (1000 * 3600 * 24))

    if (diffDays <= 0) return "🟢 ضمن المدة"
    if (diffDays <= 3) return "🟡 تأخير بسيط"
    return "🔴 متأخر"
  }

  const handleSaveMinutes = () => {
    if (!selectedBoxObj) {
      toast.error("يرجى اختيار صندوق الشكاوى أولاً.")
      return
    }

    if (!isValidSum) {
      toast.error(`مجموع أنواع العمليات (${calculatedSum}) لا يساوي الوثائق المقبولة (${totalAccepted}).`)
      return
    }
    if (!isValidDocumentCount) {
      toast.error("عدد الوثائق يجب أن يساوي المقبولة + المرفوضة.")
      return
    }
    if (!minutesDate) {
      toast.error("يرجى إدخال تاريخ استلام المحضر.")
      return
    }
    if (minutesFiles.length === 0) {
      toast.error("إرفاق صورة المحضر أو ملف PDF إلزامي قبل الحفظ.")
      return
    }

    const autoGeneratedMinutesId = `MIN-2026-00${registeredMinutes.length + 1}`
    const newMinutes: OpeningMinutesItem = {
      minutesId: autoGeneratedMinutesId,
      boxId: selectedBoxObj.boxId,
      projectId: selectedBoxObj.projectId,
      projectName: selectedBoxObj.projectName,
      openingDate: minutesOpeningDate,
      minutesDate,
      deliveryDate,
      entryDate,
      expectedDate,
      totalAccepted,
      totalRejected,
      totalDocuments,
      attachmentNames: minutesFiles.map(file => file.name),
      rejectionReason,
      complaints,
      reports,
      requests,
      suggestions,
      inquiries,
      compliments,
      delayStatus: calculateDelay()
    }

    setRegisteredMinutes([newMinutes, ...registeredMinutes])
    setLastSavedMinutesId(autoGeneratedMinutesId)
    setSelectedMinute(newMinutes)
    toast.success(`تم حفظ وتوليد المحضر رقم (${autoGeneratedMinutesId}) بنجاح!`)
  }

  const filteredBoxesList = registeredBoxes.filter(b =>
    (!searchProjectNo || b.projectId.toLowerCase().includes(searchProjectNo.toLowerCase())) &&
    (!searchProjectName || b.projectName.toLowerCase().includes(searchProjectName.toLowerCase()))
  )

  const filteredBoxesForMinutes = registeredBoxes.filter(b =>
    (!minutesProjectNo || b.projectId.toLowerCase().includes(minutesProjectNo.toLowerCase())) &&
    (!minutesProjectName || b.projectName.toLowerCase().includes(minutesProjectName.toLowerCase()))
  )

  const filteredMinutesList = registeredMinutes.filter(m =>
    (!minutesProjectNo || m.projectId.toLowerCase().includes(minutesProjectNo.toLowerCase())) &&
    (!minutesProjectName || m.projectName.toLowerCase().includes(minutesProjectName.toLowerCase()))
  )

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 dir-rtl text-right font-sans">
      <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-l-blue-900">
        <div>
          <h1 className="text-xl font-black text-slate-900">المحور الثالث — صناديق الشكاوى ومحاضر الفتح 📦</h1>
          <p className="text-xs text-slate-500 mt-1">تثبيت الصناديق الميدانية، تحرير محاضر الفتح، والتحقق الآلي</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <Button variant={activeTab === "boxes" ? "default" : "outline"} onClick={() => setActiveTab("boxes")} className={activeTab === "boxes" ? "bg-blue-900 text-white" : ""}>
            📦 صناديق الشكاوى
          </Button>
          <Button variant={activeTab === "minutes" ? "default" : "outline"} onClick={() => setActiveTab("minutes")} className={activeTab === "minutes" ? "bg-blue-900 text-white" : ""}>
            📑 محاضر الفتح
          </Button>
        </div>
      </div>

      {activeTab === "boxes" && (
        <div className="space-y-6">
          <Card className="border bg-white shadow-sm">
            <CardHeader className="bg-slate-50 border-b py-3">
              <CardTitle className="text-sm font-bold text-slate-900">تسجيل صندوق شكاوى ميداني جديد</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
                <span className="font-bold text-blue-900">1. اختيار المشروع:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">رقم المشروع:</label>
                    <Input value={searchProjectNo} onChange={(e) => setSearchProjectNo(e.target.value)} placeholder="800-..." className="bg-white font-mono" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">اسم المشروع:</label>
                    <Input value={searchProjectName} onChange={(e) => setSearchProjectName(e.target.value)} placeholder="ابحث بالاسم..." className="bg-white" />
                  </div>
                </div>

                {(searchProjectNo || searchProjectName) && filteredProjects.length > 0 && !selectedProject && (
                  <div className="max-h-36 overflow-y-auto border bg-white rounded-lg p-2 space-y-1">
                    {filteredProjects.slice(0, 8).map(p => (
                      <div key={p.id} onClick={() => handleSelectProject(p)} className="p-2 hover:bg-blue-50 cursor-pointer rounded flex justify-between items-center text-[11px]">
                        <span className="font-bold font-mono text-blue-900">{p.id}</span>
                        <span className="truncate max-w-md">{p.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedProject && (
                <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg flex justify-between items-center text-xs text-blue-900">
                  <div>• المشروع المحدد: <span className="font-bold font-mono">{selectedProject.id}</span> - <span className="font-bold">{selectedProject.name}</span></div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block font-semibold mb-1">رقم الصندوق *</label>
                  <Input value={boxNumber} onChange={(e) => setBoxNumber(e.target.value)} className="font-mono font-bold" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">عدد الصناديق *</label>
                  <Input type="number" value={boxesCount} onChange={(e) => setBoxesCount(Number(e.target.value))} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">تاريخ التعليق *</label>
                  <Input type="date" value={installDate} onChange={(e) => setInstallDate(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1">مكان التعليق *</label>
                  <Input value={boxLocation} onChange={(e) => setBoxLocation(e.target.value)} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">سبب اختيار المكان *</label>
                  <Input value={boxReason} onChange={(e) => setBoxReason(e.target.value)} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">من اختار المكان *</label>
                  <Input value={boxChosenBy} onChange={(e) => setBoxChosenBy(e.target.value)} />
                </div>
              </div>

              <div className="border p-3 rounded-lg bg-slate-50">
                <label className="block font-semibold mb-1">📷 إدراج صور تعليق الصندوق واللوحة الإرشادية:</label>
                <Input type="file" multiple className="text-xs bg-white" />
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={handleSaveBox} className="bg-blue-900 text-white font-bold px-8">حفظ الصندوق الميداني ✓</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-white shadow-sm">
            <CardHeader className="bg-slate-50 border-b py-3">
              <CardTitle className="text-sm font-bold text-slate-900">سجل صناديق الشكاوى الميدانية المسجلة</CardTitle>
            </CardHeader>
            <CardContent className="p-4 overflow-x-auto text-xs">
              <table className="w-full text-right">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="p-2 border-l">رقم الصندوق</th>
                    <th className="p-2 border-l">رقم المشروع</th>
                    <th className="p-2 border-l">اسم المشروع</th>
                    <th className="p-2 border-l">مكان التعليق</th>
                    <th className="p-2 border-l">تاريخ التركيب</th>
                    <th className="p-2 border-l">من اختار المكان</th>
                    <th className="p-2">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBoxesList.map(b => (
                    <tr key={b.boxId} className="border-b hover:bg-slate-50">
                      <td className="p-2 border-l font-bold font-mono text-blue-900">{b.boxId}</td>
                      <td className="p-2 border-l font-mono">{b.projectId}</td>
                      <td className="p-2 border-l">{b.projectName}</td>
                      <td className="p-2 border-l">{b.location}</td>
                      <td className="p-2 border-l">{b.installDate}</td>
                      <td className="p-2 border-l">{b.chosenBy}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${b.status === "يحتاج فتح" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "minutes" && (
        <div className="space-y-6">
          <Card className="border bg-white shadow-sm">
            <CardHeader className="bg-slate-50 border-b py-3">
              <CardTitle className="text-sm font-bold text-slate-900">تسجيل محضر فتح صندوق شكاوى (الربط التلقائي والتحقق)</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
                <span className="font-bold text-blue-900">1. البحث عن المشروع واختيار صندوق الشكاوى:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className="block font-semibold mb-1">رقم المشروع</label><Input value={minutesProjectNo} onChange={(e) => { setMinutesProjectNo(e.target.value); setSelectedBoxId(""); setSelectedBoxObj(null) }} placeholder="أدخل رقم المشروع" className="bg-white font-mono" /></div>
                  <div><label className="block font-semibold mb-1">اسم المشروع</label><Input value={minutesProjectName} onChange={(e) => { setMinutesProjectName(e.target.value); setSelectedBoxId(""); setSelectedBoxObj(null) }} placeholder="ابحث باسم المشروع" className="bg-white" /></div>
                </div>
                <label className="block font-semibold mb-1">الصندوق المرتبط بالمشروع</label>
                <select value={selectedBoxId} onChange={(e) => handleSelectBoxForMinutes(e.target.value)} className="w-full p-2 border rounded-lg bg-white font-bold text-slate-800">
                  <option value="">-- اختر رقم الصندوق --</option>
                  {filteredBoxesForMinutes.map(b => (
                    <option key={b.boxId} value={b.boxId}>
                      {b.boxId} | مشروع: {b.projectId} - {b.projectName}
                    </option>
                  ))}
                </select>

                {selectedBoxObj && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-3 text-emerald-900 font-semibold">
                    <div>• رقم الصندوق: <span className="font-mono font-bold">{selectedBoxObj.boxId}</span></div>
                    <div>• رقم المشروع: <span className="font-mono font-bold">{selectedBoxObj.projectId}</span></div>
                    <div>• اسم المشروع: <span className="font-bold">{selectedBoxObj.projectName}</span></div>
                    <div>• موقع التثبيت: <span className="font-bold">{selectedBoxObj.location}</span></div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-900">2. تواريخ المحضر وتتبع التأخير ⏱️:</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border">
                  <div><label className="block font-semibold mb-1">تاريخ آخر محضر مدخل</label><Input type="date" value={lastMinuteDate} disabled className="bg-slate-200 font-mono" /></div>
                  <div><label className="block font-semibold mb-1">تاريخ آخر فتح للصندوق</label><Input type="date" value={lastOpeningDate} disabled className="bg-slate-200 font-mono" /></div>
                  <div><label className="block font-semibold mb-1">التاريخ المتوقع للفتح (أسبوعياً)</label><Input type="date" value={expectedDate} disabled className="bg-slate-200 font-mono" /></div>
                  <div><label className="block font-semibold mb-1">تاريخ استلام المحضر *</label><Input type="date" value={minutesDate} onChange={(e) => setMinutesDate(e.target.value)} className="bg-white" /></div>
                  <div><label className="block font-semibold mb-1">التاريخ المتوقع لتسليم المحضر</label><Input type="date" value={deliveryDate} disabled className="bg-slate-200 font-mono" /></div>
                  <div><label className="block font-semibold mb-1">تاريخ إدخال المحضر</label><Input type="date" value={entryDate} disabled className="bg-slate-200 font-mono" /></div>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-900 text-white rounded-xl font-bold">
                  <span>حالة الالتزام بموعد الفتح وتسليم المحضر:</span>
                  <span className="text-sm">{calculateDelay()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">عدد الوثائق الموجودة في الصندوق *</label>
                  <Input type="number" min={0} value={totalDocuments} onChange={(e) => setTotalDocuments(Number(e.target.value))} className="font-bold text-lg bg-white" />
                </div>
                <div>
                  <label className="block font-bold text-emerald-800 mb-1">إجمالي المقبول *</label>
                  <Input type="number" value={totalAccepted} onChange={(e) => setTotalAccepted(Number(e.target.value))} className="font-bold text-lg bg-white border-emerald-300 text-emerald-900" />
                </div>
                <div>
                  <label className="block font-bold text-rose-800 mb-1">المرفوض</label>
                  <Input type="number" value={totalRejected} onChange={(e) => setTotalRejected(Number(e.target.value))} className="font-bold text-lg bg-white border-rose-300 text-rose-900" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">سبب الرفض</label>
                  <Input value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="أسباب الرفض..." className="bg-white" />
                </div>
              </div>

              {!isValidDocumentCount && <div className="p-3 bg-rose-100 border border-rose-300 text-rose-800 rounded-xl text-center font-bold text-xs">يجب أن يساوي عدد الوثائق ({totalDocuments}) مجموع المقبولة ({totalAccepted}) والمرفوضة ({totalRejected}).</div>}
              <div className="space-y-3 bg-blue-50/30 p-5 rounded-2xl border border-blue-200">
                <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                  <span className="font-bold text-blue-900 text-sm">4. توزيع العمليات المقبولة حسب النوع:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">المجموع الموزع:</span>
                    <span className={`font-mono text-sm font-black px-3 py-1 rounded-lg ${isValidSum ? "bg-emerald-600 text-white" : "bg-rose-600 text-white animate-pulse"}`}>
                      {calculatedSum} / {totalAccepted}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-800">الشكاوى</label>
                    <Input type="number" value={complaints} onChange={(e) => setComplaints(Number(e.target.value))} className="bg-white text-center font-bold" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-800">البلاغات</label>
                    <Input type="number" value={reports} onChange={(e) => setReports(Number(e.target.value))} className="bg-white text-center font-bold" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-800">الطلبات</label>
                    <Input type="number" value={requests} onChange={(e) => setRequests(Number(e.target.value))} className="bg-white text-center font-bold" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-800">المقترحات</label>
                    <Input type="number" value={suggestions} onChange={(e) => setSuggestions(Number(e.target.value))} className="bg-white text-center font-bold" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-800">الاستعلامات</label>
                    <Input type="number" value={inquiries} onChange={(e) => setInquiries(Number(e.target.value))} className="bg-white text-center font-bold" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-800">الإطراءات</label>
                    <Input type="number" value={compliments} onChange={(e) => setCompliments(Number(e.target.value))} className="bg-white text-center font-bold" />
                  </div>
                </div>

                {!isValidSum && (
                  <div className="p-3 bg-rose-100 border border-rose-300 text-rose-800 rounded-xl text-center font-bold text-xs">
                    🛑 تنبيه: مجموع الأعداد الموزعة ({calculatedSum}) لا يطابق الإجمالي المقبول بالمحضر ({totalAccepted}).
                  </div>
                )}
              </div>

              {/* 📷 إضافة حقل إدراج صور محضر فتح الصندوق الموقّع / ملف المحضر الورقي */}
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2">
                <label className="block font-bold text-emerald-900 text-xs">📸 إدراج صور محضر فتح الصندوق الموقّع / ملف المحضر الورقي (PDF/Images):</label>
                <Input type="file" accept="image/*, .pdf" multiple required onChange={(e) => setMinutesFiles(Array.from(e.target.files ?? []))} className="bg-white text-xs cursor-pointer" />
                <p className="text-[10px] text-emerald-700">المرفق إلزامي. الملفات المختارة: {minutesFiles.map(file => file.name).join("، ") || "لم يتم اختيار ملف بعد"}.</p>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={handleSaveMinutes} disabled={!isValidSum || !isValidDocumentCount || minutesFiles.length === 0 || !selectedBoxObj} className={`font-bold px-10 py-3 rounded-xl text-xs ${isValidSum && isValidDocumentCount && minutesFiles.length > 0 && selectedBoxObj ? "bg-blue-900 text-white hover:bg-blue-800" : "bg-slate-300 text-slate-500 cursor-not-allowed"}`}>
                  حفظ وتوليد محضر فتح الصندوق الآلي ✓
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-white shadow-sm">
            <CardHeader className="bg-slate-50 border-b py-3">
              <CardTitle className="text-sm font-bold text-slate-900">سجل محاضر فتح الصناديق المعتمدة بالنظام</CardTitle>
              {lastSavedMinutesId && (
                <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-950 space-y-1">
                  <strong>تم إنشاء المحضر: {lastSavedMinutesId}</strong>
                  <p>رقم الصندوق: {selectedMinute?.boxId ?? "—"} — رقم المشروع: {selectedMinute?.projectId ?? "—"} — اسم المشروع: {selectedMinute?.projectName ?? "—"}</p>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4 overflow-x-auto text-xs">
              <table className="w-full text-right">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="p-2 border-l">رقم المحضر</th>
                    <th className="p-2 border-l">رقم الصندوق</th>
                    <th className="p-2 border-l">رقم المشروع</th>
                    <th className="p-2 border-l">تاريخ الفتح</th>
                    <th className="p-2 border-l">المقبول</th>
                    <th className="p-2 border-l">المرفوض</th>
                    <th className="p-2 border-l">التوزيع</th>
                    <th className="p-2">التأخير</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMinutesList.map(m => (
                    <tr key={m.minutesId} onClick={() => setSelectedMinute(m)} className="border-b hover:bg-slate-50 cursor-pointer">
                      <td className="p-2 border-l font-bold font-mono text-emerald-800">{m.minutesId}</td>
                      <td className="p-2 border-l font-mono text-blue-900">{m.boxId}</td>
                      <td className="p-2 border-l font-mono">{m.projectId}</td>
                      <td className="p-2 border-l">{m.openingDate}</td>
                      <td className="p-2 border-l font-bold text-emerald-700">{m.totalAccepted}</td>
                      <td className="p-2 border-l text-rose-700">{m.totalRejected}</td>
                      <td className="p-2 border-l">[{m.complaints} شكوى | {m.reports} بلاغ | {m.requests} طلب]</td>
                      <td className="p-2 font-bold">{m.delayStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {selectedMinute && (
                <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2"><strong className="text-blue-950">تفاصيل المحضر {selectedMinute.minutesId}</strong><Button size="sm" variant="outline" onClick={() => setSelectedMinute(null)}>إغلاق التفاصيل</Button></div>
                  <p>رقم الصندوق: {selectedMinute.boxId} — المشروع: {selectedMinute.projectId} / {selectedMinute.projectName}</p>
                  <p>تاريخ الفتح: {selectedMinute.openingDate} — تاريخ المحضر: {selectedMinute.minutesDate} — تاريخ التسليم: {selectedMinute.deliveryDate}</p>
                  <p>إجمالي الوثائق: {selectedMinute.totalDocuments ?? "—"} — المرفقات: {selectedMinute.attachmentNames?.join("، ") || "—"}</p>
                  <p>الوثائق المقبولة: {selectedMinute.totalAccepted} — المرفوضة: {selectedMinute.totalRejected} — الشكاوى: {selectedMinute.complaints} — البلاغات: {selectedMinute.reports} — الطلبات: {selectedMinute.requests} — المقترحات: {selectedMinute.suggestions} — الاستعلامات: {selectedMinute.inquiries} — الإطراءات: {selectedMinute.compliments}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-amber-200 bg-amber-50/40 shadow-sm">
            <CardHeader className="border-b border-amber-200 py-3">
              <CardTitle className="text-sm font-bold text-amber-950">تنبيهات الصناديق ومواعيد الفتح والتسليم</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs">
              {registeredBoxes.map((box) => {
                const latest = registeredMinutes.find((minute) => minute.boxId === box.boxId)
                const openingDue = latest ? addDays(latest.openingDate, 7) : nextWednesday()
                const deliveryDue = latest ? addDays(latest.deliveryDate, 7) : addDays(openingDue, 1)
                const openingLate = openingDue < todayDate
                const deliveryLate = deliveryDue < todayDate
                return (
                  <div key={box.boxId} className="rounded-lg border bg-white p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div><strong>{box.boxId}</strong> — {box.projectId} / {box.projectName}</div>
                    <div className="flex flex-wrap gap-3">
                      <span className={openingLate ? "font-bold text-rose-700" : "text-emerald-700"}>الفتح: {openingDue} — {openingLate ? "متأخر" : "موعد قادم"}</span>
                      <span className={deliveryLate ? "font-bold text-rose-700" : "text-emerald-700"}>التسليم: {deliveryDue} — {deliveryLate ? "متأخر" : "موعد قادم"}</span>
                    </div>
                  </div>
                )
              })}
              {registeredBoxes.length === 0 && <p className="text-slate-500">لا توجد صناديق مسجلة لعرض التنبيهات.</p>}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}