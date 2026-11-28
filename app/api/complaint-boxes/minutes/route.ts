import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function yemenToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Aden", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date())
}
function addDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}
function nextWednesday() {
  const today = yemenToday()
  const date = new Date(`${today}T00:00:00Z`)
  const days = (3 - date.getUTCDay() + 7) % 7 || 7
  return addDays(today, days)
}
function nextWeeklyDate(base: string) {
  let date = base || yemenToday()
  while (date <= yemenToday()) date = addDays(date, 7)
  return date
}
function dayDifference(later: string, earlier: string) {
  return Math.round((new Date(`${later}T00:00:00Z`).getTime() - new Date(`${earlier}T00:00:00Z`).getTime()) / 86400000)
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.active === false) return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً." }, { status: 401 })
  const branch = session.user.branch || ""
  if (!branch) return NextResponse.json({ error: "حساب المستخدم غير مرتبط بفرع." }, { status: 403 })

  const form = await request.formData()
  const boxNumber = String(form.get("boxNumber") ?? "").trim()
  const projectNumber = String(form.get("projectNumber") ?? "").trim()
  const projectName = String(form.get("projectName") ?? "").trim()
  const minutesDate = String(form.get("minutesDate") ?? "")
  const deliveredBy = String(form.get("deliveredBy") ?? "").trim()
  const deliveryMethod = String(form.get("deliveryMethod") ?? "يدوياً").trim()
  const deliveryDelayReason = String(form.get("deliveryDelayReason") ?? "").trim()
  const openingDelayReason = String(form.get("openingDelayReason") ?? "").trim()
  const isMobileClient = request.headers.get("x-chm-client") === "mobile"
  const submittedVia = isMobileClient ? "تطبيق الهاتف" : String(form.get("submittedVia") ?? "يدوياً").trim()
  const effectiveDeliveryMethod = isMobileClient ? "تطبيق الهاتف" : deliveryMethod
  const totalDocuments = Number(form.get("totalDocuments"))
  const accepted = Number(form.get("accepted"))
  const rejected = Number(form.get("rejected"))
  const complaints = Number(form.get("complaints"))
  const reports = Number(form.get("reports"))
  const requests = Number(form.get("requests"))
  const proposals = Number(form.get("proposals"))
  const inquiries = Number(form.get("inquiries"))
  const praises = Number(form.get("praises"))

  const counts = [totalDocuments, accepted, rejected, complaints, reports, requests, proposals, inquiries, praises]
  if (!boxNumber || !projectNumber || !projectName || !minutesDate || counts.some(value => !Number.isInteger(value) || value < 0)) {
    return NextResponse.json({ error: "يرجى إدخال الصندوق وتاريخ الاستلام وجميع أعداد الوثائق والعمليات كأعداد صحيحة غير سالبة." }, { status: 422 })
  }
  if (accepted + rejected !== totalDocuments) {
    return NextResponse.json({ error: "عدد الوثائق يجب أن يساوي مجموع الوثائق المقبولة والمرفوضة." }, { status: 422 })
  }
  const distributed = complaints + reports + requests + proposals + inquiries + praises
  if (distributed !== accepted) {
    return NextResponse.json({ error: "مجموع أنواع العمليات يجب أن يساوي عدد الوثائق المقبولة." }, { status: 422 })
  }

  const box = await prisma.fieldBox.findFirst({
    where: { boxNumber, projectNumber, projectName, ...(session.user.role === "مدير النظام" || session.user.role === "إدارة عامة" || branch === "الإدارة العامة" ? {} : { branch }) },
  })
  if (!box) return NextResponse.json({ error: "الصندوق المحدد غير مسجل أو لا يتبع الفرع الحالي." }, { status: 422 })

  const files = form.getAll("files").filter((value): value is File => value instanceof File && value.size > 0)
  if (files.length === 0) return NextResponse.json({ error: "لا يمكن حفظ المحضر دون إرفاق صورة أو ملف PDF للمحضر." }, { status: 422 })
  if (files.length > 10 || files.some(file => !(file.type.startsWith("image/") || file.type === "application/pdf") || file.size > 3 * 1024 * 1024)) {
    return NextResponse.json({ error: "يسمح بحد أقصى 10 مرفقات من الصور أو PDF، وبحد إجمالي 4 ميجابايت للطلب." }, { status: 422 })
  }
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0)
  if (totalBytes > 4 * 1024 * 1024) return NextResponse.json({ error: "إجمالي حجم المرفقات يتجاوز الحد المسموح (4 ميجابايت)." }, { status: 422 })

  try {
    const latest = await prisma.boxOpeningMinute.findFirst({ where: { boxNumber }, orderBy: { createdAt: "desc" } })
    const today = yemenToday()
    const expectedDate = latest ? nextWeeklyDate(latest.openingDate) : nextWednesday()
    const deliveryDate = latest ? nextWeeklyDate(latest.deliveryDate) : addDays(expectedDate, 1)
    const delayDays = dayDifference(today, expectedDate)
    const delayStatus = delayDays <= 0 ? "🟢 ضمن المدة" : delayDays <= 3 ? "🟡 تأخير بسيط" : "🔴 متأخر"
    const minuteNumber = `MIN-${today.slice(0, 4)}-${crypto.randomUUID().replace(/-/g, "").toUpperCase()}`

    const minute = await prisma.boxOpeningMinute.create({
      data: {
        minuteNumber, boxNumber, projectNumber, projectName,
        openingDate: today, expectedDate, deliveryDate, entryDate: today, minutesDate,
        openingCommittee: session.user.name || "لجنة فتح الصندوق",
        deliveredBy: deliveredBy || null,
        deliveryMethod: effectiveDeliveryMethod,
        deliveryDelayReason: deliveryDelayReason || null,
        openingDelayReason: openingDelayReason || null,
        submittedVia,
        branch: box.branch,
        totalDocuments,
        delayStatus,
        totalOperations: distributed,
        complaintsCount: complaints,
        reportsCount: reports,
        requestsCount: requests,
        proposalsCount: proposals,
        inquiriesCount: inquiries,
        praisesCount: praises,
        acceptedAttachments: accepted,
        rejectedAttachments: rejected,
        rejectionReasons: String(form.get("rejectionReasons") ?? "").trim() || null,
        attachments: {
          create: await Promise.all(files.map(async file => ({
            fileName: file.name.replace(/[\\/\\0]/g, "_").slice(0, 240),
            mimeType: file.type || "application/octet-stream",
            fileSize: file.size,
            fileContent: Buffer.from(await file.arrayBuffer()),
          }))),
        },
      },
      include: { attachments: { select: { id: true, fileName: true, mimeType: true, fileSize: true } } },
    })
    return NextResponse.json({ minute }, { status: 201 })
  } catch (error) {
    console.error("CHM_MINUTE_CREATE_FAILED", error)
    return NextResponse.json({ error: "تعذر حفظ محضر الفتح في قاعدة البيانات." }, { status: 503 })
  }
}
