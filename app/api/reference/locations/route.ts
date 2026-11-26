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

  try {
    const locations = await prisma.$queryRaw<Array<{ governorate: string; directorate: string; subDistrict: string; village: string }>>`
      SELECT governorate, directorate, sub_district AS "subDistrict", village
      FROM public.chm_reference_locations
      WHERE active = true
      ORDER BY governorate, directorate, sub_district, village
    `
    return NextResponse.json({ locations, count: locations.length })
  } catch (error) {
    console.error("تعذر تحميل مرجع المواقع", error)
    return NextResponse.json({ error: "تعذر تحميل المواقع المرجعية حالياً" }, { status: 503 })
  }
}
