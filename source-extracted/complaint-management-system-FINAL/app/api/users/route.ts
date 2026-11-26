import { NextResponse } from "next/server"
import { listUsers } from "@/lib/data"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET /api/users  => جلب قائمة المستخدمين (للإسناد)
export async function GET() {
  const users = await listUsers()
  return NextResponse.json({ users })
}
