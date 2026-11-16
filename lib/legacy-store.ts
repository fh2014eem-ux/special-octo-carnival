// مخزن بيانات في الذاكرة يُستخدم عند غياب DATABASE_URL
// يوفّر بيانات تجريبية حتى تعمل المعاينة والواجهات دون قاعدة بيانات.
import type {
  AwarenessActivity,
  AwarenessType,
  ComplaintBox,
  BoxOpeningMinute,
  BoxStatus,
  Complaint,
  ComplaintChannel,
  ComplaintPriority,
  ComplaintStatus,
  InventoryItem,
  InventoryKind,
  Project,
  User,
} from "./types"

function iso(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}

const seedUsers: User[] = [
  {
    id: "u_admin",
    username: "admin",
    name: "سارة العتيبي",
    email: "admin@chm.local",
    phone: "0500000001",
    role: "مدير النظام",
    branch: "الإدارة العامة",
    active: true,
    createdAt: iso(120),
    updatedAt: iso(120),
  },
  {
    id: "u_agent1",
    username: "khaled",
    name: "خالد المطيري",
    email: "khaled@chm.local",
    phone: "0500000002",
    role: "مدخل بيانات",
    branch: "فرع تعز",
    active: true,
    createdAt: iso(90),
    updatedAt: iso(90),
  },
  {
    id: "u_agent2",
    username: "noura",
    name: "نورة القحطاني",
    email: "noura@chm.local",
    phone: "0500000003",
    role: "مدخل بيانات",
    branch: "فرع عدن",
    active: true,
    createdAt: iso(60),
    updatedAt: iso(60),
  },
]

const seedProjects: Project[] = [
  {
    id: "p_1",
    name: "مشروع تطوير حي الروضة",
    code: "PRJ-RWD",
    location: "حي الروضة",
    createdAt: iso(150),
    updatedAt: iso(150),
  },
  {
    id: "p_2",
    name: "مشروع الحدائق العامة",
    code: "PRJ-PRK",
    location: "حديقة الملك فهد",
    createdAt: iso(140),
    updatedAt: iso(140),
  },
  {
    id: "p_3",
    name: "مشروع صيانة الطرق",
    code: "PRJ-RDS",
    location: "طريق الملك عبدالعزيز",
    createdAt: iso(130),
    updatedAt: iso(130),
  },
]

const seedBoxes: ComplaintBox[] = [
  {
    id: "b_1",
    code: "BOX-001",
    projectId: "p_1",
    location: "مدخل مركز الحي - الروضة",
    status: "ACTIVE",
    installedAt: iso(100),
    createdAt: iso(100),
    updatedAt: iso(20),
  },
  {
    id: "b_2",
    code: "BOX-002",
    projectId: "p_2",
    location: "البوابة الرئيسية للحديقة",
    status: "ACTIVE",
    installedAt: iso(80),
    createdAt: iso(80),
    updatedAt: iso(15),
  },
  {
    id: "b_3",
    code: "BOX-003",
    projectId: "p_3",
    location: "مكتب إشراف المشروع",
    status: "COLLECTED",
    installedAt: iso(70),
    createdAt: iso(70),
    updatedAt: iso(10),
  },
]

const seedMinutes: BoxOpeningMinute[] = [
  {
    id: "m_1",
    minuteNo: "MIN-2026-001",
    boxId: "b_1",
    projectId: "p_1",
    openedAt: iso(20),
    totalCount: 12,
    validCount: 8,
    suggestionCount: 2,
    blankCount: 1,
    invalidCount: 1,
    notes: "تم الفتح بحضور لجنة من ثلاثة أعضاء.",
    createdAt: iso(20),
  },
  {
    id: "m_2",
    minuteNo: "MIN-2026-002",
    boxId: "b_2",
    projectId: "p_2",
    openedAt: iso(15),
    totalCount: 7,
    validCount: 5,
    suggestionCount: 1,
    blankCount: 0,
    invalidCount: 1,
    notes: null,
    createdAt: iso(15),
  },
]

