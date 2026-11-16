"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { useStore } from "@/lib/store"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {
  Field,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/form/fields"

import {
  LocationPicker,
  type LocationValue,
} from "@/components/form/location-picker"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  OPERATION_TYPES,
  CHANNELS,
  GENDERS,
  CAPACITIES,
  BRANCHES,
} from "@/lib/data/constants"

import { projectsForProvince } from "@/lib/data/projects"
import { cn } from "@/lib/utils"

import { Check, ChevronLeft } from "lucide-react"

const STEPS = [
  "بيانات مقدّم الطلب",
  "تفاصيل العملية والموقع",
  "المشروع والمرفقات",
]

export function OperationForm() {
  const router = useRouter()

  const { addOperation, branchName } = useStore()

  const lockProvince = useMemo(() => {
    const b = Object.values(BRANCHES).find(
      (x) => x.name === branchName,
    )

    return b?.fixedProvince
  }, [branchName])

  const [step, setStep] = useState(0)

  const [type, setType] = useState<string>("شكوى")
  const [channel, setChannel] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [altPhone, setAltPhone] = useState("")
  const [gender, setGender] = useState("")
  const [capacity, setCapacity] = useState("")
  const [against, setAgainst] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")

  const [loc, setLoc] = useState<LocationValue>({
    province: lockProvince ?? "",
    directorate: "",
    isolation: "",
    village: "",
  })

  const [projectNumber, setProjectNumber] = useState("")

  const projectOptions = projectsForProvince(
    loc.province || lockProvince,
  )

  function validateStep(current: number): string | null {
    if (current === 0) {
      if (!channel) {
        return "يرجى اختيار قناة الاستقبال."
      }

      if (!name.trim()) {
        return "يرجى إدخال اسم مقدّم الطلب."
      }

      if (!phone.trim()) {
        return "يرجى إدخال رقم الهاتف."
      }
    }

    if (current === 1) {
      if (!loc.province) {
        return "يرجى اختيار المحافظة."
      }

      if (!subject.trim()) {
        return "يرجى إدخال موضوع العملية."
      }
    }

    return null
  }

  function next() {
    const err = validateStep(step)

    if (err) {
      toast.error(err)
      return
    }

    setStep((s) =>
      Math.min(s + 1, STEPS.length - 1),
    )
  }

  function submit() {
    for (let i = 0; i < STEPS.length; i++) {
      const err = validateStep(i)

      if (err) {
        setStep(i)
        toast.error(err)
        return
      }
    }

    const project = projectOptions.find(
      (p) => p.number === projectNumber,
    )

    const op = addOperation({
      type: type as (typeof OPERATION_TYPES)[number],
      channel,
      name: name.trim(),
      phone: phone.trim(),
      altPhone: altPhone.trim() || undefined,
      gender,
      capacity,
      against: against.trim() || undefined,
      province: loc.province,
      directorate: loc.directorate,
      isolation: loc.isolation,
      village: loc.village,
      subject: subject.trim(),
      description: description.trim(),
      projectNumber: projectNumber || undefined,
      projectName: project?.arabic,
    })

    toast.success(
      `تم تسجيل العملية برقم ${op.operationNo}`,
    )

    router.push(`/operations/${op.id}`)
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Stepper */}
      <ol className="mb-6 flex items-center gap-2">
        {STEPS.map((label, i) => {
          const done = i < step
          const active = i === step

          return (
            <li
              key={label}
              className="flex flex-1 items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    active &&
                      "bg-primary text-primary-foreground",
                    done &&
                      "bg-chart-3 text-white",
                    !active &&
                      !done &&
                      "bg-muted text-muted-foreground",
                  )}
                >
                  {done ? (
                    <Check className="size-4" />
                  ) : (
                    i + 1
                  )}
                </span>

                <span
                  className={cn(
                    "hidden text-sm font-medium sm:block",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </div>

              {i < STEPS.length - 1 && (
                <div className="h-px flex-1 bg-border" />
              )}
            </li>
          )
        })}
      </ol>

      <Card className="border-border/60">
        <CardContent className="pt-6">
          {step === 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="نوع العملية" required>
                <Select
                  value={type}
                  onValueChange={(value) =>
                    setType(value ?? "")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {OPERATION_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <SelectField
                label="قناة الاستقبال"
                required
                value={channel}
                options={CHANNELS}
                onChange={setChannel}
              />

              <TextField
                label="اسم مقدّم الطلب"
                required
                value={name}
                onChange={setName}
                placeholder="الاسم الكامل"
              />

              <TextField
                label="رقم الهاتف"
                required
                value={phone}
                onChange={setPhone}
                placeholder="7xxxxxxxx"
              />

              <TextField
                label="رقم هاتف بديل"
                value={altPhone}
                onChange={setAltPhone}
                placeholder="اختياري"
              />

              <SelectField
                label="الجنس"
                value={gender}
                options={GENDERS}
                onChange={setGender}
              />

              <SelectField
                label="الصفة"
                value={capacity}
                options={CAPACITIES}
                onChange={setCapacity}
              />

              <TextField
                label="الجهة المشتكى عليها"
                value={against}
                onChange={setAgainst}
                placeholder="اختياري"
              />
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-5">
              <LocationPicker
                value={loc}
                onChange={setLoc}
                lockProvince={lockProvince}
              />

              <TextField
                label="موضوع العملية"
                required
                value={subject}
                onChange={setSubject}
                placeholder="عنوان مختصر للعملية"
              />

              <TextAreaField
                label="الوصف التفصيلي"
                value={description}
                onChange={setDescription}
                placeholder="اشرح تفاصيل الشكوى أو البلاغ..."
                rows={5}
              />
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <Field
                label="المشروع المرتبط"
                hint="يتم عرض المشاريع بحسب محافظة العملية"
              >
                <Select
                  value={projectNumber || undefined}
                  onValueChange={(value) =>
                    setProjectNumber(value ?? "")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المشروع (اختياري)" />
                  </SelectTrigger>

                  <SelectContent>
                    {projectOptions.map((p) => (
                      <SelectItem
                        key={p.number}
                        value={p.number}
                      >
                        {p.arabic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field
                label="المرفقات"
                hint="يمكن ربط المرفقات لاحقًا من صفحة تفاصيل العملية"
              >
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  سيتم تفعيل رفع المرفقات عند ربط التخزين السحابي
                </div>
              </Field>

              <div className="rounded-lg bg-secondary p-4 text-sm">
                <p className="font-medium text-foreground">
                  ملخص العملية
                </p>

                <ul className="mt-2 grid grid-cols-1 gap-1 text-muted-foreground sm:grid-cols-2">
                  <li>النوع: {type}</li>
                  <li>القناة: {channel || "-"}</li>
                  <li>مقدّم الطلب: {name || "-"}</li>
                  <li>المحافظة: {loc.province || "-"}</li>

                  <li className="sm:col-span-2">
                    الموضوع: {subject || "-"}
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                setStep((s) => Math.max(s - 1, 0))
              }
              disabled={step === 0}
            >
              السابق
            </Button>

            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={next}
                className="gap-1"
              >
                التالي
                <ChevronLeft className="size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={submit}
                className="gap-1"
              >
                <Check className="size-4" />
                حفظ العملية
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}