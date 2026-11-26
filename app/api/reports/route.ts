import { NextResponse } from "next/server"
import { buildReportSummary, usingDatabase } from "@/lib/data"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET /api/reports  => ملخص إحصائي للتقارير
export async function GET() {
  const summary = await buildReportSummary()
  return NextResponse.json({
    summary,
    generatedAt: new Date().toISOString(),
    source: usingDatabase ? "database" : "memory",
  })
}
