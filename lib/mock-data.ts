import type {
  Complaint,
  FieldActivity,
  ComplaintBox,
  OpeningMinute,
  InventoryItem,
  InventoryMovement,
} from "@/lib/types"

// بيانات تجريبية للعرض قبل ربط قاعدة البيانات (Prisma / PostgreSQL)

export const complaints: Complaint[] = [
  {
    id: "c1",
    referenceNo: "CMP-2026-0001",
    title: "تأخر توزيع المساعدات الغذائية",
    description: "شكوى من تأخر وصول السلال الغذائية للمستفيدين في القرية.",
    category: "COMPLAINT",
    priority: "HIGH",
    status: "IN_PROGRESS",
    channel: "BOX",
    complainant: "أحمد الحسني",
    contact: "77xxxxxxx",
    location: "صنعاء - بني الحارث",
    assignee: "منسق المنطقة أ",
    slaDueDate: "2026-09-20",
    createdAt: "2026-09-12",
  },
  {
    id: "c2",
    referenceNo: "CMP-2026-0002",
    title: "بلاغ عن سوء توزيع",
    description: "بلاغ حول عدم شمول بعض الأسر النازحة في كشوفات التوزيع.",
    category: "REPORT",
    priority: "CRITICAL",
    status: "NEW",
    channel: "FIELD",
    complainant: "مجهول",
    location: "عدن - المنصورة",
    slaDueDate: "2026-09-17",
    createdAt: "2026-09-14",
  },
  {
    id: "c3",
    referenceNo: "CMP-2026-0003",
    title: "طلب تصحيح بيانات مستفيد",
    description: "طلب تعديل رقم الهوية في سجل المستفيدين.",
    category: "REQUEST",
    priority: "LOW",
    status: "RESOLVED",
    channel: "PHONE",
    complainant: "فاطمة علي",
    contact: "73xxxxxxx",
    location: "تعز - صالة",
    assignee: "موظف خدمة أ",
    slaDueDate: "2026-09-15",
    createdAt: "2026-09-08",
  },
  {
    id: "c4",
    referenceNo: "CMP-2026-0004",
    title: "مقترح تحسين آلية التوزيع",
    description: "مقترح باعتماد نظام حجز مواعيد لتقليل الازدحام.",
    category: "PROPOSAL",
    priority: "MEDIUM",
    status: "CLOSED",
    channel: "WEB",
    complainant: "سعيد قاسم",
    location: "الحديدة - الحوك",
    assignee: "المشرف العام",
    slaDueDate: "2026-09-25",
    createdAt: "2026-09-05",
  },
  {
    id: "c5",
    referenceNo: "CMP-2026-0005",
    title: "شكوى سلوك موظف ميداني",
    description: "شكوى حول تعامل غير لائق من أحد المتطوعين أثناء التوزيع.",
    category: "COMPLAINT",
    priority: "HIGH",
    status: "NEW",
    channel: "BOX",
    complainant: "مجهول",
    location: "إب - المشنة",
    slaDueDate: "2026-09-19",
    createdAt: "2026-09-15",
  },
]

export const fieldActivities: FieldActivity[] = [
  {
    id: "f1",
    projectId: "PRJ-101",
    activityType: "BASIC",
    date: "2026-09-01",
    executor: "منسق التوعية - خالد",
    location: "صنعاء - بني الحارث",
    malesCount: 120,
    femalesCount: 95,
    postersCount: 30,
    brochuresCount: 200,
    hasBoxInstalled: true,
    boxNumber: "BOX-001",
    description: "جلسة توعية شاملة حول آلية تقديم الشكاوى وحقوق المستفيدين.",
  },
  {
    id: "f2",
    projectId: "PRJ-101",
    activityType: "RECURRING",
    date: "2026-09-09",
    executor: "منسق التوعية - سميرة",
    location: "عدن - المنصورة",
    malesCount: 40,
    femalesCount: 60,
    postersCount: 10,
    brochuresCount: 80,
    hasBoxInstalled: false,
    boxReason: "الموقع غير آمن لتركيب الصندوق حالياً.",
    description: "نشاط توعية متكرر للتذكير بقنوات الشكاوى.",
  },
]

export const complaintBoxes: ComplaintBox[] = [
  {
    id: "b1",
    boxNumber: "BOX-001",
    projectId: "PRJ-101",
    installDate: "2026-09-01",
    location: "المركز الصحي - بني الحارث",
    locationWhy: "موقع مركزي يرتاده أغلب المستفيدين.",
    status: "ACTIVE",
    minutesCount: 2,
  },
  {
    id: "b2",
    boxNumber: "BOX-002",
    projectId: "PRJ-102",
    installDate: "2026-08-20",
    location: "نقطة التوزيع الرئيسية - المنصورة",
    locationWhy: "قرب نقطة التوزيع لتسهيل الوصول.",
    status: "MAINTENANCE",
    minutesCount: 1,
  },
]

export const openingMinutes: OpeningMinute[] = [
  {
    id: "m1",
    minuteNumber: "MIN-2026-001",
    boxNumber: "BOX-001",
    openDate: "2026-09-10",
    complaintsCount: 5,
    reportsCount: 2,
    requestsCount: 3,
    proposalsCount: 1,
    rejectedCount: 1,
    totalOperations: 12,
    notes: "تم الفتح بحضور لجنة من ثلاثة أعضاء.",
    createdBy: "المشرف العام",
  },
  {
    id: "m2",
    minuteNumber: "MIN-2026-002",
    boxNumber: "BOX-002",
    openDate: "2026-09-11",
    complaintsCount: 3,
    reportsCount: 1,
    requestsCount: 2,
    proposalsCount: 0,
    rejectedCount: 0,
    totalOperations: 6,
    createdBy: "منسق المنطقة أ",
  },
]

