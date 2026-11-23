import { NextResponse } from "next/server"
import { createComplaint, listComplaints } from "@/lib/data"
import { PRIORITY_ORDER, STATUS_ORDER } from "@/lib/types"
import type { ComplaintPriority, ComplaintStatus } from "@/lib/types"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET /api/complaints?status=&category=&q=  => جلب قائمة الشكاوى
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") ?? undefined
  const category = searchParams.get("category") ?? undefined
  const q = searchParams.get("q") ?? undefined

  const complaints = await listComplaints({
    status:
      status && STATUS_ORDER.includes(status as ComplaintStatus)
        ? (status as ComplaintStatus)
        : undefined,
    category: category || undefined,
    q: q || undefined,
  })

  return NextResponse.json({ complaints })
}

// POST /api/complaints  => إضافة شكوى جديدة
export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "صيغة الطلب غير صحيحة" }, { status: 400 })
  }

  const title = String(body.title ?? "").trim()
  const description = String(body.description ?? "").trim()
  const primaryCategory = String(body.primaryCategory ?? body.category ?? "").trim()
  const subCategory = String(body.subCategory ?? "").trim()
  const secondSubCategory = String(body.secondSubCategory ?? "").trim()
  const citizenName = String(body.citizenName ?? "").trim()
  const priority = String(body.priority ?? "MEDIUM") as ComplaintPriority
  const projectNumber = String(body.project ?? "").trim()
  const locationParts = String(body.location ?? "").split(" / ").map(value => value.trim()).filter(Boolean)

  // التحقق من المدخلات
  const errors: Record<string, string> = {}
  if (title.length < 3) errors.title = "العنوان مطلوب (3 أحرف على الأقل)"
  if (description.length < 10)
    errors.description = "الوصف مطلوب (10 أحرف على الأقل)"
  if (!primaryCategory) errors.primaryCategory = "اختر التصنيف الرئيسي"
  if (!subCategory) errors.subCategory = "اختر التصنيف الفرعي"
  if (citizenName.length < 2) errors.citizenName = "اسم مقدم الشكوى مطلوب"
  if (!PRIORITY_ORDER.includes(priority))
    errors.priority = "أولوية غير صحيحة"

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "بيانات غير صحيحة", errors }, { status: 422 })
  }

  const matchingCategory = await prisma.$queryRaw<Array<{ found: boolean }>>`
    SELECT EXISTS (
      SELECT 1
      FROM public.chm_reference_categories
      WHERE active = true
        AND primary_category = ${primaryCategory}
        AND sub_category = ${subCategory}
        AND second_sub_category = ${secondSubCategory}
    ) AS found
  `
  if (!matchingCategory[0]?.found) {
    return NextResponse.json({
      error: "بيانات غير صحيحة",
      errors: { secondSubCategory: "التصنيف المحدد غير موجود في المرجع المعتمد" },
    }, { status: 422 })
  }

  let projectName: string | null = null
  if (projectNumber) {
    const matchingProject = await prisma.$queryRaw<Array<{ projectName: string }>>`
      SELECT project_name AS "projectName"
      FROM public.chm_reference_projects
      WHERE active = true AND project_number = ${projectNumber}
      LIMIT 1
    `
    if (!matchingProject[0]) {
      return NextResponse.json({ error: "بيانات غير صحيحة", errors: { project: "المشروع المحدد غير موجود في المرجع المعتمد" } }, { status: 422 })
    }
    projectName = matchingProject[0].projectName
  }

  const complaint = await createComplaint({
    title,
    description,
    category: primaryCategory,
    primaryCategory,
    subCategory,
    secondSubCategory,
    priority,
    location: body.location ? String(body.location).trim() : null,
    governorate: locationParts[0] ?? null,
    directorate: locationParts[1] ?? null,
    subDistrict: locationParts[2] ?? null,
    villageOrNeighborhood: locationParts[3] ?? null,
    projectNumber: projectNumber || null,
    projectName,
    citizenName,
    citizenEmail: body.citizenEmail ? String(body.citizenEmail).trim() : null,
    citizenPhone: body.citizenPhone ? String(body.citizenPhone).trim() : null,
  })

  return NextResponse.json({ complaint }, { status: 201 })
}