const seedInventory: InventoryItem[] = [
  {
    id: "inv_sticker",
    kind: "STICKER",
    name: "ملصقات توعوية",
    quantity: 480,
    unit: "قطعة",
    updatedAt: iso(5),
  },
  {
    id: "inv_brochure",
    kind: "BROCHURE",
    name: "بروشورات تعريفية",
    quantity: 320,
    unit: "قطعة",
    updatedAt: iso(5),
  },
  {
    id: "inv_box",
    kind: "BOX",
    name: "صناديق شكاوى",
    quantity: 25,
    unit: "صندوق",
    updatedAt: iso(5),
  },
  {
    id: "inv_book",
    kind: "MINUTE_BOOK",
    name: "دفاتر محاضر",
    quantity: 40,
    unit: "دفتر",
    updatedAt: iso(5),
  },
]

const seedAwareness: AwarenessActivity[] = [
  {
    id: "aw_1",
    projectId: "p_1",
    type: "BASIC",
    date: iso(25),
    location: "ساحة حي الروضة",
    audienceCount: 60,
    stickersUsed: 40,
    brochuresUsed: 55,
    notes: "حملة تعريفية بآلية تقديم الشكاوى.",
    createdAt: iso(25),
  },
  {
    id: "aw_2",
    projectId: "p_2",
    type: "RECURRING",
    date: iso(12),
    location: "الحديقة العامة",
    audienceCount: 35,
    stickersUsed: 20,
    brochuresUsed: 25,
    notes: null,
    createdAt: iso(12),
  },
]

const agentName = (id?: string | null) =>
  seedUsers.find((u) => u.id === id)?.name ?? null

const rawComplaints: Array<
  Omit<Complaint, "assignedTo" | "minute" | "project"> & {
    assignedToId: string | null
    minuteId: string | null
    projectId: string | null
  }
