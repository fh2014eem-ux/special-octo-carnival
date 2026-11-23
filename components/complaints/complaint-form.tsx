"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Loader2 } from "lucide-react"
import { createComplaintRequest } from "@/lib/api-client"
import { PROJECTS } from "@/lib/data/projects"
import { LOCATIONS } from "@/lib/data/locations"
import { PRIORITY_LABELS, PRIORITY_ORDER } from "@/lib/types"
import { PageHeader } from "@/components/page-header"

const fieldCls =
  "h-11 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"

type ReferenceCategory = {
  primaryCategory: string
  subCategory: string
  secondSubCategory: string
}

export function ComplaintForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [categories, setCategories] = useState<ReferenceCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetch("/api/reference/categories")
      .then(async (response) => {
        if (!response.ok) throw new Error("تعذر تحميل التصنيفات")
        return response.json()
      })
      .then((data: { categories?: ReferenceCategory[] }) => {
        if (active) setCategories(data.categories ?? [])
      })
      .catch(() => {
        if (active) setErrors((current) => ({
          ...current,
          _global: "تعذر تحميل التصنيفات المرجعية. يرجى تحديث الصفحة والمحاولة مجدداً.",
        }))
      })
      .finally(() => {
        if (active) setCategoriesLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const [form, setForm] = useState({
    title: "",
    primaryCategory: "",
    subCategory: "",
    secondSubCategory: "",
    project: PROJECTS[0]?.id || "",
    priority: "MEDIUM",
    description: "",
    location: LOCATIONS[0]?.name || "",
    citizenName: "",
    citizenEmail: "",
    citizenPhone: "",
  })

  const primaryCategories = Array.from(new Set(categories.map((item) => item.primaryCategory)))
  const subCategories = Array.from(new Set(
    categories
      .filter((item) => item.primaryCategory === form.primaryCategory)
      .map((item) => item.subCategory),
  ))
  const secondSubCategories = Array.from(new Set(
    categories
      .filter((item) =>
        item.primaryCategory === form.primaryCategory &&
        item.subCategory === form.subCategory &&
        item.secondSubCategory,
      )
      .map((item) => item.secondSubCategory),
  ))

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})
    setSuccess(null)

    const res = await createComplaintRequest(form)
    setSubmitting(false)

    if (res.errors) {
      setErrors(res.errors)
      return
    }
    if (res.error) {
      setErrors({ _global: res.error })
      return
    }
    if (res.complaint) {
      setSuccess(res.complaint.referenceNo)
      setTimeout(() => router.push("/complaints"), 1400)
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-border bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto size-12 text-chart-3" />
        <h2 className="mt-4 text-xl font-bold text-foreground">
          تم تسجيل الشكوى بنجاح
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          رقمك المرجعي:{" "}
          <span className="font-mono font-semibold text-foreground">
            {success}
          </span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          يتم تحويلك إلى قائمة الشكاوى...
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="تسجيل شكوى جديدة"
        description="املأ البيانات التالية لرفع شكوى جديدة إلى النظام"
      />

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-card p-6"
      >
        {errors._global && (
          <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errors._global}
          </p>
        )}

        <div className="grid grid-cols-1 gap-5">
          <Field label="عنوان الشكوى" error={errors.title} required>
            <input
              className={fieldCls}
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="مثال: انقطاع التيار الكهربائي"
            />
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="التصنيف الرئيسي" error={errors.primaryCategory} required>
              <select
                className={fieldCls}
                value={form.primaryCategory}
                disabled={categoriesLoading || primaryCategories.length === 0}
                onChange={(e) => setForm((current) => ({
                  ...current,
                  primaryCategory: e.target.value,
                  subCategory: "",
                  secondSubCategory: "",
                }))}
              >
                <option value="">{categoriesLoading ? "جارٍ تحميل التصنيفات..." : "اختر التصنيف الرئيسي"}</option>
                {primaryCategories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </Field>

            <Field label="التصنيف الفرعي" error={errors.subCategory} required>
              <select
                className={fieldCls}
                value={form.subCategory}
                disabled={!form.primaryCategory}
                onChange={(e) => setForm((current) => ({
                  ...current,
                  subCategory: e.target.value,
                  secondSubCategory: "",
                }))}
              >
                <option value="">اختر التصنيف الفرعي</option>
                {subCategories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="التصنيف الفرعي الثاني" error={errors.secondSubCategory} required={secondSubCategories.length > 0}>
              <select
                className={fieldCls}
                value={form.secondSubCategory}
                disabled={!form.subCategory || secondSubCategories.length === 0}
                onChange={(e) => update("secondSubCategory", e.target.value)}
              >
                <option value="">{secondSubCategories.length ? "اختر التصنيف الفرعي الثاني" : "لا يوجد مستوى ثالث لهذا التصنيف"}</option>
                {secondSubCategories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </Field>

            <Field label="المشروع المرتبط" error={errors.project}>
              <select
                className={fieldCls}
                value={form.project}
                onChange={(e) => update("project", e.target.value)}
              >
                {PROJECTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="الأولوية" error={errors.priority} required>
              <select
                className={fieldCls}
                value={form.priority}
                onChange={(e) => update("priority", e.target.value)}
              >
                {PRIORITY_ORDER.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="الموقع الجغرافي" error={errors.location}>
              <select
                className={fieldCls}
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.id || loc.name} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="وصف الشكوى" error={errors.description} required>
            <textarea
              className="min-h-28 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="اشرح تفاصيل الشكوى..."
            />
          </Field>

          <div className="border-t border-border pt-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              بيانات مقدم الشكوى
            </h3>
            <div className="grid grid-cols-1 gap-5">
              <Field label="الاسم" error={errors.citizenName} required>
                <input
                  className={fieldCls}
                  value={form.citizenName}
                  onChange={(e) => update("citizenName", e.target.value)}
                  placeholder="الاسم الكامل"
                />
              </Field>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="البريد الإلكتروني (اختياري)">
                  <input
                    type="email"
                    dir="ltr"
                    className={`${fieldCls} text-right`}
                    value={form.citizenEmail}
                    onChange={(e) => update("citizenEmail", e.target.value)}
                    placeholder="name@example.com"
                  />
                </Field>
                <Field label="رقم الجوال (اختياري)">
                  <input
                    dir="ltr"
                    className={`${fieldCls} text-right`}
                    value={form.citizenPhone}
                    onChange={(e) => update("citizenPhone", e.target.value)}
                    placeholder="05xxxxxxxx"
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60 sm:w-auto"
        >
          {submitting && <Loader2 className="size-4 animate-spin" />}
          {submitting ? "جارٍ الإرسال..." : "إرسال الشكوى"}
        </button>
      </form>
    </div>
  )
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  )
}