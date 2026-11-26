import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function isAdministrator(user: { role?: string; branch?: string }) {
  return user.role === "مدير النظام" || user.role === "إدارة عامة" || user.branch === "الإدارة العامة"
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.active === false) {
    return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً." }, { status: 401 })
  }

  const { id } = await params
  if (!id) return NextResponse.json({ error: "رقم العملية غير صحيح." }, { status: 400 })

  let body: Record<string, unknown>
  try {
    body = await request.json() as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "بيانات التحديث غير صالحة." }, { status: 400 })
  }

  const data: Record<string, unknown> = {}
  const textFields: Record<string, string> = {
    mainClass: "primaryCategory",
    subClass: "subCategory",
    sensitivity: "sensitivity",
    minutesNo: "minutesNo",
    officerReply: "internalNotes",
    responder: "assignedTo",
    closure: "finalResponse",
    message: "responseMessage",
    evaluation: "finalEvaluation",
    needsAnalysis: "needsAnalysis",
  }

  for (const [input, column] of Object.entries(textFields)) {
    if (input in body) {
      const value = body[input]
      if (value !== null && typeof value !== "string") {
        return NextResponse.json({ error: "أحد حقول التحديث يحتوي على قيمة غير صالحة." }, { status: 422 })
      }
      data[column] = typeof value === "string" ? value.trim() || null : null
    }
  }

  if ("replyChannels" in body) {
    const channels = body.replyChannels
    if (!Array.isArray(channels) || channels.some(item => typeof item !== "string")) {
      return NextResponse.json({ error: "قنوات الرد غير صالحة." }, { status: 422 })
    }
    data.responseChannels = JSON.stringify(channels)
  }

  if ("status" in body) {
    const status = body.status
    const allowed = new Set(["مستلمة", "جديدة", "طور المعالجة", "بانتظار الرد", "مغلقة"])
    if (typeof status !== "string" || !allowed.has(status)) {
      return NextResponse.json({ error: "حالة العملية غير معتمدة." }, { status: 422 })
    }
    data.status = status
    data.closedAt = status === "مغلقة" ? new Date() : null
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "لم يتم إرسال حقول قابلة للتحديث." }, { status: 422 })
  }

  const where = isAdministrator(session.user)
    ? { id }
    : { id, branch: session.user.branch || "" }

  try {
    const updated = await prisma.complaintOperation.updateMany({ where, data })
    if (updated.count === 0) {
      return NextResponse.json({ error: "العملية غير موجودة أو لا تتبع نطاق فرعك." }, { status: 404 })
    }
    return NextResponse.json({ success: true, message: "تم حفظ تحديث العملية." })
  } catch (error) {
    console.error("CHM_OPERATION_UPDATE_FAILED", error)
    return NextResponse.json({ error: "تعذر حفظ تحديث العملية في قاعدة البيانات." }, { status: 503 })
  }
}
