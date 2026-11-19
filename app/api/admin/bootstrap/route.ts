import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { pool } from "@/lib/db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-chm-bootstrap-token")
  if (!process.env.CHM_BOOTSTRAP_TOKEN || token !== process.env.CHM_BOOTSTRAP_TOKEN) {
    return NextResponse.json({ success: false, message: "رمز التهيئة غير صحيح." }, { status: 403 })
  }

  try {
    const existing = await pool.query('SELECT COUNT(*)::int AS count FROM public."user"')
    if (Number(existing.rows[0]?.count ?? 0) > 0) {
      return NextResponse.json({ success: false, message: "تم إنشاء مدير النظام مسبقاً؛ لا يمكن تكرار التهيئة." }, { status: 409 })
    }

    const body = await req.json() as { username?: string; name?: string; email?: string; password?: string }
    const username = String(body.username ?? "").trim()
    const name = String(body.name ?? "").trim()
    const email = String(body.email ?? "").trim().toLowerCase()
    const password = String(body.password ?? "")

    if (!/^[A-Za-z0-9_.]{3,30}$/.test(username)) {
      return NextResponse.json({ success: false, message: "اسم المستخدم يجب أن يكون من 3 إلى 30 حرفاً إنجليزياً أو رقماً أو (_) أو (.)." }, { status: 400 })
    }
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || password.length < 12) {
      return NextResponse.json({ success: false, message: "أدخل الاسم والبريد الصحيح وكلمة مرور لا تقل عن 12 خانة." }, { status: 400 })
    }

    const created = await auth.api.signUpEmail({
      body: { username, name, email, password },
      headers: req.headers,
    })
    if (!created.user?.id) {
      return NextResponse.json({ success: false, message: "تعذر إنشاء حساب مدير النظام." }, { status: 400 })
    }

    await pool.query(
      'UPDATE public."user" SET role = $1, branch = $2, active = TRUE WHERE id = $3',
      ["مدير النظام", "الإدارة العامة", created.user.id],
    )

    return NextResponse.json({
      success: true,
      message: "تم إنشاء حساب مدير النظام الأول. انتقل إلى صفحة الدخول واستخدم اسم المستخدم وكلمة المرور التي أدخلتهما.",
      user: { username, name, email, role: "مدير النظام", branch: "الإدارة العامة" },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذر إكمال التهيئة."
    return NextResponse.json({ success: false, message }, { status: 400 })
  }
}
