// طبقة البيانات الموحدة لواجهات API.
// مصدر الشكاوى/العمليات الدائم هو ComplaintOperation في PostgreSQL.
// مخزن الذاكرة مخصص للتطوير والاختبار فقط، ولا يُستخدم بصمت في Production.
import { randomUUID } from "node:crypto"
import type {
  Complaint,
  ComplaintPriority,
  ComplaintStatus,
  ReportSummary,
  User,
} from "./types"
import { PRIORITY_ORDER, STATUS_ORDER } from "./types"
import { memoryStore } from "./memory-store"

export const usingDatabase =
  Boolean(process.env.DATABASE_URL) && process.env.USE_MOCK_DATA !== "true"

function useMemoryStore() {
  if (usingDatabase) return false
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "قاعدة البيانات غير مهيأة للإنتاج. يجب ضبط DATABASE_URL وتعطيل USE_MOCK_DATA.",
    )
  }
  return true
}

async function db() {
  const { prisma } = await import("./prisma")
  return prisma
}

export interface ComplaintFilters {
  status?: ComplaintStatus
  category?: string
  q?: string
}

function fromOperation(row: any): Complaint {
  const location =
    row.location ||
    [row.governorate, row.directorate, row.subDistrict, row.villageOrNeighborhood]
      .filter(Boolean)
      .join(" - ") ||
    null

  return {
    id: row.id,
    referenceNo: row.operationNumber,
    title: row.subject,
    description: row.description,
    category: row.primaryCategory || row.type || "COMPLAINT",
    priority: row.priority as ComplaintPriority,
    status: row.status as ComplaintStatus,
    channel: row.channel,
    citizenName: row.applicantName,
    citizenEmail: row.citizenEmail ?? null,
    citizenPhone: row.phone ?? null,
    location,
    assignedToId: row.assignedToId ?? null,
    assignedTo: row.assignedUser
      ? { id: row.assignedUser.id, name: row.assignedUser.name }
      : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    minuteId: row.boxMinuteId ?? null,
    project: row.projectNumber
      ? { number: row.projectNumber, name: row.projectName ?? "" }
      : null,
  }
}

const complaintInclude = {
  assignedUser: { select: { id: true, name: true } },
} as const

