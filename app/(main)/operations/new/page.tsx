"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const MASTER_CHANNELS = [
  "مواقع التواصل الاجتماعي", "صناديق الشكاوى", "رابط الشكاوى", "مركز الاتصال",
  "الرسائل النصية", "البريد الإلكتروني", "الموقع الالكتروني", "الحضور الشخصي", "الفاكس", "تطبيق الهاتف", "أخرى"
]

const MASTER_CAPACITIES = ["مستفيد", "استشاري", "أخرى", "مورد", "مقاول", "مثقفة"]

type CategoryHierarchy = Record<string, Record<string, string[]>>

type RegisteredMinutes = {
  minutesId: string
  boxId: string
  projectId: string
  projectName: string
  sector?: string
  funder?: string
  officer: string
}

// لا تُعرض محاضر تجريبية؛ تُملأ القائمة فقط عند ربط سجل المحاضر الفعلي.


type ReferenceLocation = {
  governorate: string
  directorate: string
  subDistrict: string
  village: string
}

type ReferenceProject = {
  projectNumber: string
  projectName: string
  branch: string
  data?: Record<string, unknown> | null
}

export default function NewOperationPage() {
  const router = useRouter()
  const { refreshOperations } = useStore()

  const [step, setStep] = useState(1)
  const [savingOperation, setSavingOperation] = useState(false)
  const [type, setType] = useState("")
  const [channel, setChannel] = useState("")
  const [name, setName] = useState("")
  const [gender, setGender] = useState("")
  const [capacity, setCapacity] = useState("")
  const [phone, setPhone] = useState("")
  const [altPhone, setAltPhone] = useState("")
  const [email, setEmail] = useState("")
  const [accusedPerson, setAccusedPerson] = useState("")

  const [province, setProvince] = useState("")
  const [referenceLocations, setReferenceLocations] = useState<ReferenceLocation[]>([])
  const [referenceProjects, setReferenceProjects] = useState<ReferenceProject[]>([])
  const [locationsLoading, setLocationsLoading] = useState(true)
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [locationsError, setLocationsError] = useState("")
  const [projectsError, setProjectsError] = useState("")
  const [directorate, setDirectorate] = useState("")
  const [isolation, setIsolation] = useState("")
  const [village, setVillage] = useState("")

  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [additionalData, setAdditionalData] = useState("")
  const [attachment1, setAttachment1] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  // حقل رقم المحضر المربوط بصندوق الشكاوى
  const [selectedMinutesId, setSelectedMinutesId] = useState("")
  const [autoFetchedMinutesData, setAutoFetchedMinutesData] = useState<RegisteredMinutes | null>(null)
  const [registeredMinutesDatabase, setRegisteredMinutesDatabase] = useState<RegisteredMinutes[]>([])

  // المرحلة الثانية
  const [mainClass, setMainClass] = useState("")
  const [subClass, setSubClass] = useState("")
  const [subClass2, setSubClass2] = useState("")
  const [categoryHierarchy, setCategoryHierarchy] = useState<CategoryHierarchy>({})
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState("")
  const [sensitivity, setSensitivity] = useState("منخفضة الحساسية")
  const [priority, setPriority] = useState("عادية (افتراضي)")
  const [searchNo, setSearchNo] = useState("")
  const [searchName, setSearchName] = useState("")
  const [referredTo, setReferredTo] = useState("")
  const [internalReply, setInternalReply] = useState("")
  const [attachment2, setAttachment2] = useState<File | null>(null)

  // المرحلة الثالثة
  const [finalClosingText, setFinalClosingText] = useState("")
  const [closingChannel, setClosingChannel] = useState("")
  const [replyMessage, setReplyMessage] = useState("")
  const [attachment3, setAttachment3] = useState<File | null>(null)
  const [finalEvaluation, setFinalEvaluation] = useState("")
  const [requiresAnalysis, setRequiresAnalysis] = useState("نعم")

  const isSimpleType = ["استعلام", "مقترح", "طلب", "إطراء"].includes(type)
  const isComplaintsBox = channel === "صناديق الشكاوى"
  const isReferred = referredTo.trim().length > 0

  const stage1StatusName = attachment1 ? "جديدة" : "مستلمة"
  const stage2StatusName = isReferred ? "التصنيف والإحالة" : "التصنيف والمعالجة"

  const availableProvinces = Array.from(new Set(referenceLocations.map((row) => row.governorate).filter(Boolean)))
  const availableDirectorates = Array.from(new Set(referenceLocations.filter((row) => row.governorate === province).map((row) => row.directorate).filter(Boolean)))
  const availableIsolations = Array.from(new Set(referenceLocations.filter((row) => row.governorate === province && row.directorate === directorate).map((row) => row.subDistrict).filter(Boolean)))
  const availableVillages = Array.from(new Set(referenceLocations.filter((row) => row.governorate === province && row.directorate === directorate && row.subDistrict === isolation).map((row) => row.village).filter(Boolean)))

  const availableSubClasses = mainClass && categoryHierarchy[mainClass] ? Object.keys(categoryHierarchy[mainClass]) : []
  const availableSubClass2s = mainClass && subClass && categoryHierarchy[mainClass]?.[subClass] ? categoryHierarchy[mainClass][subClass] : []

  useEffect(() => {
    let cancelled = false
    async function loadCategories() {
      setCategoriesLoading(true)
      setCategoriesError("")
      try {
        const response = await fetch("/api/reference-data/categories", { credentials: "same-origin", cache: "no-store" })
        const result = await response.json()
        if (!response.ok || !result.success) throw new Error(result.message || "تعذر تحميل التصنيفات.")
        if (!cancelled) setCategoryHierarchy(result.categories ?? {})
      } catch (error) {
        if (!cancelled) setCategoriesError(error instanceof Error ? error.message : "تعذر تحميل التصنيفات.")
      } finally {
        if (!cancelled) setCategoriesLoading(false)
      }
    }
    void loadCategories()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function loadReferenceData() {
      setLocationsLoading(true)
      setProjectsLoading(true)
      setLocationsError("")
      setProjectsError("")
      const [locationsResult, projectsResult] = await Promise.allSettled([
        fetch("/api/reference/locations", { credentials: "same-origin", cache: "no-store" }).then(async (response) => {
          const result = await response.json()
          if (!response.ok) throw new Error(result.error || "تعذر تحميل المواقع.")
          return (result.locations ?? []) as ReferenceLocation[]
        }),
        fetch("/api/reference/projects", { credentials: "same-origin", cache: "no-store" }).then(async (response) => {
          const result = await response.json()
          if (!response.ok) throw new Error(result.error || "تعذر تحميل المشاريع.")
          return (result.projects ?? []) as ReferenceProject[]
        }),
      ])
      if (cancelled) return
      if (locationsResult.status === "fulfilled") setReferenceLocations(locationsResult.value)
      else setLocationsError(locationsResult.reason instanceof Error ? locationsResult.reason.message : "تعذر تحميل المواقع المرجعية.")
      if (projectsResult.status === "fulfilled") setReferenceProjects(projectsResult.value)
      else setProjectsError(projectsResult.reason instanceof Error ? projectsResult.reason.message : "تعذر تحميل المشاريع المرجعية.")
      setLocationsLoading(false)
      setProjectsLoading(false)
    }
    void loadReferenceData()
    return () => { cancelled = true }
  }, [])

  const selectedProject = referenceProjects.find((p) => p.projectNumber === searchNo) ?? null

  useEffect(() => {
    let cancelled = false
    fetch("/api/complaint-boxes", { credentials: "same-origin", cache: "no-store" })
      .then(async (response) => {
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || "تعذر تحميل محاضر الفتح")
        return Array.isArray(result.minutes) ? result.minutes : []
      })
      .then((minutes) => {
        if (!cancelled) setRegisteredMinutesDatabase(minutes.map((minute: any) => ({
          minutesId: minute.minuteNumber, boxId: minute.boxNumber, projectId: minute.projectNumber,
          projectName: minute.projectName, officer: minute.openingCommittee || "",
        })))
      })
      .catch((error) => { if (!cancelled) console.error("تعذر تحميل محاضر الفتح", error) })
    return () => { cancelled = true }
  }, [])

  const filteredProjects = referenceProjects.filter((p) => {
    const matchNo = searchNo ? p.projectNumber.includes(searchNo) : true
    const matchName = searchName ? p.projectName.includes(searchName) : true
    return matchNo && matchName
  })

  useEffect(() => {
    if (name) {
      const prefix = gender === "أنثى" ? "الأخت/" : "الأخ/"
      setReplyMessage(`${prefix} ${name} المحترم، بعد الاطلاع على مضمون الشكوى تم اتخاذ اللازم وإغلاق العملية بنجاح.\n\nشكراً لتواصلكم مع إدارة الشكاوى والبلاغات في الصندوق الاجتماعي للتنمية.`)
    }
  }, [name, gender])

  const handleSelectMinutes = (minutesId: string) => {
    setSelectedMinutesId(minutesId)
    if (!minutesId) {
      setAutoFetchedMinutesData(null)
      setSearchNo("")
      setSearchName("")
      setReferredTo("")
      return
    }

    const found = registeredMinutesDatabase.find(m => m.minutesId === minutesId)
    if (found) {
      setAutoFetchedMinutesData(found)
      setSearchNo(found.projectId)
      setSearchName(found.projectName)
      setReferredTo(found.officer)
      toast.success(`تم استجلاب بيانات المشروع والصندوق آلياً عبر المحضر: ${found.minutesId}`)
    }
  }

  const validateStep1 = () => {
    const newErrors: Record<string, boolean> = {}
    if (!type) newErrors.type = true
    if (!channel) newErrors.channel = true
    if (!name) newErrors.name = true
    if (!gender) newErrors.gender = true
    if (!capacity) newErrors.capacity = true
    if (!phone || phone.length !== 9) newErrors.phone = true
    if (!province) newErrors.province = true
    if (!directorate) newErrors.directorate = true
    if (!isolation) newErrors.isolation = true
    if (!village) newErrors.village = true
    if (!subject) newErrors.subject = true
    if (!description) newErrors.description = true

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      toast.error("يرجى تعبئة جميع الحقول الإلزامية المحددة باللون الأحمر.")
      return false
    }
    if ((type === "شكوى" || type === "بلاغ") && !attachment1) {
      toast.error("عذراً، لا يُسمح الانتقال للمرحلة الثانية للشكاوى والبلاغات بدون إدراج مرفق الاستقبال.")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (isSimpleType) return true

    if (isComplaintsBox && !selectedMinutesId) {
      toast.error("قناة الاستقبال هي صندوق الشكاوى، ويجب اختيار رقم محضر معتمد من القائمة!")
      return false
    }

    if (!mainClass || !subClass || (availableSubClass2s.length > 0 && !subClass2)) {
      toast.error("يرجى استكمال تحديد كافة التصنيفات للشكاوى والبلاغات.")
      return false
    }
    if ((type === "شكوى" || type === "بلاغ") && !attachment2) {
      toast.error("يرجى إرفاق مستند الإحالة أو المعالجة قبل الانتقال إلى المرحلة الثالثة.")
      return false
    }
    if (!internalReply.trim()) {
      toast.error("يرجى إدخال نص الرد الداخلي للعملية.")
      return false
    }
    return true
  }

  const handleSelectProject = (proj: ReferenceProject) => {
    setSearchNo(proj.projectNumber)
    setSearchName(proj.projectName)
    setReferredTo(String(proj.data?.["ضابط المشروع"] ?? "").trim())
    toast.success(`تم اختيار المشروع من قاعدة البيانات: ${proj.projectNumber}`)
  }

  const handleFinalSave = async () => {
    const computedStatus = type === "إطراء" ? "مغلقة" : stage1StatusName
    const computedEvaluation = isSimpleType ? "محقة" : finalEvaluation
    const form = new FormData()
    const fields: Record<string, string> = {
      type, channel, name, gender, capacity, phone, altPhone, email, accusedPerson,
      province, directorate, isolation, village, subject, description, additionalData,
      mainClass: isSimpleType ? type : mainClass, subClass, subClass2, sensitivity, priority,
      projectNo: searchNo, projectName: searchName, referredTo, internalReply,
      minutesNo: selectedMinutesId,
      finalClosingText: isSimpleType ? "معالجة تلقائية عملية مبسطة" : finalClosingText,
      closingChannel: closingChannel || "الرسائل النصية", replyMessage,
      finalEvaluation: computedEvaluation, requiresAnalysis: isSimpleType ? "لا" : requiresAnalysis,
      status: computedStatus,
    }
    Object.entries(fields).forEach(([key, value]) => form.set(key, value || ""))
    if (attachment1) form.set("attachment1", attachment1)
    if (attachment2) form.set("attachment2", attachment2)
    if (attachment3) form.set("attachment3", attachment3)

    setSavingOperation(true)
    try {
      const response = await fetch("/api/operations", { method: "POST", body: form })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || "تعذر حفظ العملية")
      await refreshOperations()
      toast.success(`تم حفظ العملية ${body.operation?.operationNo || ""} في قاعدة البيانات بنجاح. الحالة: "${computedStatus}"`)
      router.push("/operations")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر حفظ العملية في قاعدة البيانات.")
    } finally {
      setSavingOperation(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 dir-rtl text-right font-sans">
      <div className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center border-l-4 border-l-blue-900">
        <div>
          <h1 className="text-lg font-bold text-slate-900">إدارة العمليات — إدخال عملية جديدة</h1>
          <p className="text-xs text-slate-500 mt-1">الفرع والصلاحيات مرتبطان بحساب المستخدم — قواعد الضبط والربط التلقائي بمحاضر الفتح</p>
        </div>
        <div className="flex gap-2 text-xs font-bold">
          <span className={`px-3 py-1 rounded-lg ${step === 1 ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'}`}>1. البيانات الأساسية</span>
          <span className={`px-3 py-1 rounded-lg ${step === 2 ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'}`}>2. التصنيف والمعالجة</span>
          <span className={`px-3 py-1 rounded-lg ${step === 3 ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'}`}>3. الرد والإغلاق</span>
        </div>
      </div>

      {step === 1 && (
        <Card className="border shadow-sm bg-white">
          <CardHeader className="bg-slate-50 py-3 border-b">
            <CardTitle className="text-sm font-bold text-slate-900">
              الحالة: البيانات الأساسية للعملية ({stage1StatusName}) {type && <span className="text-blue-800 text-xs font-normal">[النوع: {type}]</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">نوع العملية *</label>
                <select value={type} onChange={(e) => { setType(e.target.value); setErrors({...errors, type: false}) }} className={`w-full p-2 border rounded-lg bg-white ${errors.type ? 'border-red-500 bg-red-50' : ''}`}>
                  <option value="">-- اختر النوع --</option>
                  <option value="شكوى">شكوى</option>
                  <option value="بلاغ">بلاغ</option>
                  <option value="استعلام">استعلام</option>
                  <option value="مقترح">مقترح</option>
                  <option value="طلب">طلب</option>
                  <option value="إطراء">إطراء</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">قناة الاستقبال *</label>
                <select value={channel} onChange={(e) => { setChannel(e.target.value); setErrors({...errors, channel: false}) }} className={`w-full p-2 border rounded-lg bg-white ${errors.channel ? 'border-red-500 bg-red-50' : ''}`}>
                  <option value="">-- اختر القناة --</option>
                  {MASTER_CHANNELS.map(ch => <option key={ch} value={ch}>{ch}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">اسم مقدم العملية *</label>
                <Input value={name} onChange={(e) => { setName(e.target.value); setErrors({...errors, name: false}) }} placeholder="الاسم الثلاثي" className={errors.name ? 'border-red-500 bg-red-50' : ''} />
              </div>
              <div>
                <label className="block font-semibold mb-1">الجنس *</label>
                <select value={gender} onChange={(e) => { setGender(e.target.value); setErrors({...errors, gender: false}) }} className={`w-full p-2 border rounded-lg bg-white ${errors.gender ? 'border-red-500 bg-red-50' : ''}`}>
                  <option value="">-- اختر الجنس --</option>
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">صفة الشاكي *</label>
                <select value={capacity} onChange={(e) => { setCapacity(e.target.value); setErrors({...errors, capacity: false}) }} className={`w-full p-2 border rounded-lg bg-white ${errors.capacity ? 'border-red-500 bg-red-50' : ''}`}>
                  <option value="">-- اختر الصفة --</option>
                  {MASTER_CAPACITIES.map(cap => <option key={cap} value={cap}>{cap}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">رقم الهاتف (9 أرقام) *</label>
                <Input value={phone} onChange={(e) => { setPhone(e.target.value); setErrors({...errors, phone: false}) }} placeholder="7xxxxxxxx" maxLength={9} className={errors.phone ? 'border-red-500 bg-red-50' : ''} />
              </div>
              <div>
                <label className="block font-semibold mb-1">هاتف آخر (اختياري)</label>
                <Input value={altPhone} onChange={(e) => setAltPhone(e.target.value)} placeholder="رقم إضافي" />
              </div>
              <div>
                <label className="block font-semibold mb-1">البريد الإلكتروني (اختياري)</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@domain.com" />
              </div>
            </div>

            {/* بيانات الموقع */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border">
              <div>
                <label className="block font-semibold mb-1">المحافظة</label>
                <select value={province} onChange={(e) => { setProvince(e.target.value); setDirectorate(""); setIsolation(""); setVillage(""); setErrors({...errors, province: false, directorate: false, isolation: false, village: false}) }} disabled={locationsLoading || availableProvinces.length === 0} className={`w-full p-2 border rounded-lg bg-white ${errors.province ? "border-red-500 bg-red-50" : ""}`}>
                  <option value="">{locationsLoading ? "جارٍ تحميل المحافظات..." : "-- اختر المحافظة --"}</option>
                  {availableProvinces.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                {locationsError && <p className="text-xs text-red-600 mt-1">{locationsError}</p>}
                {!locationsLoading && !locationsError && availableProvinces.length === 0 && <p className="text-xs text-amber-700 mt-1">لا توجد مواقع نشطة في قاعدة البيانات.</p>}
              </div>
              <div>
                <label className="block font-semibold mb-1">المديرية *</label>
                <select value={directorate} disabled={!province || locationsLoading} onChange={(e) => { setDirectorate(e.target.value); setIsolation(""); setVillage(""); setErrors({...errors, directorate: false}) }} className={`w-full p-2 border rounded-lg bg-white ${errors.directorate ? 'border-red-500 bg-red-50' : ''}`}>
                  <option value="">-- اختر المديرية --</option>
                  {availableDirectorates.map(dir => <option key={dir} value={dir}>{dir}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">العزلة *</label>
                <select value={isolation} disabled={!directorate || locationsLoading} onChange={(e) => { setIsolation(e.target.value); setVillage(""); setErrors({...errors, isolation: false}) }} className={`w-full p-2 border rounded-lg bg-white ${errors.isolation ? 'border-red-500 bg-red-50' : ''}`}>
                  <option value="">-- اختر العزلة --</option>
                  {availableIsolations.map(iso => <option key={iso} value={iso}>{iso}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">القرية / الحي *</label>
                <select value={village} disabled={!isolation || locationsLoading} onChange={(e) => { setVillage(e.target.value); setErrors({...errors, village: false}) }} className={`w-full p-2 border rounded-lg bg-white ${errors.village ? 'border-red-500 bg-red-50' : ''}`}>
                  <option value="">-- اختر القرية/الحي --</option>
                  {availableVillages.map(vil => <option key={vil} value={vil}>{vil}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">موضوع العملية *</label>
                <Input value={subject} onChange={(e) => { setSubject(e.target.value); setErrors({...errors, subject: false}) }} placeholder="عنوان مختصر" className={errors.subject ? 'border-red-500 bg-red-50' : ''} />
              </div>
              <div>
                <label className="block font-semibold mb-1">ملخص الشكوى / العملية *</label>
                <Textarea rows={3} value={description} onChange={(e) => { setDescription(e.target.value); setErrors({...errors, description: false}) }} placeholder="وصف كامل..." className={errors.description ? 'border-red-500 bg-red-50' : ''} />
              </div>
              <div>
                <label className="block font-semibold mb-1">بيانات إضافية (اختياري)</label>
                <Textarea rows={2} value={additionalData} onChange={(e) => setAdditionalData(e.target.value)} placeholder="أي معلومات أو تفاصيل إضافية يمكن تدوينها هنا، ويمكن ترك الحقل فارغاً..." />
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between">
                <span className="font-bold text-amber-900 text-[11px]">📎 إدراج مرفق الاستقبال (إلزامي للشكاوى والبلاغات)</span>
                <input type="file" onChange={(e) => setAttachment1(e.target.files?.[0] || null)} className="text-[10px] w-48" />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => validateStep1() && setStep(2)} className="bg-blue-900 text-white font-bold">التالي: التصنيف والمعالجة ➔</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="border shadow-sm bg-white">
          <CardHeader className="bg-slate-50 py-3 border-b">
            <CardTitle className="text-sm font-bold">
              المرحلة الثانية · التصنيف والمعالجة {isSimpleType && <span className="text-emerald-700 font-normal">[عملية مبسطة]</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs">
            {!isSimpleType ? (
              <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">التصنيف الرئيسي *</label>
                  <select value={mainClass} disabled={categoriesLoading || Object.keys(categoryHierarchy).length === 0} onChange={(e) => { setMainClass(e.target.value); setSubClass(""); setSubClass2(""); }} className="w-full p-2 border rounded-lg bg-white">
                    <option value="">-- اختر الرئيسي --</option>
                    {Object.keys(categoryHierarchy).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">التصنيف الفرعي *</label>
                  <select value={subClass} disabled={!mainClass || categoriesLoading} onChange={(e) => { setSubClass(e.target.value); setSubClass2(""); }} className="w-full p-2 border rounded-lg bg-white">
                    <option value="">-- اختر الفرعي --</option>
                    {availableSubClasses.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">التصنيف الفرعي الثاني {availableSubClass2s.length > 0 ? "*" : "(غير متاح لهذا التصنيف)"}</label>
                  <select value={subClass2} disabled={!subClass || availableSubClass2s.length === 0} onChange={(e) => setSubClass2(e.target.value)} className="w-full p-2 border rounded-lg bg-white">
                    <option value="">{availableSubClass2s.length > 0 ? "-- اختر الفرعي الثاني --" : "-- لا يوجد تصنيف فرعي ثانٍ --"}</option>
                    {availableSubClass2s.map(sc2 => <option key={sc2} value={sc2}>{sc2}</option>)}
                  </select>
                </div>
              </div>
              {categoriesLoading && <p className="text-slate-500">جارٍ تحميل التصنيفات المعتمدة من قاعدة Neon...</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-xl border bg-slate-50 p-4">
                <div>
                  <label className="mb-1 block font-semibold">الأولوية</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-lg border bg-white p-2">
                    <option value="عاجلة">عاجلة</option><option value="عالية">عالية</option><option value="عادية (افتراضي)">عادية</option><option value="منخفضة">منخفضة</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold">درجة الحساسية</label>
                  <select value={sensitivity} onChange={(e) => setSensitivity(e.target.value)} className="w-full rounded-lg border bg-white p-2">
                    <option value="منخفضة الحساسية">منخفضة الحساسية</option><option value="متوسطة الحساسية">متوسطة الحساسية</option><option value="عالية الحساسية">عالية الحساسية</option>
                  </select>
                </div>
              </div>

              {categoriesError && <p role="alert" className="text-red-700">{categoriesError}</p>}
              </>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-bold">
                ✓ تم تصنيف العملية تلقائياً وتجاوز فقرة التصنيفات المعقدة.
              </div>
            )}

            {/* الربط الإلزامي لمحاضر الفتح إذا كانت القناة هي "صناديق الشكاوى" */}
            <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
              {isComplaintsBox ? (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
                  <span className="font-bold text-blue-900">🔗 ربط العملية بمحضر فتح صندوق معتمد (إلزامي):</span>
                  <div>
                    <label className="block font-semibold mb-1">اختر رقم المحضر من السجل المعتمد *</label>
                    <select value={selectedMinutesId} onChange={(e) => handleSelectMinutes(e.target.value)} className="w-full p-2.5 border rounded-lg bg-white font-bold font-mono text-slate-800">
                      <option value="">-- اختر رقم المحضر المقيد مسبقاً --</option>
                      {registeredMinutesDatabase.map((m: RegisteredMinutes) => (
                        <option key={m.minutesId} value={m.minutesId}>
                          {m.minutesId} | صندوق: {m.boxId} | مشروع: {m.projectId} - {m.projectName}
                        </option>
                      ))}
                    </select>
                    {registeredMinutesDatabase.length === 0 && <p className="mt-2 text-xs text-amber-700">لا توجد محاضر فتح مسجلة في قاعدة البيانات بعد؛ لن تظهر بيانات تجريبية هنا.</p>}
                  </div>

                  {autoFetchedMinutesData && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg grid grid-cols-2 md:grid-cols-3 gap-2 text-emerald-900 font-semibold">
                      <div>• رقم المحضر: <span className="font-mono font-bold">{autoFetchedMinutesData.minutesId}</span></div>
                      <div>• رقم الصندوق: <span className="font-mono font-bold">{autoFetchedMinutesData.boxId}</span></div>
                      <div>• رقم المشروع: <span className="font-mono font-bold">{autoFetchedMinutesData.projectId}</span></div>
                      <div className="col-span-2">• اسم المشروع: <span className="font-bold">{autoFetchedMinutesData.projectName}</span></div>
                      <div>• ضابط المشروع: <span className="font-bold">{autoFetchedMinutesData.officer}</span></div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <label className="block font-bold text-slate-800">بيانات المشاريع (البحث بالرقم أو بالكلمات):</label>
                  <div className="flex flex-col md:flex-row gap-3 items-start">
                    <div className="w-full md:w-36">
                      <label className="block text-[11px] font-semibold mb-1 text-blue-900">رقم المشروع:</label>
                      <Input value={searchNo} onChange={(e) => setSearchNo(e.target.value)} placeholder="رقم المشروع..." className="bg-white font-mono text-xs w-full" />
                    </div>
                    <div className="flex-1 w-full">
                      <label className="block text-[11px] font-semibold mb-1 text-blue-900">اسم المشروع (بحث تفاعلي):</label>
                      <Input value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="اكتب كلمة أو كلمتين للمطابقة..." className="bg-white w-full" />
                    </div>
                  </div>

                  {projectsLoading && <p className="text-xs text-slate-500 mt-2">جارٍ تحميل المشاريع من قاعدة البيانات...</p>}
                  {projectsError && <p className="text-xs text-red-600 mt-2">{projectsError}</p>}
                  {!projectsLoading && !projectsError && referenceProjects.length === 0 && <p className="text-xs text-amber-700 mt-2">لا توجد مشاريع نشطة في قاعدة البيانات حالياً.</p>}
                  {selectedProject && (
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-[11px] text-emerald-950">
                      <div>الممول: <b>{String(selectedProject.data?.["الممول"] || "—")}</b></div>
                      <div>القطاع الرئيسي: <b>{String(selectedProject.data?.["القطاع الرئيسي"] || "—")}</b></div>
                      <div>الوحدة: <b>{String(selectedProject.data?.["الوحدة"] || "—")}</b></div>
                      <div>ضابط المشروع: <b>{String(selectedProject.data?.["ضابط المشروع"] || "—")}</b></div>
                    </div>
                  )}
                  {filteredProjects.length > 0 && (searchNo || searchName) && (
                    <div className="mt-2 max-h-36 overflow-y-auto border bg-white rounded-lg p-2 space-y-1">
                      {filteredProjects.map(p => (
                        <div key={p.projectNumber} onClick={() => handleSelectProject(p)} className="p-2 hover:bg-blue-50 cursor-pointer rounded flex justify-between items-center text-[11px]">
                          <span className="font-bold font-mono text-blue-900">{p.projectNumber}</span>
                          <span className="truncate max-w-md">{p.projectName}</span>
                          <span className="text-slate-400 font-normal">[{p.branch || "—"}]</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {!isSimpleType && (
              <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
                <div>
                  <label className="block font-semibold mb-1">الإحالة إلى / ضابط المشروع (يستجلب تلقائياً)</label>
                  <Input value={referredTo} onChange={(e) => setReferredTo(e.target.value)} placeholder="اسم ضابط المشروع المسند إليه..." className="bg-white font-bold" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">نص الرد الداخلي *</label>
                  <Textarea rows={3} value={internalReply} onChange={(e) => setInternalReply(e.target.value)} placeholder="إفادة المعني بالرد..." />
                </div>
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-blue-900 text-[11px]">📎 إدراج مرفق الرد الداخلي / المعالجة</span>
                  <input type="file" onChange={(e) => setAttachment2(e.target.files?.[0] || null)} className="text-[10px] w-48" />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>السابق</Button>
              <Button onClick={() => { if(validateStep2()) { if(type === "إطراء") { void handleFinalSave(); } else { setStep(3); } } }} disabled={savingOperation} className="bg-blue-900 text-white font-bold">
                {type === "إطراء" ? "حفظ نهائي (إطراء مغلق مباشرة) ✓" : "التالي: الرد والإغلاق ➔"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && type !== "إطراء" && (
        <Card className="border border-emerald-300 shadow-sm bg-white">
          <CardHeader className="bg-emerald-50/60 py-3 border-b border-emerald-200">
            <CardTitle className="text-sm font-bold text-emerald-900">المرحلة الثالثة · الرد النهائي والإغلاق</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">الرد النهائي / نص الإغلاق *</label>
              <Textarea rows={3} value={finalClosingText} onChange={(e) => setFinalClosingText(e.target.value)} placeholder="اكتب نص الرد النهائي للإغلاق..." />
            </div>

            <div>
              <label className="block font-semibold mb-1">قناة إرسال الرد للشاكي *</label>
              <select value={closingChannel} onChange={(e) => setClosingChannel(e.target.value)} className="w-full p-2 border rounded-lg bg-white">
                <option value="">-- اختر قناة الإرسال --</option>
                <option value="مواقع التواصل الاجتماعي">مواقع التواصل الاجتماعي</option>
                <option value="يدي بيد">يدي بيد</option>
                <option value="الرسائل القصيرة">الرسائل القصيرة</option>
                <option value="المعالجة بالميدان">المعالجة بالميدان</option>
                <option value="البريد الإلكتروني">البريد الإلكتروني</option>
                <option value="الفاكس">الفاكس</option>
                <option value="مركز الاتصال">مركز الاتصال</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
              <label className="block font-bold text-blue-900">نص رسالة الرد للشاكي (مؤتمت):</label>
              <Textarea rows={3} value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} className="bg-white" />
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between">
              <span className="font-bold text-amber-900 text-[11px]">📎 إدراج مرفق الإغلاق النهائي</span>
              <input type="file" onChange={(e) => setAttachment3(e.target.files?.[0] || null)} className="text-[10px] w-48" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-semibold mb-1">التقييم *</label>
                <select value={finalEvaluation} onChange={(e) => setFinalEvaluation(e.target.value)} className="w-full p-2 border rounded-lg bg-white">
                  <option value="">-- اختر التقييم --</option>
                  <option value="محقة">محقة</option>
                  <option value="شكوى غير دقيقة">شكوى غير دقيقة</option>
                  <option value="غير محقة">غير محقة</option>
                  <option value="كيدية">كيدية</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>السابق</Button>
              <Button onClick={handleFinalSave} disabled={savingOperation} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6">
                {savingOperation ? "جارٍ الحفظ..." : "حفظ نهائي وإغلاق العملية ✓"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}