export const inventoryItems: InventoryItem[] = [
  {
    id: "i1",
    kind: "STICKER", name: "ملصقات توعوية", quantity: 40, unit: "قطعة", updatedAt: "2026-09-15",
    itemType: "POSTERS",
    itemName: "ملصقات توعوية",
    totalSupplied: 500,
    totalDistributed: 460,
    remainingQuantity: 40,
    minAlertLimit: 50,
  },
  {
    id: "i2",
    kind: "BROCHURE", name: "بروشورات إرشادية", quantity: 720, unit: "قطعة", updatedAt: "2026-09-15",
    itemType: "BROCHURES",
    itemName: "بروشورات إرشادية",
    totalSupplied: 2000,
    totalDistributed: 1280,
    remainingQuantity: 720,
    minAlertLimit: 200,
  },
  {
    id: "i3",
    kind: "MINUTE_BOOK", name: "دفاتر محاضر الفتح", quantity: 6, unit: "قطعة", updatedAt: "2026-09-15",
    itemType: "MINUTES_BOOKS",
    itemName: "دفاتر محاضر الفتح",
    totalSupplied: 60,
    totalDistributed: 54,
    remainingQuantity: 6,
    minAlertLimit: 10,
  },
  {
    id: "i4",
    kind: "BOX", name: "صناديق الشكاوى", quantity: 17, unit: "قطعة", updatedAt: "2026-09-15",
    itemType: "BOXES",
    itemName: "صناديق الشكاوى",
    totalSupplied: 80,
    totalDistributed: 63,
    remainingQuantity: 17,
    minAlertLimit: 15,
  },
]

export const inventoryMovements: InventoryMovement[] = [
  {
    id: "mv1",
    itemType: "POSTERS",
    itemName: "ملصقات توعوية",
    movementType: "OUT",
    quantity: 30,
    reference: "نشاط PRJ-101",
    note: "توزيع أثناء جلسة التوعية الشاملة.",
    date: "2026-09-01",
  },
  {
    id: "mv2",
    itemType: "BROCHURES",
    itemName: "بروشورات إرشادية",
    movementType: "IN",
    quantity: 500,
    reference: "أمر توريد PO-88",
    note: "توريد دفعة جديدة للمخزن.",
    date: "2026-09-03",
  },
  {
    id: "mv3",
    itemType: "BOXES",
    itemName: "صناديق الشكاوى",
    movementType: "OUT",
    quantity: 2,
    reference: "تعليق ميداني",
    note: "تركيب صناديق في مواقع جديدة.",
    date: "2026-09-05",
  },
  {
    id: "mv4",
    itemType: "MINUTES_BOOKS",
    itemName: "دفاتر محاضر الفتح",
    movementType: "OUT",
    quantity: 4,
    reference: "لجان الفتح",
    note: "صرف دفاتر للجان فتح الصناديق.",
    date: "2026-09-10",
  },
]


export type { ComplaintStatus, ComplaintPriority } from "./types"
export { statusLabels, priorityLabels } from "./types"

export const categoryBreakdown = [
  { category: "شكوى", value: complaints.filter(c => c.category === "COMPLAINT").length, fill: "var(--chart-1)" },
  { category: "بلاغ", value: complaints.filter(c => c.category === "REPORT").length, fill: "var(--chart-2)" },
  { category: "طلب", value: complaints.filter(c => c.category === "REQUEST").length, fill: "var(--chart-3)" },
  { category: "مقترح", value: complaints.filter(c => c.category === "PROPOSAL").length, fill: "var(--chart-4)" },
]

export const statusDistribution = [
  { status: "جديدة", value: complaints.filter(c => c.status === "NEW").length, fill: "var(--chart-1)" },
  { status: "قيد المعالجة", value: complaints.filter(c => c.status === "IN_PROGRESS").length, fill: "var(--chart-3)" },
  { status: "تم الحل", value: complaints.filter(c => c.status === "RESOLVED").length, fill: "var(--chart-2)" },
  { status: "مغلقة", value: complaints.filter(c => c.status === "CLOSED").length, fill: "var(--chart-4)" },
]

export const monthlyTrend = [
  { month: "يناير", received: 12, resolved: 8 }, { month: "فبراير", received: 15, resolved: 10 },
  { month: "مارس", received: 18, resolved: 13 }, { month: "أبريل", received: 14, resolved: 11 },
  { month: "مايو", received: 20, resolved: 16 }, { month: "يونيو", received: 17, resolved: 15 },
]
export const departmentPerformance = [
  { department: "المالية", resolved: 8, pending: 3 }, { department: "الفنية", resolved: 11, pending: 4 },
  { department: "التعاقدات", resolved: 7, pending: 5 }, { department: "الإدارة", resolved: 9, pending: 2 },
]
export const summary = { total: complaints.length, resolved: complaints.filter(c => c.status === "RESOLVED" || c.status === "CLOSED").length, avgResolutionDays: 8, satisfaction: 82 }
