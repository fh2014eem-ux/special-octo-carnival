import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { pool } from "@/lib/db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type CategoryTree = Record<string, Record<string, string[]>>

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.active === false) {
    return NextResponse.json({ success: false, message: "يرجى تسجيل الدخول أولاً." }, { status: 401 })
  }

  try {
    const result = await pool.query(
      'SELECT primary_category, sub_category, second_sub_category FROM public.chm_reference_categories WHERE active = TRUE ORDER BY primary_category, sub_category, second_sub_category',
    )
    const categories: CategoryTree = {}
    for (const row of result.rows) {
      const main = String(row.primary_category ?? "").trim()
      const sub = String(row.sub_category ?? "").trim()
      const second = String(row.second_sub_category ?? "").trim()
      if (!main) continue
      categories[main] ??= {}
      if (!sub) continue
      categories[main][sub] ??= []
      if (second && !categories[main][sub].includes(second)) categories[main][sub].push(second)
    }
    return NextResponse.json({ success: true, categories, count: result.rowCount ?? 0 })
  } catch {
    return NextResponse.json({ success: false, message: "تعذر تحميل التصنيفات من قاعدة البيانات." }, { status: 500 })
  }
}
