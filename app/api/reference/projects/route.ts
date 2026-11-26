import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.active === false) {
    return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً." }, { status: 401 })
  }
  const isAdmin = session.user.role === "مدير النظام" || session.user.role === "إدارة عامة" || session.user.branch === "الإدارة العامة"
  const branch = session.user.branch || ""

  try {
    const projects = isAdmin
      ? await prisma.$queryRaw<Array<{ projectNumber: string; projectName: string; branch: string; data: unknown }>>`
          SELECT project_number AS "projectNumber", project_name AS "projectName", branch, data
          FROM public.chm_reference_projects
          WHERE active = true
          ORDER BY project_number
        `
      : await prisma.$queryRaw<Array<{ projectNumber: string; projectName: string; branch: string; data: unknown }>>`
          SELECT project_number AS "projectNumber", project_name AS "projectName", branch, data
          FROM public.chm_reference_projects
          WHERE active = true AND branch = ${branch}
          ORDER BY project_number
        `
    return NextResponse.json({ projects, count: projects.length })
  } catch (error) {
    console.error("تعذر تحميل مرجع المشاريع", error)
    return NextResponse.json({ error: "تعذر تحميل المشاريع المرجعية حالياً" }, { status: 503 })
  }
}
