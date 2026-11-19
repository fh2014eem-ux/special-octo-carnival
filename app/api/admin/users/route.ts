import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { pool } from "@/lib/db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.active === false) {
    return { ok: false as const, status: 401, message: "يرجى تسجيل الدخول أولاً." }
  }
  if (session.user.role !== "مدير النظام" || session.user.branch !== "الإدارة العامة") {
    return { ok: false as const, status: 403, message: "هذه العملية متاحة لمدير النظام فقط." }
  }
  return { ok: true as const, actor: session.user.id }
}

export async function GET() {
  const gate = await requireAdmin()
  if (!gate.ok) return NextResponse.json({ success: false, message: gate.message }, { status: gate.status })
  const result = await pool.query(
    'SELECT id, username, "displayUsername", name, email, role, branch, active, "createdAt" FROM public."user" ORDER BY "createdAt" DESC',
  )
  return NextResponse.json({ success: true, users: result.rows })
}

export async function POST(req: NextRequest) {
  const gate = await requireAdmin()
  if (!gate.ok) return NextResponse.json({ success: false, message: gate.message }, { status: gate.status })
  if (!process.env.CHM_USER_PROVISION_TOKEN) {
    return NextResponse.json({ success: false, message: "لم يتم إعداد مفتاح إنشاء المستخدمين في الخادم." }, { status: 503 })
  }

  try {
    const body = await req.json() as {
      username?: string; name?: string; email?: string; password?: string; branch?: string
    }
    const username = String(body.username ?? "").trim()
    const name = String(body.name ?? "").trim()
    const email = String(body.email ?? "").trim().toLowerCase()
    const password = String(body.password ?? "")
    const branch = String(body.branch ?? "").trim()
    const allowedBranches = ["الإدارة العامة", "فرع تعز", "فرع عدن", "فرع حضرموت", "مكتب مأرب"]

    if (!/^[A-Za-z0-9_.]{3,30}$/.test(username) || !name || !/^\S+@\S+\.\S+$/.test(email) || password.length < 12 || !allowedBranches.includes(branch)) {
      return NextResponse.json({ success: false, message: "تحقق من اسم المستخدم والاسم والبريد وكلمة المرور والفرع." }, { status: 400 })
    }

    const created = await auth.api.signUpEmail({
      body: { username, name, email, password },
      headers: new Headers({ "x-chm-user-provision-token": process.env.CHM_USER_PROVISION_TOKEN }),
    })
    if (!created.user?.id) {
      return NextResponse.json({ success: false, message: "تعذر إنشاء حساب المستخدم." }, { status: 400 })
    }

    const role = branch === "الإدارة العامة" ? "مدير النظام" : "مدخل بيانات"
    await pool.query(
      'UPDATE public."user" SET role = $1, branch = $2, active = TRUE WHERE id = $3',
      [role, branch, created.user.id],
    )

    return NextResponse.json({
      success: true,
      user: { id: created.user.id, username, name, email, role, branch, active: true },
      message: "تم إنشاء المستخدم بنجاح.",
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذر إنشاء المستخدم."
    return NextResponse.json({ success: false, message }, { status: 400 })
  }
}

export async function PATCH(req: NextRequest) {
  const gate = await requireAdmin()
  if (!gate.ok) return NextResponse.json({ success: false, message: gate.message }, { status: gate.status })
  try {
    const body = await req.json() as { id?: string; active?: boolean }
    const id = String(body.id ?? "").trim()
    if (!id || typeof body.active !== "boolean") {
      return NextResponse.json({ success: false, message: "بيانات تحديث حالة المستخدم غير مكتملة." }, { status: 400 })
    }
    if (id === gate.actor && body.active === false) {
      return NextResponse.json({ success: false, message: "لا يمكن إيقاف حسابك أثناء استخدامه." }, { status: 400 })
    }
    const updated = await pool.query(
      'UPDATE public."user" SET active = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING id, username, name, email, role, branch, active, "createdAt"',
      [body.active, id],
    )
    if (!updated.rowCount) return NextResponse.json({ success: false, message: "المستخدم غير موجود." }, { status: 404 })
    return NextResponse.json({ success: true, user: updated.rows[0] })
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذر تحديث المستخدم."
    return NextResponse.json({ success: false, message }, { status: 400 })
  }
}