> = [
  {
    id: "c_1001",
    referenceNo: "CMP-2026-1001",
    title: "انقطاع متكرر للتيار الكهربائي",
    description:
      "ينقطع التيار الكهربائي بشكل يومي في حي الروضة لمدة تتجاوز الساعتين مما يؤثر على المنازل والمحلات.",
    category: "كهرباء ومياه",
    status: "IN_PROGRESS",
    priority: "HIGH",
    location: "حي الروضة - شارع 15",
    citizenName: "عبدالله الشمري",
    citizenEmail: "abdullah@example.com",
    citizenPhone: "0551112233",
    assignedToId: "u_agent1",
    channel: "BOX",
    minuteId: "m_1",
    projectId: "p_1",
    createdAt: iso(5),
    updatedAt: iso(2),
  },
  {
    id: "c_1002",
    referenceNo: "CMP-2026-1002",
    title: "تراكم النفايات في الحديقة العامة",
    description:
      "لم يتم رفع النفايات من الحديقة العامة منذ أسبوع، وبدأت الروائح تنتشر في المنطقة.",
    category: "نظافة وبيئة",
    status: "NEW",
    priority: "MEDIUM",
    location: "حديقة الملك فهد",
    citizenName: "منى العنزي",
    citizenEmail: "mona@example.com",
    citizenPhone: "0552223344",
    assignedToId: null,
    channel: "ONLINE",
    minuteId: null,
    projectId: null,
    createdAt: iso(1),
    updatedAt: iso(1),
  },
  {
    id: "c_1003",
    referenceNo: "CMP-2026-1003",
    title: "حفرة خطرة في الطريق",
    description:
      "توجد حفرة كبيرة في منتصف الطريق تسببت في أضرار لعدة مركبات وتشكل خطراً على السلامة.",
    category: "طرق ومواصلات",
    status: "RESOLVED",
    priority: "URGENT",
    location: "طريق الملك عبدالعزيز",
    citizenName: "فيصل الدوسري",
    citizenEmail: "faisal@example.com",
    citizenPhone: "0553334455",
    assignedToId: "u_agent2",
    channel: "PHONE",
    minuteId: null,
    projectId: "p_3",
    createdAt: iso(14),
    updatedAt: iso(3),
  },
  {
    id: "c_1004",
    referenceNo: "CMP-2026-1004",
    title: "تأخر معاملة إدارية",
    description:
      "قدمت طلباً لإصدار رخصة قبل شهر ولم يتم الرد عليه حتى الآن رغم اكتمال المستندات.",
    category: "شكوى إدارية",
    status: "IN_PROGRESS",
    priority: "LOW",
    location: null,
    citizenName: "ريم الحربي",
    citizenEmail: "reem@example.com",
    citizenPhone: "0554445566",
    assignedToId: "u_agent1",
    channel: "IN_PERSON",
    minuteId: null,
    projectId: null,
    createdAt: iso(10),
    updatedAt: iso(4),
  },
  {
    id: "c_1005",
    referenceNo: "CMP-2026-1005",
    title: "ضعف ضغط المياه",
    description:
      "ضعف شديد في ضغط المياه في الأدوار العليا خلال ساعات النهار.",
    category: "كهرباء ومياه",
    status: "NEW",
    priority: "MEDIUM",
    location: "حي النخيل",
    citizenName: "طارق السبيعي",
    citizenEmail: null,
    citizenPhone: "0555556677",
    assignedToId: null,
    channel: "BOX",
    minuteId: "m_1",
    projectId: "p_1",
    createdAt: iso(0),
    updatedAt: iso(0),
  },
  {
    id: "c_1006",
    referenceNo: "CMP-2026-1006",
    title: "إشارة مرور معطلة",
    description: "إشارة المرور في التقاطع الرئيسي معطلة منذ يومين مما يسبب ازدحاماً.",
    category: "طرق ومواصلات",
    status: "CLOSED",
    priority: "HIGH",
    location: "تقاطع العليا",
    citizenName: "هند الزهراني",
    citizenEmail: "hind@example.com",
    citizenPhone: "0556667788",
    assignedToId: "u_agent2",
    channel: "ONLINE",
    minuteId: null,
    projectId: null,
    createdAt: iso(20),
    updatedAt: iso(8),
  },
  {
    id: "c_1007",
    referenceNo: "CMP-2026-1007",
    title: "طلب غير مبرر لرسوم إضافية",
    description: "تم مطالبتي برسوم إضافية غير موضحة في لائحة الخدمات.",
    category: "شكوى إدارية",
    status: "REJECTED",
    priority: "LOW",
    location: null,
    citizenName: "ماجد الغامدي",
    citizenEmail: "majed@example.com",
    citizenPhone: "0557778899",
    assignedToId: "u_agent1",
    channel: "PHONE",
    minuteId: null,
    projectId: null,
    createdAt: iso(18),
    updatedAt: iso(12),
  },
  {
    id: "c_1008",
    referenceNo: "CMP-2026-1008",
    title: "عدم توفر إنارة في الشارع",
    description: "الشارع مظلم تماماً في الليل بسبب تعطل أعمدة الإنارة.",
    category: "بنية تحتية",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    location: "حي الياسمين",
    citizenName: "سلمى القرني",
    citizenEmail: "salma@example.com",
    citizenPhone: "0558889900",
    assignedToId: "u_agent2",
    channel: "BOX",
    minuteId: "m_2",
    projectId: "p_2",
    createdAt: iso(7),
    updatedAt: iso(1),
  },
]

// نُسخ قابلة للتعديل في الذاكرة
let users: User[] = [...seedUsers]
let projects: Project[] = seedProjects.map((p) => ({ ...p }))
let boxes: ComplaintBox[] = seedBoxes.map((b) => ({ ...b }))
let minutes: BoxOpeningMinute[] = seedMinutes.map((m) => ({ ...m }))
let inventory: InventoryItem[] = seedInventory.map((i) => ({ ...i }))
let awareness: AwarenessActivity[] = seedAwareness.map((a) => ({ ...a }))
let complaints = rawComplaints.map((c) => ({ ...c }))

