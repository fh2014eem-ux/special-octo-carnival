import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function scopeFor(user: { role?: string; branch?: string }) {
  const isAdmin = user.role === "مدير النظام" || user.role === "إدارة عامة" || user.branch === "الإدارة العامة"
  return { isAdmin, branch: user.branch || "" }
}

function toClientOperation(row: any) {
  return {
    id: row.id,
    operationNo: row.operationNumber,
    type: row.type,
    status: row.status,
    branch: row.branch,
    channel: row.channel,
    phone: row.phone,
    altPhone: row.secondaryPhone || "",
    email: row.citizenEmail || "",
    accusedPerson: row.defendant || "",
    projectNo: row.projectNumber || "",
    projectName: row.projectName || "",
    referredTo: row.assignedTo || "",
    internalReply: row.internalNotes || "",
    finalClosingText: row.finalResponse || "",
    closingChannel: row.responseChannels || "",
    replyMessage: row.finalResponse || "",
    finalEvaluation: row.finalEvaluation || "",
    requiresAnalysis: row.needsAnalysis || "",
    name: row.applicantName,
    gender: row.gender,
    capacity: row.applicantRole || "",
    province: row.governorate || "",
    directorate: row.directorate || "",
    isolation: row.subDistrict || "",
    village: row.villageOrNeighborhood || "",
    subject: row.subject,
    description: row.description,
    additionalData: row.additionalData || "",
    mainClass: row.primaryCategory || "",
    subClass: row.subCategory || "",
    subClass2: row.secondSubCategory || "",
    sensitivity: row.sensitivity || "",
    attachments: (row.attachments || []).map((file: { fileName: string }) => file.fileName),
    attachmentRecords: row.attachments || [],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.active === false) return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً." }, { status: 401 })
  const scope = scopeFor(session.user)
  try {
    const rows = await prisma.complaintOperation.findMany({
      where: scope.isAdmin ? {} : { branch: scope.branch },
      orderBy: { createdAt: "desc" },
      take: 1000,
      include: { attachments: { select: { id: true, stage: true, fileName: true, mimeType: true, fileSize: true } } },
    })
    return NextResponse.json({ operations: rows.map(toClientOperation) })
  } catch (error) {
    console.error("CHM_OPERATIONS_LIST_FAILED", error)
    return NextResponse.json({ error: "تعذر تحميل العمليات من قاعدة البيانات. تحقق من تحديث مخطط قاعدة البيانات." }, { status: 503 })
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.active === false) return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً." }, { status: 401 })
  const branch = session.user.branch || ""
  if (!branch) return NextResponse.json({ error: "حساب المستخدم غير مرتبط بفرع." }, { status: 403 })

  const form = await request.formData()
  const value = (key: string) => String(form.get(key) ?? "").trim()
  const type = value("type")
  const name = value("name")
  const subject = value("subject")
  const description = value("description")
  const additionalData = value("additionalData")
  const allowedTypes = new Set(["شكوى", "بلاغ", "استعلام", "مقترح", "طلب", "إطراء"])
  if (!allowedTypes.has(type) || name.length < 2 || subject.length < 2 || description.length < 5) {
    return NextResponse.json({ error: "نوع العملية واسم مقدمها والموضوع والملخص حقول إلزامية." }, { status: 422 })
  }

  const projectNumber = value("projectNo")
  const projectName = value("projectName")
  if (projectNumber) {
    const project = await prisma.$queryRaw<Array<{ projectName: string; branch: string | null }>>`
      SELECT project_name AS "projectName", branch FROM public.chm_reference_projects
      WHERE active = true AND project_number = ${projectNumber} LIMIT 1
    `
    const isAdmin = session.user.role === "مدير النظام" || session.user.role === "إدارة عامة" || branch === "الإدارة العامة"
    if (!project[0] || (projectName && project[0].projectName !== projectName) || (!isAdmin && project[0].branch && project[0].branch !== branch)) {
      return NextResponse.json({ error: "المشروع المحدد غير موجود في المرجع المعتمد أو أن اسمه لا يطابق رقمه." }, { status: 422 })
    }
  }

  const attachmentStages = ["attachment1", "attachment2", "attachment3"] as const
  const files = attachmentStages.map(stage => ({ stage, file: form.get(stage) })).filter((item): item is { stage: typeof attachmentStages[number]; file: File } => item.file instanceof File && item.file.size > 0)
  const requiredAttachment = type === "شكوى" || type === "بلاغ"
  if (requiredAttachment && !files.some(item => item.stage === "attachment1")) {
    return NextResponse.json({ error: "إرفاق مستند الاستقبال إلزامي للشكاوى والبلاغات." }, { status: 422 })
  }
  const allowedMime = new Set(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"])
  if (files.some(item => !(item.file.type.startsWith("image/") || allowedMime.has(item.file.type)))) return NextResponse.json({ error: "نوع أحد المرفقات غير مسموح. استخدم صورة أو PDF أو Word أو Excel." }, { status: 422 })
  if (files.some(item => item.file.size > 3 * 1024 * 1024)) return NextResponse.json({ error: "حجم كل مرفق يجب ألا يتجاوز 3 ميجابايت." }, { status: 422 })
  if (files.reduce((sum, item) => sum + item.file.size, 0) > 4 * 1024 * 1024) return NextResponse.json({ error: "إجمالي المرفقات يجب ألا يتجاوز 4 ميجابايت." }, { status: 422 })

  try {
    const year = new Date().getFullYear()
    const operationNumber = `CHM-${year}-${Date.now()}`
    const row = await prisma.complaintOperation.create({
      data: {
        operationNumber,
        type,
        status: value("status") || "مستلمة",
        priority: value("priority") || "عادية",
        channel: value("channel") || "أخرى",
        applicantName: name,
        gender: value("gender"),
        phone: value("phone"),
        secondaryPhone: value("altPhone") || null,
        citizenEmail: value("email") || null,
        applicantRole: value("capacity") || null,
        defendant: value("accusedPerson") || null,
        governorate: value("province") || null,
        directorate: value("directorate") || null,
        subDistrict: value("isolation") || null,
        villageOrNeighborhood: value("village") || null,
        subject,
        description,
        additionalData: additionalData || null,
        sensitivity: value("sensitivity") || null,
        primaryCategory: value("mainClass") || null,
        subCategory: value("subClass") || null,
        secondSubCategory: value("subClass2") || null,
        projectNumber: projectNumber || null,
        projectName: projectName || null,
        assignedTo: value("referredTo") || null,
        internalNotes: value("internalReply") || null,
        finalResponse: value("finalClosingText") || value("replyMessage") || null,
        responseChannels: value("closingChannel") || null,
        finalEvaluation: value("finalEvaluation") || null,
        needsAnalysis: value("requiresAnalysis") || null,
        branch,
        createdById: session.user.id,
        attachments: files.length ? {
          create: await Promise.all(files.map(async item => ({
            stage: item.stage,
            fileName: item.file.name.replace(/[\\/\\0]/g, "_").slice(0, 240),
            mimeType: item.file.type || "application/octet-stream",
            fileSize: item.file.size,
            fileContent: Buffer.from(await item.file.arrayBuffer()),
          }))),
        } : undefined,
      },
      include: { attachments: { select: { id: true, stage: true, fileName: true, mimeType: true, fileSize: true } } },
    })
    return NextResponse.json({ operation: toClientOperation(row) }, { status: 201 })
  } catch (error) {
    console.error("CHM_OPERATION_CREATE_FAILED", error)
    return NextResponse.json({ error: "تعذر حفظ العملية في قاعدة البيانات." }, { status: 503 })
  }
}
