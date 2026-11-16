import { NextResponse } from "next/server"
import { getComplaint, updateComplaint } from "@/lib/data"
import { PRIORITY_ORDER, STATUS_ORDER } from "@/lib/types"
import type { ComplaintPriority, ComplaintStatus } from "@/lib/types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET /api/complaints/[id]  => جلب شكوى واحدة
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const complaint = await getComplaint(id)
  if (!complaint) {
    return NextResponse.json({ error: "الشكوى غير موجودة" }, { status: 404 })
  }
  return NextResponse.json({ complaint })
}

// PATCH /api/complaints/[id]  => تحديث حالة/أولوية/إسناد الشكوى
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "صيغة الطلب غير صحيحة" }, { status: 400 })
  }

  const status = body.status as ComplaintStatus | undefined
  const priority = body.priority as ComplaintPriority | undefined

  if (status && !STATUS_ORDER.includes(status)) {
    return NextResponse.json({ error: "حالة غير صحيحة" }, { status: 422 })
  }
  if (priority && !PRIORITY_ORDER.includes(priority)) {
    return NextResponse.json({ error: "أولوية غير صحيحة" }, { status: 422 })
  }

  const updated = await updateComplaint(id, {
    status,
    priority,
    assignedToId:
      body.assignedToId === undefined
        ? undefined
        : body.assignedToId === null || body.assignedToId === ""
          ? null
          : String(body.assignedToId),
  })

  if (!updated) {
    return NextResponse.json({ error: "الشكوى غير موجودة" }, { status: 404 })
  }
  return NextResponse.json({ complaint: updated })
}