let counter = 1009
let boxCounter = 4
let minuteCounter = 3
let awarenessCounter = 3
const projectRef = (id?: string | null) => {
  const p = projects.find((x) => x.id === id)
  return p ? { id: p.id, name: p.name, code: p.code } : null
}

function withAgent(c: (typeof complaints)[number]): Complaint {
  return {
    ...c,
    assignedTo: c.assignedToId
      ? { id: c.assignedToId, name: agentName(c.assignedToId) ?? "" }
      : null,
    minute: c.minuteId
      ? (() => {
          const m = minutes.find((x) => x.id === c.minuteId)
          return m ? { id: m.id, minuteNo: m.minuteNo } : null
        })()
      : null,
    project: projectRef(c.projectId),
  }
}

function withProject<T extends { projectId: string }>(row: T) {
  return { ...row, project: projectRef(row.projectId) }
}

function boxRef(id?: string | null) {
  const b = boxes.find((x) => x.id === id)
  return b ? { id: b.id, code: b.code } : null
}

// خصم كمية من صنف مخزون (لا يقل عن صفر)
function decrementInventory(kind: InventoryKind, amount: number) {
  if (amount <= 0) return
  const idx = inventory.findIndex((i) => i.kind === kind)
  if (idx === -1) return
  inventory[idx] = {
    ...inventory[idx],
    quantity: Math.max(0, inventory[idx].quantity - amount),
    updatedAt: new Date().toISOString(),
  }
}

