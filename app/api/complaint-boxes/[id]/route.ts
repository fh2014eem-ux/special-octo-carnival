import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ALLOWED_STATUSES = new Set(["يعمل", "متوقف مؤقتا", "إعادة تفعيل", "إزالة التركيب", "لم يتم تركيب"])

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.active === false) {
    return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً." }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json().catch(() => null) as { status?: string; notInstalledReason?: string } | null
  const status = String(body?.status ?? "").trim()
  const notInstalledReason = String(body?.notInstalledReason ?? "").trim()
  if (!ALLOWED_STATUSES.has(status)) {
    return NextResponse.json({ error: "حالة الصندوق المحددة غير معتمدة." }, { status: 422 })
  }
  if (status === "لم يتم تركيب" && !notInstalledReason) {
    return NextResponse.json({ error: "يرجى إدخال سبب عدم تركيب الصندوق." }, { status: 422 })
  }

  const isAdmin = session.user.role === "مدير النظام" || session.user.role === "إدارة عامة" || session.user.branch === "الإدارة العامة"
  const box = await prisma.fieldBox.findFirst({
    where: { id, ...(isAdmin ? {} : { branch: session.user.branch || "" }) },
    select: { id: true },
  })
  if (!box) return NextResponse.json({ error: "الصندوق غير موجود أو لا يتبع الفرع الحالي." }, { status: 404 })

  const updated = await prisma.fieldBox.update({
    where: { id },
    data: {
      status,
      notInstalledReason: status === "لم يتم تركيب" ? notInstalledReason : null,
      statusUpdatedAt: new Date(),
      statusUpdatedBy: session.user.name || session.user.id,
    },
  })
  return NextResponse.json({ success: true, box: updated })
}
