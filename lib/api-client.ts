// أدوات مساعدة لجلب البيانات عبر SWR وتنفيذ العمليات (client-side)
import type { Complaint, ReportSummary, User } from "./types"

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? "تعذّر جلب البيانات")
  }
  return res.json() as Promise<T>
}

export interface ComplaintsResponse {
  complaints: Complaint[]
}
export interface UsersResponse {
  users: User[]
}
export interface ReportResponse {
  summary: ReportSummary
  generatedAt: string
  source: "database" | "memory"
}

export async function createComplaintRequest(input: {
  title: string
  description: string
  primaryCategory: string
  subCategory: string
  secondSubCategory: string
  priority: string
  location?: string
  citizenName: string
  citizenEmail?: string
  citizenPhone?: string
}): Promise<{ complaint?: Complaint; error?: string; errors?: Record<string, string> }> {
  const res = await fetch("/api/complaints", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  return res.json()
}

export async function updateComplaintRequest(
  id: string,
  input: { status?: string; priority?: string; assignedToId?: string | null },
): Promise<{ complaint?: Complaint; error?: string }> {
  const res = await fetch(`/api/complaints/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  return res.json()
}