export async function listComplaints(
  filters: ComplaintFilters = {},
): Promise<Complaint[]> {
  if (useMemoryStore()) return memoryStore.listComplaints(filters)

  const prisma = await db()
  const rows = await prisma.complaintOperation.findMany({
    where: {
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.category ? { primaryCategory: filters.category } : {}),
      ...(filters.q
        ? {
            OR: [
              { subject: { contains: filters.q, mode: "insensitive" } },
              { operationNumber: { contains: filters.q, mode: "insensitive" } },
              { applicantName: { contains: filters.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: complaintInclude,
    orderBy: { createdAt: "desc" },
  })
  return rows.map(fromOperation)
}

export async function getComplaint(id: string): Promise<Complaint | null> {
  if (useMemoryStore()) return memoryStore.getComplaint(id)
  const prisma = await db()
  const row = await prisma.complaintOperation.findFirst({
    where: { OR: [{ id }, { operationNumber: id }] },
    include: complaintInclude,
  })
  return row ? fromOperation(row) : null
}

export interface CreateComplaintInput {
  title: string
  description: string
  category: string
  primaryCategory?: string
  subCategory?: string
  secondSubCategory?: string
  priority: ComplaintPriority
  location?: string | null
  citizenName: string
  citizenEmail?: string | null
  citizenPhone?: string | null
  channel?: string
  minuteId?: string | null
  projectId?: string | null
}

export async function createComplaint(
  input: CreateComplaintInput,
): Promise<Complaint> {
  if (useMemoryStore()) return memoryStore.createComplaint(input)

  const prisma = await db()
  const year = new Date().getFullYear()
  const referenceNo = `CMP-${year}-${randomUUID().slice(0, 8).toUpperCase()}`
  const row = await prisma.complaintOperation.create({
    data: {
      operationNumber: referenceNo,
      type: "شكوى",
      status: "NEW",
      priority: input.priority,
      channel: input.channel ?? "WEB",
      applicantName: input.citizenName,
      gender: "",
      phone: input.citizenPhone ?? "",
      citizenEmail: input.citizenEmail ?? null,
      location: input.location ?? null,
      subject: input.title,
      description: input.description,
      primaryCategory: input.primaryCategory ?? input.category,
      subCategory: input.subCategory ?? null,
      secondSubCategory: input.secondSubCategory ?? null,
      boxMinuteId: input.minuteId ?? null,
    },
    include: complaintInclude,
  })
  return fromOperation(row)
}

export interface UpdateComplaintInput {
  status?: ComplaintStatus
  priority?: ComplaintPriority
  assignedToId?: string | null
}

export async function updateComplaint(
  id: string,
  input: UpdateComplaintInput,
): Promise<Complaint | null> {
  if (useMemoryStore()) return memoryStore.updateComplaint(id, input)

  const prisma = await db()
  const existing = await prisma.complaintOperation.findFirst({
    where: { OR: [{ id }, { operationNumber: id }] },
    select: { id: true },
  })
  if (!existing) return null

  const row = await prisma.complaintOperation.update({
    where: { id: existing.id },
    data: {
      ...(input.status ? { status: input.status } : {}),
      ...(input.priority ? { priority: input.priority } : {}),
      ...(input.assignedToId !== undefined
        ? { assignedToId: input.assignedToId }
        : {}),
    },
    include: complaintInclude,
  })
  return fromOperation(row)
}

export async function listUsers(): Promise<User[]> {
  if (useMemoryStore()) return memoryStore.listUsers()
  const prisma = await db()
  const rows = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      branch: true,
      role: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { name: "asc" },
  })
  return rows.map((row: {
    id: string; username: string; name: string; email: string | null; branch: string;
    role: string; active: boolean; createdAt: Date; updatedAt: Date;
  }) => ({
    id: row.id,
    username: row.username,
    name: row.name,
    email: row.email ?? "",
    branch: row.branch,
    role: row.role,
    active: row.active,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }))
}

// ==== حساب ملخص التقارير من العمليات المخزنة ====
export async function buildReportSummary(): Promise<ReportSummary> {
  const rows = await listComplaints()
  const total = rows.length

  const byStatus = Object.fromEntries(
    STATUS_ORDER.map((s) => [s, 0]),
  ) as ReportSummary["byStatus"]
  const byPriority = Object.fromEntries(
    PRIORITY_ORDER.map((p) => [p, 0]),
  ) as ReportSummary["byPriority"]
  const byCategory: Record<string, number> = {}

  let resolvedCount = 0
  let resolutionDaysSum = 0
  let resolutionSamples = 0

  for (const complaint of rows) {
    byStatus[complaint.status] = (byStatus[complaint.status] ?? 0) + 1
    byPriority[complaint.priority] = (byPriority[complaint.priority] ?? 0) + 1
    byCategory[complaint.category] = (byCategory[complaint.category] ?? 0) + 1

    if (complaint.status === "RESOLVED" || complaint.status === "CLOSED") {
      resolvedCount++
      const created = new Date(complaint.createdAt).getTime()
      const updated = new Date(complaint.updatedAt ?? complaint.createdAt).getTime()
      const days = Math.max(0, (updated - created) / (1000 * 60 * 60 * 24))
      resolutionDaysSum += days
      resolutionSamples++
    }
  }

  return {
    total,
    byStatus,
    byCategory,
    byPriority,
    resolvedRate: total ? Math.round((resolvedCount / total) * 100) : 0,
    avgResolutionDays: resolutionSamples
      ? Math.round((resolutionDaysSum / resolutionSamples) * 10) / 10
      : 0,
  }
}
