// طبقة الوصول للبيانات لنظام الشكاوى.
import {
  complaints as seedComplaints,
  type Complaint,
  type ComplaintPriority,
  type ComplaintStatus,
} from "./mock-data"

export type ComplaintInput = {
  title: string
  description: string
  citizen: string
  category: string
  department: string
  channel: string
  priority: ComplaintPriority
  location?: string | null
  phone?: string | null
  email?: string | null
}

export type ComplaintListFilters = {
  status?: ComplaintStatus | "all"
  query?: string
}

// المخزن الاحتياطي داخل الذاكرة
const globalForStore = globalThis as unknown as {
  __complaints?: Complaint[]
  __reports?: SavedReport[]
}
const store = (globalForStore.__complaints ??= seedComplaints.map((c) => ({ ...c })))

async function getDb() {
  // التحقق من متغير البيانات الوهمية أو غياب رابط قاعدة البيانات
  if (process.env.USE_MOCK_DATA === "true" || !process.env.DATABASE_URL) {
    return null
  }
  try {
    const { prisma } = await import("./prisma")
    return prisma
  } catch (error) {
    console.log(
      "[v0] Prisma client unavailable, falling back to in-memory store:",
      (error as Error).message,
    )
    return null
  }
}

const toStatusEnum = (s: ComplaintStatus) =>
  s.toUpperCase() as "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
const toPriorityEnum = (p: ComplaintPriority) =>
  p.toUpperCase() as "LOW" | "MEDIUM" | "HIGH" | "URGENT"

type PrismaComplaintRow = {
  reference: string
  title: string
  citizen: string
  category: string
  department: string
  status: string
  priority: string
  channel: string
  description: string
  createdAt: Date
}

function fromDb(row: PrismaComplaintRow): Complaint {
  return {
    id: row.reference,
    title: row.title,
    citizen: row.citizen,
    category: row.category,
    department: row.department,
    status: row.status.toLowerCase() as ComplaintStatus,
    priority: row.priority.toLowerCase() as ComplaintPriority,
    channel: row.channel,
    createdAt: row.createdAt.toISOString().slice(0, 10),
    description: row.description,
  }
}

function matchesFilters(c: Complaint, filters: ComplaintListFilters) {
  const status = filters.status ?? "all"
  const q = (filters.query ?? "").trim().toLowerCase()
  const matchesStatus = status === "all" || c.status === status
  const matchesQuery =
    !q ||
    c.title.toLowerCase().includes(q) ||
    c.citizen.toLowerCase().includes(q) ||
    c.id.toLowerCase().includes(q)
  return matchesStatus && matchesQuery
}

function generateReference(existing: string[]) {
  const numbers = existing
    .map((ref) => Number(ref.replace(/[^0-9]/g, "")))
    .filter((n) => !Number.isNaN(n))
  const max = numbers.length ? Math.max(...numbers) : 1042
  return `CMP-${max + 1}`
}

export async function listComplaints(filters: ComplaintListFilters = {}): Promise<Complaint[]> {
  const db = await getDb()
  if (db) {
    const rows = await db.complaint.findMany({ orderBy: { createdAt: "desc" } })
    return rows.map(fromDb).filter((c) => matchesFilters(c, filters))
  }
  return store
    .filter((c) => matchesFilters(c, filters))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function getComplaint(reference: string): Promise<Complaint | null> {
  const db = await getDb()
  if (db) {
    const row = await db.complaint.findUnique({ where: { reference } })
    return row ? fromDb(row) : null
  }
  return store.find((c) => c.id === reference) ?? null
}

export async function createComplaint(input: ComplaintInput): Promise<Complaint> {
  const db = await getDb()
  if (db) {
    const refs = (await db.complaint.findMany({ select: { reference: true } })).map(
      (r) => r.reference,
    )
    const reference = generateReference(refs)
    const row = await db.complaint.create({
      data: {
        reference,
        title: input.title,
        description: input.description,
        citizen: input.citizen,
        category: input.category,
        department: input.department,
        channel: input.channel,
        status: "NEW",
        priority: toPriorityEnum(input.priority),
        location: input.location ?? null,
        phone: input.phone ?? null,
        email: input.email ?? null,
      },
    })
    return fromDb(row)
  }

  const reference = generateReference(store.map((c) => c.id))
  const complaint: Complaint = {
    id: reference,
    title: input.title,
    description: input.description,
    citizen: input.citizen,
    category: input.category,
    department: input.department,
    channel: input.channel,
    status: "new",
    priority: input.priority,
    createdAt: new Date().toISOString().slice(0, 10),
  }
  store.unshift(complaint)
  return complaint
}

export async function updateComplaintStatus(
  reference: string,
  status: ComplaintStatus,
): Promise<Complaint | null> {
  const db = await getDb()
  if (db) {
    try {
      const row = await db.complaint.update({
        where: { reference },
        data: { status: toStatusEnum(status) },
      })
      return fromDb(row)
    } catch {
      return null
    }
  }
  const complaint = store.find((c) => c.id === reference)
  if (!complaint) return null
  complaint.status = status
  return complaint
}

// ---------- التحليلات والتقارير ----------

export type ComplaintStats = {
  total: number
  byStatus: Record<ComplaintStatus, number>
  byPriority: Record<ComplaintPriority, number>
  byCategory: { category: string; value: number }[]
  generatedAt: string
}

export async function getComplaintStats(): Promise<ComplaintStats> {
  const all = await listComplaints()
  const byStatus: Record<ComplaintStatus, number> = {
    new: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
  }
  const byPriority: Record<ComplaintPriority, number> = {
    low: 0,
    medium: 0,
    high: 0,
    urgent: 0,
  }
  const categoryMap = new Map<string, number>()
  for (const c of all) {
    byStatus[c.status] += 1
    byPriority[c.priority] += 1
    categoryMap.set(c.category, (categoryMap.get(c.category) ?? 0) + 1)
  }
  return {
    total: all.length,
    byStatus,
    byPriority,
    byCategory: [...categoryMap.entries()].map(([category, value]) => ({ category, value })),
    generatedAt: new Date().toISOString(),
  }
}

export type SavedReport = {
  id: string
  title: string
  type: string
  data: unknown
  createdAt: string
}

const reportStore = (globalForStore.__reports ??= [])

export async function listReports(): Promise<SavedReport[]> {
  const db = await getDb()
  if (db) {
    const rows = await db.report.findMany({ orderBy: { createdAt: "desc" } })
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      type: r.type,
      data: r.data,
      createdAt: r.createdAt.toISOString(),
    }))
  }
  return reportStore
}

export async function createReport(input: {
  title: string
  type: string
  data: unknown
}): Promise<SavedReport> {
  const db = await getDb()
  if (db) {
    const row = await db.report.create({
      data: {
        title: input.title,
        type: input.type,
        data: input.data as object,
      },
    })
    return {
      id: row.id,
      title: row.title,
      type: row.type,
      data: row.data,
      createdAt: row.createdAt.toISOString(),
    }
  }
  const report: SavedReport = {
    id: `RPT-${Date.now()}`,
    title: input.title,
    type: input.type,
    data: input.data,
    createdAt: new Date().toISOString(),
  }
  reportStore.unshift(report)
  return report
}