import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.active === false) {
    return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً." }, { status: 401 })
  }
  const isAdmin = session.user.role === "مدير النظام" || session.user.role === "إدارة عامة" || session.user.branch === "الإدارة العامة"
  const branch = session.user.branch || ""
  if (!isAdmin && !branch) return NextResponse.json({ error: "حساب المستخدم غير مرتبط بفرع." }, { status: 403 })

  const reports = await prisma.fieldAwareness.findMany({
    where: isAdmin ? {} : { branch },
    orderBy: { createdAt: "desc" },
    take: 500,
  })
  return NextResponse.json({ reports })
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.active === false) {
    return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً." }, { status: 401 })
  }
  const branch = session.user.branch || ""
  if (!branch) return NextResponse.json({ error: "حساب المستخدم غير مرتبط بفرع." }, { status: 403 })

  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  if (!body) return NextResponse.json({ error: "بيانات التقرير غير صالحة." }, { status: 400 })
  const projectNumber = textValue(body.projectNumber)
  const projectName = textValue(body.projectName)
  const activityDate = textValue(body.activityDate)
  if (!projectNumber || !projectName || !activityDate) {
    return NextResponse.json({ error: "يرجى تحديد المشروع وتاريخ تنفيذ التوعية." }, { status: 422 })
  }

  const referenceBranch = branch === "فرع المكلا" ? "فرع حضرموت" : branch
  const projects = await prisma.$queryRaw<Array<{ projectName: string; branch: string | null; sector: string | null; data: unknown }>>`
    SELECT project_name AS "projectName", branch, sector, data
    FROM public.chm_reference_projects
    WHERE active = true AND project_number = ${projectNumber}
    LIMIT 1
  `
  const project = projects[0]
  const isAdmin = session.user.role === "مدير النظام" || session.user.role === "إدارة عامة" || branch === "الإدارة العامة"
  if (!project || project.projectName !== projectName || (!isAdmin && project.branch && project.branch !== referenceBranch)) {
    return NextResponse.json({ error: "المشروع غير موجود في المرجع أو لا يتبع الفرع الحالي." }, { status: 422 })
  }

  const details = body.details && typeof body.details === "object" ? body.details as Record<string, unknown> : body
  const attendees = Array.isArray(details.presentMembers) ? details.presentMembers as Array<Record<string, unknown>> : []
  const menCount = attendees.filter(item => item.gender === "ذكر").length
  const womenCount = attendees.filter(item => item.gender === "أنثى").length
  const directBeneficiaries = Number(body.directBeneficiaries ?? 0)
  const indirectBeneficiaries = Number(body.indirectBeneficiaries ?? 0)
  const boxCount = Math.max(0, Math.trunc(Number(body.boxCount ?? details.boxCount ?? 0)))
  const hasBox = body.hasBox === true || details.hasBox === true || details.hasBox === "نعم"

  try {
    const report = await prisma.fieldAwareness.create({
      data: {
        projectNumber,
        projectName,
        sector: project.sector || textValue(body.sector) || "",
        governorate: textValue(body.governorate),
        directorate: textValue(body.directorate),
        awarenessType: textValue(body.awarenessType) || "توعية أساسية",
        projectCategory: textValue(body.projectCategory) || "مشاريع ميدانية",
        activityDate,
        location: textValue(body.location),
        targetAudience: textValue(body.targetAudience),
        activityGoal: textValue(body.activityGoal),
        topic: textValue(body.topic),
        duration: textValue(body.duration),
        totalBeneficiaries: Math.max(0, directBeneficiaries + indirectBeneficiaries),
        menCount,
        womenCount,
        directBeneficiaries: Math.max(0, directBeneficiaries),
        indirectBeneficiaries: Math.max(0, indirectBeneficiaries),
        description: textValue(body.description),
        attachments: null,
        status: "مرفق",
        details: JSON.parse(JSON.stringify(details)),
        hasBox,
        boxCount,
        branch,
      },
    })
    return NextResponse.json({ report }, { status: 201 })
  } catch (error) {
    console.error("CHM_FIELD_AWARENESS_CREATE_FAILED", error)
    return NextResponse.json({ error: "تعذر حفظ تقرير التوعية مركزياً. تحقق من تحديث قاعدة بيانات المعاينة." }, { status: 503 })
  }
}
