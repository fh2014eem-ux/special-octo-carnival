import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_IMAGE_BYTES = 3 * 1024 * 1024
const MAX_REPORT_BYTES = 3 * 1024 * 1024
const MAX_TOTAL_BYTES = 4 * 1024 * 1024

function getScope(user: { role?: string; branch?: string }) {
  const isAdmin = user.role === "مدير النظام" || user.role === "إدارة عامة" || user.branch === "الإدارة العامة"
  return { isAdmin, branch: user.branch || "" }
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.active === false) {
    return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً." }, { status: 401 })
  }

  const scope = getScope(session.user)
  try {
    const visits = await prisma.fieldMonitoringVisit.findMany({
      where: scope.isAdmin ? {} : { branch: scope.branch },
      orderBy: { createdAt: "desc" },
      take: 250,
      include: {
        attachments: {
          select: { id: true, fileName: true, mimeType: true, fileSize: true, createdAt: true },
        },
      },
    })
    return NextResponse.json({ visits })
  } catch (error) {
    console.error("CHM_MONITORING_LIST_FAILED", error)
    return NextResponse.json({ error: "تعذر تحميل سجل المتابعة. تحقق من تطبيق تحديث قاعدة البيانات." }, { status: 503 })
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.active === false) {
    return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً." }, { status: 401 })
  }

  const scope = getScope(session.user)
  if (!scope.branch) return NextResponse.json({ error: "حساب المستخدم غير مرتبط بفرع." }, { status: 403 })

  const form = await request.formData()
  const projectNumber = String(form.get("projectNumber") ?? "").trim()
  const projectName = String(form.get("projectName") ?? "").trim()
  const visitStartDate = String(form.get("visitStartDate") ?? "")
  const visitEndDate = String(form.get("visitEndDate") ?? "")
  const location = String(form.get("location") ?? "").trim()
  const team = String(form.get("team") ?? "").trim()
  const goal = String(form.get("goal") ?? "").trim()
  const result = String(form.get("result") ?? "").trim()

  if (!projectNumber || !projectName || !visitStartDate || !visitEndDate || !team || !goal || !result) {
    return NextResponse.json({ error: "يرجى استكمال المشروع وفترة الزيارة وفريق المتابعة والهدف والنتائج." }, { status: 422 })
  }
  const start = new Date(visitStartDate)
  const end = new Date(visitEndDate)
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end < start) {
    return NextResponse.json({ error: "فترة الزيارة غير صحيحة." }, { status: 422 })
  }

  const project = await prisma.$queryRaw<Array<{ projectName: string; branch: string | null }>>`
    SELECT project_name AS "projectName", branch
    FROM public.chm_reference_projects
    WHERE active = true AND project_number = ${projectNumber}
    LIMIT 1
  `
  const scope = getScope(session.user)
  const referenceBranch = scope.branch === "فرع المكلا" ? "فرع حضرموت" : scope.branch
  if (!project[0] || project[0].projectName !== projectName || (!scope.isAdmin && project[0].branch && project[0].branch !== referenceBranch)) {
    return NextResponse.json({ error: "المشروع المحدد غير موجود في المرجع المعتمد أو لا يطابق رقمه." }, { status: 422 })
  }

  const imageFiles = form.getAll("images").filter((value): value is File => value instanceof File && value.size > 0)
  const reportValue = form.get("report")
  const reportFile = reportValue instanceof File && reportValue.size > 0 ? reportValue : null
  if (imageFiles.length > 10) return NextResponse.json({ error: "الحد الأقصى 10 صور للزيارة." }, { status: 422 })
  if (imageFiles.some(file => !file.type.startsWith("image/") || file.size > MAX_IMAGE_BYTES)) {
    return NextResponse.json({ error: "يسمح بصور لا يتجاوز حجم كل منها 8 ميجابايت." }, { status: 422 })
  }
  const allowedReport = new Set(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"])
  if (reportFile && (!allowedReport.has(reportFile.type) || reportFile.size > MAX_REPORT_BYTES)) {
    return NextResponse.json({ error: "التقرير يجب أن يكون PDF أو Word أو Excel وألا يتجاوز 12 ميجابايت." }, { status: 422 })
  }
  const files = [...imageFiles, ...(reportFile ? [reportFile] : [])]
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0)
  if (totalBytes > MAX_TOTAL_BYTES) return NextResponse.json({ error: "إجمالي حجم المرفقات يجب ألا يتجاوز 24 ميجابايت." }, { status: 422 })

  try {
    const visit = await prisma.fieldMonitoringVisit.create({
      data: {
        projectNumber,
        projectName,
        visitStartDate: start,
        visitEndDate: end,
        location: location || null,
        team,
        goal,
        result,
        branch: scope.branch,
        createdById: session.user.id,
        createdByName: session.user.name,
        attachments: files.length ? {
          create: await Promise.all(files.map(async file => ({
            fileName: file.name.replace(/[\\/\\0]/g, "_").slice(0, 240),
            mimeType: file.type || "application/octet-stream",
            fileSize: file.size,
            fileContent: Buffer.from(await file.arrayBuffer()),
          }))),
        } : undefined,
      },
      include: {
        attachments: { select: { id: true, fileName: true, mimeType: true, fileSize: true, createdAt: true } },
      },
    })
    return NextResponse.json({ visit }, { status: 201 })
  } catch (error) {
    console.error("CHM_MONITORING_CREATE_FAILED", error)
    return NextResponse.json({ error: "تعذر حفظ الزيارة في قاعدة البيانات." }, { status: 503 })
  }
}
