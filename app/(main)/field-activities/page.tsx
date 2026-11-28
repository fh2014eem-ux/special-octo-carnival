"use client"

import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import FieldFormContent from "./components/FieldFormContent"

interface CommitteeMember {
  id: number
  name: string
  gender: "ذكر" | "أنثى"
  role: string
  phone1: string
  phone2?: string
  absenceReason?: string
  notes?: string
}

interface ProjectTeamMember {
  id: number
  name: string
  role: "استشاري" | "مهندس استشاري" | "فني مقيم" | "مجتمعي"
  gender: "ذكر" | "أنثى"
  phone: string
  attendance: "حاضر" | "غائب"
  absenceReason?: string
  notes?: string
}

interface AwarenessSession {
  id: number
  date: string
  place: string
  description: string
  males: number
  females: number
}

export default function FieldManagementPage() {
  const [currentView, setCurrentView] = useState<"dashboard" | "form">("dashboard")
  const [draftRestored, setDraftRestored] = useState(false)
  const [awarenessMode, setAwarenessMode] = useState<"أساسية" | "تكرار">("أساسية")
  const [projectType, setProjectType] = useState<"ميداني" | "تدريبي" | "أخرى">("ميداني")

  const [searchNo, setSearchNo] = useState("")
  const [searchName, setSearchName] = useState("")
  const [selectedProject, setSelectedProject] = useState<any | null>(null)
  const [filterCardStatus, setFilterCardStatus] = useState<string | null>(null)

  // تحميل المشاريع من المرجع المركزي بدلاً من نسخة ثابتة داخل المتصفح.
  const [projectsList, setProjectsList] = useState<any[]>([])
  useEffect(() => {
    let cancelled = false
    fetch("/api/reference/projects", { cache: "no-store" })
      .then(async response => {
        const body = await response.json()
        if (!response.ok) throw new Error(body.error || "تعذر تحميل مرجع المشاريع")
        const mapped = (Array.isArray(body.projects) ? body.projects : []).map((project: any) => {
          const data = project.data && typeof project.data === "object" ? project.data : {}
          return {
            id: project.projectNumber,
            name: project.projectName,
            branch: project.branch || "",
            sector: data["القطاع الرئيسي"] || "",
            funder: data["الممول"] || "",
            officer: data["ضابط المشروع"] || "",
            status: data["حالة المشروع"] || "غير محدد",
            date: data["تاريخ البدء"] || "-",
            data,
          }
        })
        if (!cancelled) setProjectsList(mapped)
      })
      .catch(error => { if (!cancelled) toast.error(error instanceof Error ? error.message : "تعذر تحميل المشاريع المرجعية") })
    return () => { cancelled = true }
  }, [])

  const [awarenessExecuter, setAwarenessExecuter] = useState("فريق الشكاوى والامتثال")
  const [awarenessDate, setAwarenessDate] = useState("2026-10-30")
  const [awarenessPlace, setAwarenessPlace] = useState("موقع المشروع")
  const [awarenessDescription, setAwarenessDescription] = useState("")
  const [activitySubject, setActivitySubject] = useState("")
  const [activityObjective, setActivityObjective] = useState("")
  const [activityDuration, setActivityDuration] = useState("")
  const [directBeneficiaries, setDirectBeneficiaries] = useState<number>(0)
  const [indirectBeneficiaries, setIndirectBeneficiaries] = useState<number>(0)
  
  const [repeatedSessions, setRepeatedSessions] = useState<AwarenessSession[]>([
    { id: 1, date: "2026-10-28", place: "قرية المشروع", description: "جلسة توعية أولى", males: 15, females: 12 },
    { id: 2, date: "2026-10-29", place: "مدرسة القرية", description: "جلسة توعية ثانية", males: 10, females: 11 }
  ])

  const [postersCount, setPostersCount] = useState<number>(10)
  const [brochuresCount, setBrochuresCount] = useState<number>(50)
  const [brochuresTarget, setBrochuresTarget] = useState("المستفيدون واللجنة المجتمعية")
  const [postersLocation, setPostersLocation] = useState("لوحة إعلانات المشروع")

  const [hasCommunityCommittee, setHasCommunityCommittee] = useState<"نعم" | "لا">("نعم")
  const [committeeNoReason, setCommitteeNoReason] = useState("")
  const [committeeNotTrainedReason, setCommitteeNotTrainedReason] = useState("")
  const [isCommitteeTrained, setIsCommitteeTrained] = useState<"نعم" | "لا">("نعم")
  const [committeeTrainer, setCommitteeTrainer] = useState("ضابط التوعية الميدانية")
  const [committeeType, setCommitteeType] = useState("لجنة مشروع")
  const [trainingDate, setTrainingDate] = useState("2026-10-27")
  const [trainingPlace, setTrainingPlace] = useState("مقر المركز الاجتماعي")
  const [trainingDescription, setTrainingDescription] = useState("")

  const [presentMembers, setPresentMembers] = useState<CommitteeMember[]>([
    { id: 1, name: "علي أحمد سعيد", gender: "ذكر", role: "رئيس اللجنة", phone1: "771234567", notes: "" }
  ])

  const [absentMembers, setAbsentMembers] = useState<CommitteeMember[]>([
    { id: 1, name: "محمد علي ناجي", gender: "ذكر", role: "عضو", phone1: "701122334", absenceReason: "سفر خارج المنطقة", notes: "" }
  ])

  const [projectTeam, setProjectTeam] = useState<ProjectTeamMember[]>([
    { id: 1, name: "م. عبد الله الشرجبي", role: "فني مقيم", gender: "ذكر", phone: "770001122", attendance: "حاضر", notes: "" }
  ])

  const [hasBox, setHasBox] = useState<"نعم" | "لا">("نعم")
  const [noBoxReason, setNoBoxReason] = useState("")
  const [boxCount, setBoxCount] = useState<number>(1)
  const [boxNumber, setBoxNumber] = useState("")
  const [boxHangDate, setBoxHangDate] = useState("2026-10-25")
  const [boxLocation, setBoxLocation] = useState("المدخل الرئيسي لموقع المشروع")
  const [boxChoiceReason, setBoxChoiceReason] = useState("مكان بارز وآمن للجميع")
  const [boxChooserName, setBoxChooserName] = useState("ضابط التوعية واللجنة المجتمعية")

  const [hasBoard, setHasBoard] = useState<"نعم" | "لا">("نعم")
  const [noBoardReason, setNoBoardReason] = useState("")
  const [boardCount, setBoardCount] = useState<number>(1)
  const [boardLocation, setBoardLocation] = useState("بجوار صندوق الشكاوى")
  const [boardReason, setBoardReason] = useState("مكان واضح ومرئي للمستفيدين")

  const [hasMinutesBook, setHasMinutesBook] = useState<"نعم" | "لا">("نعم")
  const [noMinutesBookReason, setNoMinutesBookReason] = useState("")
  const [receiverName, setReceiverName] = useState("")
  const [receiverRole, setReceiverRole] = useState("")
  const [receiverPhone, setReceiverPhone] = useState("")
  const [minutesBookNotes, setMinutesBookNotes] = useState("")

  const filteredProjects = ALL_PROJECTS_DATABASE.filter(p => {
    const matchNo = searchNo ? p.id.includes(searchNo) : true
    const matchName = searchName ? p.name.includes(searchName) : true
    return matchNo && matchName
  })

  const handleSelectProject = (p: typeof ALL_PROJECTS_DATABASE[0]) => {
    setSelectedProject(p)
    setSearchNo(p.id)
    setSearchName(p.name)
    toast.success(`تم استجلاب بيانات المشروع: ${p.id}`)
  }

  const totalCalculatedMales = repeatedSessions.reduce((acc, s) => acc + (Number(s.males) || 0), 0)
  const totalCalculatedFemales = repeatedSessions.reduce((acc, s) => acc + (Number(s.females) || 0), 0)
  const totalBeneficiaries = totalCalculatedMales + totalCalculatedFemales

  const presentMales = presentMembers.filter(m => m.gender === "ذكر").length
  const presentFemales = presentMembers.filter(m => m.gender === "أنثى").length
  const absentMales = absentMembers.filter(m => m.gender === "ذكر").length
  const absentFemales = absentMembers.filter(m => m.gender === "أنثى").length

  const handleOpenForm = (proj?: any, mode: "أساسية" | "تكرار" = "أساسية") => {
    if (proj) {
      setSelectedProject(proj)
      setSearchNo(proj.id)
      setSearchName(proj.name)
    }
    setAwarenessMode(mode)
    setCurrentView("form")
    toast.success(`فتح نموذج إدخال التقارير (${mode})`)
  }

  const buildFieldPayload = () => ({
    awarenessMode, projectType, searchNo, searchName, selectedProject, awarenessExecuter, awarenessDate, awarenessPlace,
    awarenessDescription, activitySubject, activityObjective, activityDuration, directBeneficiaries,
    indirectBeneficiaries, repeatedSessions, brochuresCount, postersCount, brochuresTarget, postersLocation,
    hasCommunityCommittee, committeeNoReason, isCommitteeTrained, committeeNotTrainedReason,
    committeeTrainer, committeeType, trainingDate, trainingPlace, trainingDescription,
    presentMembers, absentMembers, projectTeam, hasBox, noBoxReason, boxCount, boxNumber,
    boxHangDate, boxLocation, boxChoiceReason, boxChooserName, hasBoard, noBoardReason,
    boardCount, boardLocation, boardReason, hasMinutesBook, noMinutesBookReason,
    receiverName, receiverRole, receiverPhone, minutesBookNotes,
  })

  const saveDraftToBrowser = () => {
    try {
      localStorage.setItem(
        "field-management-current-draft-v1",
        JSON.stringify({ ...buildFieldPayload(), savedAt: new Date().toISOString(), status: "مسودة" }),
      )
      toast.success("تم حفظ المسودة على هذا المتصفح. ستبقى متاحة عند العودة من المتصفح نفسه.")
    } catch {
      toast.error("تعذر حفظ المسودة محلياً. تحقق من مساحة التخزين في المتصفح.")
    }
  }

  const handleQuickSave = () => saveDraftToBrowser()

  const handleFinalSave = async () => {
    if (!searchNo.trim() || !searchName.trim()) {
      toast.error("يرجى اختيار المشروع من المرجع قبل حفظ التقرير.")
      return
    }
    try {
      const details = buildFieldPayload()
      const response = await fetch("/api/field-awareness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectNumber: searchNo.trim(),
          projectName: searchName.trim(),
          awarenessType: awarenessMode === "تكرار" ? "تكرار التوعية" : "توعية أساسية",
          projectCategory: projectType === "تدريبي" ? "مشاريع تدريبية" : projectType === "أخرى" ? "أخرى" : "مشاريع ميدانية",
          activityDate: awarenessDate,
          location: awarenessPlace,
          targetAudience: brochuresTarget,
          activityGoal: activityObjective,
          topic: activitySubject,
          duration: activityDuration,
          directBeneficiaries,
          indirectBeneficiaries,
          description: awarenessDescription,
          hasBox: hasBox === "نعم",
          boxCount: hasBox === "نعم" ? boxCount : 0,
          details,
        }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || "تعذر حفظ تقرير التوعية مركزياً.")
      localStorage.removeItem("field-management-current-draft-v1")
      toast.success("تم حفظ تقرير التوعية في قاعدة البيانات المركزية بنجاح.")
      setCurrentView("dashboard")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر حفظ التقرير مركزياً.")
    }
  }

  // استعادة آخر مسودة محفوظة عند فتح الصفحة من المتصفح نفسه.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("field-management-current-draft-v1")
      if (raw) {
        const draft = JSON.parse(raw)
        if (draft && typeof draft === "object") {
          if (draft.awarenessMode) setAwarenessMode(draft.awarenessMode)
          if (draft.projectType) setProjectType(draft.projectType)
          if (typeof draft.searchNo === "string") setSearchNo(draft.searchNo)
          if (typeof draft.searchName === "string") setSearchName(draft.searchName)
          if (draft.selectedProject) setSelectedProject(draft.selectedProject)
          if (typeof draft.awarenessExecuter === "string") setAwarenessExecuter(draft.awarenessExecuter)
          if (typeof draft.awarenessDate === "string") setAwarenessDate(draft.awarenessDate)
          if (typeof draft.awarenessPlace === "string") setAwarenessPlace(draft.awarenessPlace)
          if (typeof draft.awarenessDescription === "string") setAwarenessDescription(draft.awarenessDescription)
          if (typeof draft.activitySubject === "string") setActivitySubject(draft.activitySubject)
          if (typeof draft.activityObjective === "string") setActivityObjective(draft.activityObjective)
          if (typeof draft.activityDuration === "string") setActivityDuration(draft.activityDuration)
          if (typeof draft.directBeneficiaries === "number") setDirectBeneficiaries(draft.directBeneficiaries)
          if (typeof draft.indirectBeneficiaries === "number") setIndirectBeneficiaries(draft.indirectBeneficiaries)
          if (Array.isArray(draft.repeatedSessions)) setRepeatedSessions(draft.repeatedSessions)
          if (typeof draft.brochuresCount === "number") setBrochuresCount(draft.brochuresCount)
          if (typeof draft.postersCount === "number") setPostersCount(draft.postersCount)
          if (typeof draft.brochuresTarget === "string") setBrochuresTarget(draft.brochuresTarget)
          if (typeof draft.postersLocation === "string") setPostersLocation(draft.postersLocation)
          if (draft.hasCommunityCommittee) setHasCommunityCommittee(draft.hasCommunityCommittee)
          if (typeof draft.committeeNoReason === "string") setCommitteeNoReason(draft.committeeNoReason)
          if (draft.isCommitteeTrained) setIsCommitteeTrained(draft.isCommitteeTrained)
          if (typeof draft.committeeNotTrainedReason === "string") setCommitteeNotTrainedReason(draft.committeeNotTrainedReason)
          if (typeof draft.committeeTrainer === "string") setCommitteeTrainer(draft.committeeTrainer)
          if (typeof draft.committeeType === "string") setCommitteeType(draft.committeeType)
          if (typeof draft.trainingDate === "string") setTrainingDate(draft.trainingDate)
          if (typeof draft.trainingPlace === "string") setTrainingPlace(draft.trainingPlace)
          if (typeof draft.trainingDescription === "string") setTrainingDescription(draft.trainingDescription)
          if (Array.isArray(draft.presentMembers)) setPresentMembers(draft.presentMembers)
          if (Array.isArray(draft.absentMembers)) setAbsentMembers(draft.absentMembers)
          if (Array.isArray(draft.projectTeam)) setProjectTeam(draft.projectTeam)
          if (draft.hasBox) setHasBox(draft.hasBox)
          if (typeof draft.noBoxReason === "string") setNoBoxReason(draft.noBoxReason)
          if (typeof draft.boxCount === "number") setBoxCount(draft.boxCount)
          if (typeof draft.boxNumber === "string") setBoxNumber(draft.boxNumber)
          if (typeof draft.boxHangDate === "string") setBoxHangDate(draft.boxHangDate)
          if (typeof draft.boxLocation === "string") setBoxLocation(draft.boxLocation)
          if (typeof draft.boxChoiceReason === "string") setBoxChoiceReason(draft.boxChoiceReason)
          if (typeof draft.boxChooserName === "string") setBoxChooserName(draft.boxChooserName)
          if (draft.hasBoard) setHasBoard(draft.hasBoard)
          if (typeof draft.noBoardReason === "string") setNoBoardReason(draft.noBoardReason)
          if (typeof draft.boardCount === "number") setBoardCount(draft.boardCount)
          if (typeof draft.boardLocation === "string") setBoardLocation(draft.boardLocation)
          if (typeof draft.boardReason === "string") setBoardReason(draft.boardReason)
          if (draft.hasMinutesBook) setHasMinutesBook(draft.hasMinutesBook)
          if (typeof draft.noMinutesBookReason === "string") setNoMinutesBookReason(draft.noMinutesBookReason)
          if (typeof draft.receiverName === "string") setReceiverName(draft.receiverName)
          if (typeof draft.receiverRole === "string") setReceiverRole(draft.receiverRole)
          if (typeof draft.receiverPhone === "string") setReceiverPhone(draft.receiverPhone)
          if (typeof draft.minutesBookNotes === "string") setMinutesBookNotes(draft.minutesBookNotes)
        }
      }
    } catch {
      // إذا كانت المسودة تالفة، يبدأ النموذج بقيمه الافتراضية دون تعطيل الصفحة.
    } finally {
      setDraftRestored(true)
    }
  }, [])

  // حفظ تلقائي للمسودة عند تعديل الحقول؛ الملفات المرفقة لا تدخل في التخزين المحلي.
  useEffect(() => {
    if (!draftRestored) return
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(
          "field-management-current-draft-v1",
          JSON.stringify({ ...buildFieldPayload(), savedAt: new Date().toISOString(), status: "مسودة" }),
        )
      } catch {
        // لا نعرض تنبيهاً متكرراً أثناء الكتابة.
      }
    }, 700)
    return () => window.clearTimeout(timer)
  }, [
    draftRestored, awarenessMode, projectType, searchNo, searchName, selectedProject, awarenessExecuter, awarenessDate, awarenessPlace,
    awarenessDescription, activitySubject, activityObjective, activityDuration, directBeneficiaries,
    indirectBeneficiaries, repeatedSessions, brochuresCount, postersCount, brochuresTarget, postersLocation,
    hasCommunityCommittee, committeeNoReason, isCommitteeTrained, committeeNotTrainedReason,
    committeeTrainer, committeeType, trainingDate, trainingPlace, trainingDescription, presentMembers,
    absentMembers, projectTeam, hasBox, noBoxReason, boxCount, boxNumber, boxHangDate, boxLocation,
    boxChoiceReason, boxChooserName, hasBoard, noBoardReason, boardCount, boardLocation, boardReason,
    hasMinutesBook, noMinutesBookReason, receiverName, receiverRole, receiverPhone, minutesBookNotes,
  ])

  const formProps = {
    awarenessMode, setAwarenessMode, projectType, setProjectType,
    searchNo, setSearchNo, searchName, setSearchName, selectedProject, filteredProjects, handleSelectProject,
    awarenessExecuter, setAwarenessExecuter, awarenessDate, setAwarenessDate, awarenessPlace, setAwarenessPlace,
    awarenessDescription, setAwarenessDescription, activitySubject, setActivitySubject,
    activityObjective, setActivityObjective, activityDuration, setActivityDuration,
    directBeneficiaries, setDirectBeneficiaries, indirectBeneficiaries, setIndirectBeneficiaries,
    repeatedSessions, setRepeatedSessions, totalCalculatedMales, totalCalculatedFemales, totalBeneficiaries,
    brochuresCount, setBrochuresCount, postersCount, setPostersCount, brochuresTarget, setBrochuresTarget,
    postersLocation, setPostersLocation, hasCommunityCommittee, setHasCommunityCommittee,
    committeeNoReason, setCommitteeNoReason, committeeNotTrainedReason, setCommitteeNotTrainedReason,
    isCommitteeTrained, setIsCommitteeTrained, committeeTrainer, setCommitteeTrainer, committeeType, setCommitteeType,
    trainingDate, setTrainingDate, trainingPlace, setTrainingPlace, trainingDescription, setTrainingDescription,
    presentMembers, setPresentMembers, absentMembers, setAbsentMembers, projectTeam, setProjectTeam,
    presentMales, presentFemales, absentMales, absentFemales,
    hasBox, setHasBox, noBoxReason, setNoBoxReason, boxCount, setBoxCount, boxNumber, setBoxNumber,
    boxHangDate, setBoxHangDate, boxLocation, setBoxLocation, boxChoiceReason, setBoxChoiceReason,
    boxChooserName, setBoxChooserName, hasBoard, setHasBoard, noBoardReason, setNoBoardReason,
    boardCount, setBoardCount, boardLocation, setBoardLocation, boardReason, setBoardReason,
    hasMinutesBook, setHasMinutesBook, noMinutesBookReason, setNoMinutesBookReason,
    receiverName, setReceiverName, receiverRole, setReceiverRole, receiverPhone, setReceiverPhone,
    minutesBookNotes, setMinutesBookNotes, setCurrentView, handleFinalSave,
  }

  const filteredProjectsList = projectsList.filter(p => {
    if (filterCardStatus === "all") return true
    if (filterCardStatus === "done") return p.status.includes("تمت")
    if (filterCardStatus === "pending") return p.status.includes("لم تتم")
    return true
  })

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4 dir-rtl text-right font-sans text-xs">
      
      {/* رأس الصفحة الرئيسي */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row justify-between items-center gap-3 border-l-4 border-l-blue-900">
        <div>
          <h1 className="text-lg font-black text-slate-900">الإدارة الميدانية وتوثيق التوعية</h1>
          <p className="text-[11px] text-slate-500">مؤشرات إحاطة التوعية للمشاريع، التوعية الأساسية وتكرار التوعية</p>
        </div>
        
        <div className="flex items-center gap-2">
          {currentView === "dashboard" ? (
            <Button onClick={() => handleOpenForm(undefined, "أساسية")} className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2 text-xs rounded-xl shadow-sm">
              + إدخال تقرير جديد
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button onClick={handleQuickSave} variant="outline" size="sm" className="text-xs bg-amber-50 text-amber-900 border-amber-300">
                ⚡ حفظ أولية سريعة
              </Button>
              <Button onClick={() => setCurrentView("dashboard")} variant="outline" size="sm" className="text-xs bg-slate-100">
                ← العودة لوحة الإحصائيات
              </Button>
            </div>
          )}
        </div>
      </div>

      {currentView === "dashboard" ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-900">
            تنبيه: أرقام المؤشرات وقائمة المشاريع المعروضة في لوحة المتابعة بيانات تجريبية من التصميم، وليست إحصاءات مستخرجة من قاعدة البيانات.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card onClick={() => setFilterCardStatus("all")} className="border bg-blue-50/40 cursor-pointer hover:border-blue-500 transition-all shadow-sm">
              <CardContent className="p-4 flex flex-col justify-between">
                <span className="text-slate-600 font-bold">إجمالي المشاريع المسجلة</span>
                <span className="text-2xl font-black text-blue-900 mt-2">508 مشروع</span>
                <span className="text-[10px] text-blue-700 mt-1">انقر لعرض القائمة الكاملة</span>
              </CardContent>
            </Card>

            <Card onClick={() => setFilterCardStatus("done")} className="border bg-emerald-50/40 cursor-pointer hover:border-emerald-500 transition-all shadow-sm">
              <CardContent className="p-4 flex flex-col justify-between">
                <span className="text-emerald-800 font-bold">مشاريع تمت توعيتها</span>
                <span className="text-2xl font-black text-emerald-900 mt-2">245 مشروع</span>
                <span className="text-[10px] text-emerald-700 mt-1">انقر لعرض المشاريع المنجزة</span>
              </CardContent>
            </Card>

            <Card onClick={() => setFilterCardStatus("pending")} className="border bg-amber-50/40 cursor-pointer hover:border-amber-500 transition-all shadow-sm">
              <CardContent className="p-4 flex flex-col justify-between">
                <span className="text-amber-800 font-bold">مشاريع لم تتم توعيتها بعد</span>
                <span className="text-2xl font-black text-amber-900 mt-2">263 مشروع</span>
                <span className="text-[10px] text-amber-700 mt-1">انقر لعرض المشاريع غير المنجزة</span>
              </CardContent>
            </Card>
          </div>

          <Card className="border bg-white shadow-sm">
            <CardHeader className="bg-slate-50 border-b py-3 flex flex-row justify-between items-center">
              <CardTitle className="text-xs font-bold text-slate-900">
                {filterCardStatus === "done" ? "قائمة المشاريع التي تمت توعيتها (245 مشروع)" : filterCardStatus === "pending" ? "قائمة المشاريع التي لم تتم توعيتها (263 مشروع)" : "جدول متابعة حالة التوعية للمشاريع وإدخال التقارير"}
              </CardTitle>
              {filterCardStatus && (
                <Button onClick={() => setFilterCardStatus(null)} size="sm" variant="ghost" className="text-xs text-blue-900 font-bold">
                  إلغاء الفلترة ✕
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-4 overflow-x-auto">
              <table className="w-full text-right text-[11px]">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="p-2 border-l">رقم المشروع</th>
                    <th className="p-2 border-l">اسم المشروع</th>
                    <th className="p-2 border-l">حالة التوعية</th>
                    <th className="p-2 border-l">تاريخ آخر توعية</th>
                    <th className="p-2 text-center">الإجراءات والعمليات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjectsList.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-slate-50">
                      <td className="p-2 border-l font-mono font-bold text-blue-900">{item.id}</td>
                      <td className="p-2 border-l">{item.name}</td>
                      <td className="p-2 border-l">
                        <span className={`px-2 py-0.5 rounded font-bold ${item.status.includes("تمت") ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-2 border-l font-mono">{item.date}</td>
                      <td className="p-2 text-center space-x-2 space-x-reverse">
                        <Button onClick={() => handleOpenForm(item, "أساسية")} size="sm" variant="outline" className="text-[10px] h-7 bg-blue-50 text-blue-900 border-blue-300">
                          + إدخال توعية أساسية
                        </Button>
                        <Button onClick={() => handleOpenForm(item, "تكرار")} size="sm" variant="outline" className="text-[10px] h-7 bg-indigo-50 text-indigo-900 border-indigo-300">
                          🔄 تكرار التوعية
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <FieldFormContent {...formProps} />
      )}

    </div>
  )
}