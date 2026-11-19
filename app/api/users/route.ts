import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { pool } from "@/lib/db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Authenticated users see only safe user fields; branch users are scoped to their branch.
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.active === false) {
    return NextResponse.json({ success: false, message: "يرجى تسجيل الدخول أولاً." }, { status: 401 })
  }

  const isAdmin = session.user.role === "مدير النظام" && session.user.branch === "الإدارة العامة"
  const result = isAdmin
    ? await pool.query('SELECT id, username, name, email, role, branch, active FROM public."user" ORDER BY name')
    : await pool.query(
        'SELECT id, username, name, email, role, branch, active FROM public."user" WHERE branch = $1 AND active = TRUE ORDER BY name',
        [session.user.branch],
      )
  return NextResponse.json({ success: true, users: result.rows })
}
