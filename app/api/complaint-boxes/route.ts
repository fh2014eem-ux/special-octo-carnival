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

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.active === false) return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً." }, { status: 401 })
  const scope = scopeFor(session.user)
  try {
    const where = scope.isAdmin ? {} : { branch: scope.branch }
    const [boxes, minutes] = await Promise.all([
      prisma.fieldBox.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { attachments: { select: { id: true, fileName: true, mimeType: true, fileSize: true } } },
      }),
      prisma.boxOpeningMinute.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 500,
        include: { attachments: { select: { id: true, fileName: true, mimeType: true, fileSize: true } } },
      }),
    ])
    return NextResponse.json({ boxes, minutes })
  } catch (error) {
    console.error("CHM_BOXES_LIST_FAILED", error)
    return NextResponse.json({ error: "تعذر تحميل بيانات الصناديق والمحاضر. قد يلزم تطبيق تحديث قاعدة البيانات أولاً." }, { status: 503 })
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.active === false) return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً." }, { status: 401 })
  const scope = scopeFor(session.user)
  if (!scope.branch) return NextResponse.json({ error: "حساب المستخدم غير مرتبط بفرع." }, { status: 403 })

  const form = await request.formData()
  const requestedBoxNumber = String(form.get("boxNumber") ?? "").trim()
  const projectNumber = String(form.get("projectNumber") ?? "").trim()
  const projectName = String(form.get("projectName") ?? "").trim()
  const rawBoxes = String(form.get("boxes") ?? "")
  const parsedBoxes = rawBoxes ? JSON.parse(rawBoxes) as Array<{ installLocation?: string; installDate?: string; reasonForPlace?: string; chosenBy?: string }> : []
  const boxEntries = parsedBoxes.length ? parsedBoxes : [{
    installLocation: String(form.get("installLocation") ?? "").trim(),
    installDate: String(form.get("installDate") ?? ""),
    reasonForPlace: String(form.get("reasonForPlace") ?? "").trim(),
    chosenBy: String(form.get("chosenBy") ?? "").trim(),
  }]
  const openingResponsibleName = String(form.get("openingResponsibleName") ?? "").trim()
  const openingResponsibleRole = String(form.get("openingResponsibleRole") ?? "").trim()
  const openingResponsiblePhone = String(form.get("openingResponsiblePhone") ?? "").trim()
  const openingResponsibleNotes = String(form.get("openingResponsibleNotes") ?? "").trim()
  const deliveryResponsibleName = String(form.get("deliveryResponsibleName") ?? "").trim()
  const deliveryResponsibleRole = String(form.get("deliveryResponsibleRole") ?? "").trim()
  const deliveryResponsiblePhone = String(form.get("deliveryResponsiblePhone") ?? "").trim()
  const deliveryResponsibleNotes = String(form.get("deliveryResponsibleNotes") ?? "").trim()
  const boxCount = Number(form.get("boxCount") ?? 1)
  if (!projectNumber || !projectName || !openingResponsibleName || !deliveryResponsibleName || !Number.isInteger(boxCount) || boxCount < 1 || boxEntries.length !== boxCount || boxEntries.some(item => !String(item.installLocation ?? "").trim() || !String(item.installDate ?? "").trim() || !String(item.reasonForPlace ?? "").trim() || !String(item.chosenBy ?? "").trim())) {
    return NextResponse.json({ error: "يرجى استكمال بيانات كل صندوق على حدة والتأكد من تطابق عدد الصناديق." }, { status: 422 })
  }
  const project = await prisma.$queryRaw<Array<{ projectName: string; branch: string | null; data: unknown }>>`
    SELECT project_name AS "projectName", branch, data FROM public.chm_reference_projects
    WHERE active = true AND project_number = ${projectNumber} LIMIT 1
  `
  const referenceBranch = scope.branch === "فرع المكلا" ? "فرع حضرموت" : scope.branch
  if (!project[0] || project[0].projectName !== projectName || (!scope.isAdmin && project[0].branch && project[0].branch !== referenceBranch)) return NextResponse.json({ error: "المشروع غير موجود في قاعدة المشاريع المرجعية أو لا يتبع الفرع الحالي." }, { status: 422 })

  const files = form.getAll("images").filter((value): value is File => value instanceof File && value.size > 0)
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0)
  if (files.length > 10 || files.some(file => !file.type.startsWith("image/") || file.size > 3 * 1024 * 1024) || totalBytes > 4 * 1024 * 1024) {
    return NextResponse.json({ error: "يسمح بإرفاق 10 صور كحد أقصى، بحد إجمالي 4 ميجابايت للطلب." }, { status: 422 })
  }
  try {
    const projectData = project[0].data && typeof project[0].data === "object" ? project[0].data as Record<string, unknown> : {}
    const createdBoxes = await prisma.$transaction(async (tx) => Promise.all(boxEntries.map(async (entry) => {
      const boxNumber = `BOX-${new Date().getFullYear()}-${crypto.randomUUID().replace(/-/g, "").toUpperCase()}`
      const entryFiles = await Promise.all(files.map(async file => ({
        fileName: file.name.replace(/[\\/\\0]/g, "_").slice(0, 240),
        mimeType: file.type,
        fileSize: file.size,
        fileContent: Buffer.from(await file.arrayBuffer()),
      })))
      return tx.fieldBox.create({
        data: {
          boxNumber, projectNumber, projectName,
          installLocation: String(entry.installLocation).trim(),
          installDate: String(entry.installDate),
          reasonForPlace: String(entry.reasonForPlace).trim(),
          chosenBy: String(entry.chosenBy).trim(),
          openingResponsibleName, openingResponsibleRole: openingResponsibleRole || null,
          openingResponsiblePhone: openingResponsiblePhone || null, openingResponsibleNotes: openingResponsibleNotes || null,
          deliveryResponsibleName, deliveryResponsibleRole: deliveryResponsibleRole || null,
          deliveryResponsiblePhone: deliveryResponsiblePhone || null, deliveryResponsibleNotes: deliveryResponsibleNotes || null,
          projectSector: String(projectData["القطاع الرئيسي"] ?? "") || null,
          projectUnit: String(projectData["الوحدة"] ?? "") || null,
          funder: String(projectData["الممول"] ?? "") || null,
          branch: scope.branch, boxCount: 1, status: "يعمل",
          attachments: entryFiles.length ? { create: entryFiles } : undefined,
        },
        include: { attachments: { select: { id: true, fileName: true, mimeType: true, fileSize: true } } },
      })
    })))
    return NextResponse.json({ boxes: createdBoxes, box: createdBoxes[0] }, { status: 201 })
  } catch (error) {
    console.error("CHM_BOX_CREATE_FAILED", error)
    return NextResponse.json({ error: "تعذر حفظ الصندوق. تحقق من عدم تكرار رقم الصندوق." }, { status: 503 })
  }
}
