import type { Complaint, ComplaintPriority, ComplaintStatus, User } from "./types"

const now = () => new Date().toISOString()
const complaints: Complaint[] = []
const users: User[] = [
  { username: "Faheem", name: "Faheem", email: "faheem@sfd.local", branch: "الإدارة العامة", role: "مدير النظام", active: true },
  { username: "Taiz", name: "Taiz", email: "taiz@sfd.local", branch: "فرع تعز", role: "مدخل بيانات", active: true },
]

function match(c: Complaint, filters: { status?: ComplaintStatus; category?: string; q?: string }) {
  if (filters.status && c.status !== filters.status) return false
  if (filters.category && c.category !== filters.category) return false
  const q = filters.q?.trim().toLowerCase()
  if (!q) return true
  return [c.title, c.referenceNo, c.citizenName ?? c.complainant ?? ""].some(v => v.toLowerCase().includes(q))
}

export const memoryStore = {
  listComplaints(filters: { status?: ComplaintStatus; category?: string; q?: string } = {}) {
    return complaints.filter(c => match(c, filters))
  },
  getComplaint(id: string) {
    return complaints.find(c => c.id === id || c.referenceNo === id) ?? null
  },
  createComplaint(input: { title: string; description: string; category: string; priority: ComplaintPriority; location?: string | null; citizenName: string; citizenEmail?: string | null; citizenPhone?: string | null; channel?: string }) {
    const createdAt = now()
    const complaint: Complaint = {
      id: `mem-${Date.now()}`,
      referenceNo: `CMP-${new Date().getFullYear()}-${String(1001 + complaints.length).padStart(4, "0")}`,
      title: input.title,
      description: input.description,
      category: input.category,
      priority: input.priority,
      status: "NEW",
      channel: input.channel ?? "WEB",
      citizenName: input.citizenName,
      citizenEmail: input.citizenEmail ?? null,
      citizenPhone: input.citizenPhone ?? null,
      location: input.location ?? null,
      createdAt,
      updatedAt: createdAt,
    }
    complaints.unshift(complaint)
    return complaint
  },
  updateComplaint(id: string, input: { status?: ComplaintStatus; priority?: ComplaintPriority; assignedToId?: string | null }) {
    const c = complaints.find(x => x.id === id || x.referenceNo === id)
    if (!c) return null
    if (input.status) c.status = input.status
    if (input.priority) c.priority = input.priority
    if (input.assignedToId !== undefined) c.assignedToId = input.assignedToId
    c.updatedAt = now()
    return c
  },
  listUsers() { return users },
}
