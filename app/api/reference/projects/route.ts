import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const projects = await prisma.$queryRaw<Array<{ projectNumber: string; projectName: string; branch: string; data: unknown }>>`
      SELECT project_number AS "projectNumber", project_name AS "projectName", branch, data
      FROM public.chm_reference_projects
      WHERE active = true
      ORDER BY project_number
    `
    return NextResponse.json({ projects, count: projects.length })
  } catch (error) {
    console.error("تعذر تحميل مرجع المشاريع", error)
    return NextResponse.json({ error: "تعذر تحميل المشاريع المرجعية حالياً" }, { status: 503 })
  }
}