export const memoryStore = {
  listUsers(): User[] {
    return [...users].sort((a, b) => a.name.localeCompare(b.name, "ar"))
  },

  // ==== المشاريع ====
  listProjects(): Project[] {
    return [...projects].sort((a, b) => a.name.localeCompare(b.name, "ar"))
  },

  // ==== الشكاوى ====
  listComplaints(filters?: {
    status?: ComplaintStatus
    category?: string
    channel?: ComplaintChannel
    q?: string
  }): Complaint[] {
    let rows = complaints.map(withAgent)
    if (filters?.status) rows = rows.filter((c) => c.status === filters.status)
    if (filters?.category)
      rows = rows.filter((c) => c.category === filters.category)
    if (filters?.channel)
      rows = rows.filter((c) => c.channel === filters.channel)
    if (filters?.q) {
      const q = filters.q.trim().toLowerCase()
      rows = rows.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.referenceNo.toLowerCase().includes(q) ||
          c.citizenName.toLowerCase().includes(q),
      )
    }
    return rows.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  },

  getComplaint(id: string): Complaint | null {
    const c = complaints.find((x) => x.id === id || x.referenceNo === id)
    return c ? withAgent(c) : null
  },

  createComplaint(input: {
    title: string
    description: string
    category: string
    priority: ComplaintPriority
    location?: string | null
    citizenName: string
    citizenEmail?: string | null
    citizenPhone?: string | null
    channel: ComplaintChannel
    minuteId?: string | null
    projectId?: string | null
  }): Complaint {
    const now = new Date().toISOString()
    const row = {
      id: `c_${counter}`,
      referenceNo: `CMP-2026-${counter}`,
      title: input.title,
      description: input.description,
      category: input.category,
      status: "NEW" as ComplaintStatus,
      priority: input.priority,
      location: input.location ?? null,
      citizenName: input.citizenName,
      citizenEmail: input.citizenEmail ?? null,
      citizenPhone: input.citizenPhone ?? null,
      assignedToId: null as string | null,
      channel: input.channel,
      minuteId: input.minuteId ?? null,
      projectId: input.projectId ?? null,
      createdAt: now,
      updatedAt: now,
    }
    counter++
    complaints = [row, ...complaints]
    return withAgent(row)
  },

  updateComplaint(
    id: string,
    input: {
      status?: ComplaintStatus
      priority?: ComplaintPriority
      assignedToId?: string | null
    },
  ): Complaint | null {
    const idx = complaints.findIndex(
      (x) => x.id === id || x.referenceNo === id,
    )
    if (idx === -1) return null
    complaints[idx] = {
      ...complaints[idx],
      ...(input.status ? { status: input.status } : {}),
      ...(input.priority ? { priority: input.priority } : {}),
      ...(input.assignedToId !== undefined
        ? { assignedToId: input.assignedToId }
        : {}),
      updatedAt: new Date().toISOString(),
    }
    return withAgent(complaints[idx])
  },

  // ==== صناديق الشكاوى ====
  listBoxes(filters?: { projectId?: string; status?: BoxStatus; q?: string }): ComplaintBox[] {
    let rows = boxes.map(withProject)
    if (filters?.projectId)
      rows = rows.filter((b) => b.projectId === filters.projectId)
    if (filters?.status) rows = rows.filter((b) => b.status === filters.status)
    if (filters?.q) {
      const q = filters.q.trim().toLowerCase()
      rows = rows.filter(
        (b) =>
          b.code.toLowerCase().includes(q) ||
          (b.location ?? "").toLowerCase().includes(q) ||
          (b.project?.name ?? "").toLowerCase().includes(q),
      )
    }
    return rows.sort(
      (a, b) =>
        new Date(b.installedAt).getTime() - new Date(a.installedAt).getTime(),
    )
  },

  getBox(id: string): ComplaintBox | null {
    const b = boxes.find((x) => x.id === id || x.code === id)
    return b ? withProject(b) : null
  },

  // توثيق تعليق صندوق جديد (يخصم صندوقاً ودفتر محاضر من المخزون)
  createBox(input: {
    code: string
    projectId: string
    location?: string | null
    installedAt?: string | null
  }): ComplaintBox {
    const now = new Date().toISOString()
    const row: ComplaintBox = {
      id: `b_${boxCounter}`,
      code: input.code,
      projectId: input.projectId,
      location: input.location ?? null,
      status: "ACTIVE",
      installedAt: input.installedAt ?? now,
      createdAt: now,
      updatedAt: now,
    }
    boxCounter++
    boxes = [row, ...boxes]
    decrementInventory("BOX", 1)
    decrementInventory("MINUTE_BOOK", 1)
    return withProject(row)
  },

  updateBoxStatus(id: string, status: BoxStatus): ComplaintBox | null {
    const idx = boxes.findIndex((x) => x.id === id || x.code === id)
    if (idx === -1) return null
    boxes[idx] = {
      ...boxes[idx],
      status,
      updatedAt: new Date().toISOString(),
    }
    return withProject(boxes[idx])
  },

  // ==== محاضر فتح الصناديق ====
  listMinutes(filters?: { projectId?: string; boxId?: string; q?: string }): BoxOpeningMinute[] {
    let rows = minutes.map((m) => ({
      ...m,
      box: boxRef(m.boxId),
      project: projectRef(m.projectId),
    }))
    if (filters?.projectId)
      rows = rows.filter((m) => m.projectId === filters.projectId)
    if (filters?.boxId) rows = rows.filter((m) => m.boxId === filters.boxId)
    if (filters?.q) {
      const q = filters.q.trim().toLowerCase()
      rows = rows.filter(
        (m) =>
          m.minuteNo.toLowerCase().includes(q) ||
          (m.box?.code ?? "").toLowerCase().includes(q) ||
          (m.project?.name ?? "").toLowerCase().includes(q),
      )
    }
    return rows.sort(
      (a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime(),
    )
  },

  getMinute(id: string): BoxOpeningMinute | null {
    const m = minutes.find((x) => x.id === id || x.minuteNo === id)
    if (!m) return null
    return { ...m, box: boxRef(m.boxId), project: projectRef(m.projectId) }
  },

  createMinute(input: {
    minuteNo: string
    boxId: string
    projectId: string
    openedAt?: string | null
    totalCount: number
    validCount: number
    suggestionCount: number
    blankCount: number
    invalidCount: number
    notes?: string | null
  }): BoxOpeningMinute {
    const now = new Date().toISOString()
    const row: BoxOpeningMinute = {
      id: `m_${minuteCounter}`,
      minuteNo: input.minuteNo,
      boxId: input.boxId,
      projectId: input.projectId,
      openedAt: input.openedAt ?? now,
      totalCount: input.totalCount,
      validCount: input.validCount,
      suggestionCount: input.suggestionCount,
      blankCount: input.blankCount,
      invalidCount: input.invalidCount,
      notes: input.notes ?? null,
      createdAt: now,
    }
    minuteCounter++
    minutes = [row, ...minutes]
    // تحديث حالة الصندوق إلى "تم التفريغ"
    const bIdx = boxes.findIndex((b) => b.id === input.boxId)
    if (bIdx !== -1)
      boxes[bIdx] = {
        ...boxes[bIdx],
        status: "COLLECTED",
        updatedAt: now,
      }
    return { ...row, box: boxRef(row.boxId), project: projectRef(row.projectId) }
  },

  // ==== المخزون ====
  listInventory(): InventoryItem[] {
    const order: InventoryKind[] = ["STICKER", "BROCHURE", "BOX", "MINUTE_BOOK"]
    return [...inventory].sort(
      (a, b) => order.indexOf(a.kind) - order.indexOf(b.kind),
    )
  },

  adjustInventory(kind: InventoryKind, delta: number): InventoryItem | null {
    const idx = inventory.findIndex((i) => i.kind === kind)
    if (idx === -1) return null
    inventory[idx] = {
      ...inventory[idx],
      quantity: Math.max(0, inventory[idx].quantity + delta),
      updatedAt: new Date().toISOString(),
    }
    return { ...inventory[idx] }
  },

  // ==== أنشطة التوعية ====
  listAwareness(filters?: {
    projectId?: string
    type?: AwarenessType
    q?: string
  }): AwarenessActivity[] {
    let rows = awareness.map(withProject)
    if (filters?.projectId)
      rows = rows.filter((a) => a.projectId === filters.projectId)
    if (filters?.type) rows = rows.filter((a) => a.type === filters.type)
    if (filters?.q) {
      const q = filters.q.trim().toLowerCase()
      rows = rows.filter(
        (a) =>
          (a.location ?? "").toLowerCase().includes(q) ||
          (a.project?.name ?? "").toLowerCase().includes(q) ||
          (a.notes ?? "").toLowerCase().includes(q),
      )
    }
    return rows.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  },

  // إنشاء نشاط توعية (يخصم الملصقات والبروشورات من المخزون)
  createAwareness(input: {
    projectId: string
    type: AwarenessType
    date?: string | null
    location?: string | null
    audienceCount: number
    stickersUsed: number
    brochuresUsed: number
    notes?: string | null
  }): AwarenessActivity {
    const now = new Date().toISOString()
    const row: AwarenessActivity = {
      id: `aw_${awarenessCounter}`,
      projectId: input.projectId,
      type: input.type,
      date: input.date ?? now,
      location: input.location ?? null,
      audienceCount: input.audienceCount,
      stickersUsed: input.stickersUsed,
      brochuresUsed: input.brochuresUsed,
      notes: input.notes ?? null,
      createdAt: now,
    }
    awarenessCounter++
    awareness = [row, ...awareness]
    decrementInventory("STICKER", input.stickersUsed)
    decrementInventory("BROCHURE", input.brochuresUsed)
    return withProject(row)
  },

  reset() {
    users = [...seedUsers]
    projects = seedProjects.map((p) => ({ ...p }))
    boxes = seedBoxes.map((b) => ({ ...b }))
    minutes = seedMinutes.map((m) => ({ ...m }))
    inventory = seedInventory.map((i) => ({ ...i }))
    awareness = seedAwareness.map((a) => ({ ...a }))
    complaints = rawComplaints.map((c) => ({ ...c }))
    counter = 1009
    boxCounter = 4
    minuteCounter = 3
    awarenessCounter = 3
  },
}
