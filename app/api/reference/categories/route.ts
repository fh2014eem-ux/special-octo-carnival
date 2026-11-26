import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const categories = await prisma.$queryRaw<
      Array<{
        primaryCategory: string
        subCategory: string
        secondSubCategory: string
      }>
    >`
      SELECT
        primary_category AS "primaryCategory",
        sub_category AS "subCategory",
        second_sub_category AS "secondSubCategory"
      FROM public.chm_reference_categories
      WHERE active = true
      ORDER BY primary_category, sub_category, second_sub_category
    `

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("تعذر تحميل مرجع التصنيفات", error)
    return NextResponse.json(
      { error: "تعذر تحميل التصنيفات المرجعية حالياً" },
      { status: 503 },
    )
  }
}
