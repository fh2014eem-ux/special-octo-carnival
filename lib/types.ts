// الأنواع المشتركة لنظام إدارة الشكاوى والبلاغات.
// هذا الملف يجمع نماذج V0 الحالية مع نماذج التشغيل الموروثة من V10
// حتى لا تفقد الوحدات القديمة وظائفها أثناء توحيد النظام.

export type ComplaintStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "REJECTED"
export type ComplaintPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "URGENT"
export type ComplaintCategory = "COMPLAINT" | "REPORT" | "REQUEST" | "PROPOSAL" | string
export type ComplaintChannel = "BOX" | "PHONE" | "WEB" | "FIELD" | "ONLINE" | "IN_PERSON" | string

export interface Complaint {
  id: string
  referenceNo: string
  title: string
  description: string
  category: ComplaintCategory
  priority: ComplaintPriority
  status: ComplaintStatus
  channel?: ComplaintChannel
  citizenName?: string
  citizen?: string
  citizenEmail?: string | null
  citizenPhone?: string | null
  complainant?: string
  contact?: string
  location?: string | null
  assignedToId?: string | null
  assignedTo?: { id: string; name: string } | null
  assignee?: string
  slaDueDate?: string
  createdAt: string
  updatedAt?: string
  minuteId?: string | null
  minute?: unknown
  project?: unknown
  projectId?: string | null
}

export const STATUS_ORDER: ComplaintStatus[] = ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"]
export const PRIORITY_ORDER: ComplaintPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
export const CATEGORIES = ["COMPLAINT", "REPORT", "REQUEST", "PROPOSAL"] as const

export const statusLabels: Record<ComplaintStatus, string> = {
  NEW: "جديدة", IN_PROGRESS: "قيد المعالجة", RESOLVED: "تم الحل", CLOSED: "مغلقة", REJECTED: "مرفوضة",
}
export const priorityLabels: Record<ComplaintPriority, string> = {
  LOW: "منخفضة", MEDIUM: "متوسطة", HIGH: "عالية", CRITICAL: "حرجة", URGENT: "عاجلة",
}
export const categoryLabels: Record<string, string> = {
  COMPLAINT: "شكوى", REPORT: "بلاغ", REQUEST: "طلب", PROPOSAL: "مقترح",
}
export const channelLabels: Record<string, string> = {
  BOX: "صندوق ميداني", PHONE: "هاتف", WEB: "بوابة إلكترونية", FIELD: "زيارة ميدانية",
  ONLINE: "إلكترونية", IN_PERSON: "حضور شخصي",
}

export interface User {
  id?: string
  username: string
  name: string
  email: string
  phone?: string
  password?: string
  branch: string
  role: string
  active: boolean
  createdAt?: string
  updatedAt?: string
}

export type OperationStatus = "مستلمة" | "جديدة" | "طور المعالجة" | "بانتظار الرد" | "مغلقة"
export interface Operation {
  id: string
  operationNo: string
  type: string
  status: OperationStatus
  branch: string
  channel: string
  phone: string
  altPhone?: string
  email?: string
  accusedPerson?: string
  subClass2?: string
  priority?: string
  projectNo?: string
  referredTo?: string
  internalReply?: string
  finalClosingText?: string
  closingChannel?: string
  replyMessage?: string
  finalEvaluation?: string
  requiresAnalysis?: string
  name: string
  gender: string
  capacity: string
  province: string
  directorate?: string
  isolation?: string
  village?: string
  subject: string
  description: string
  attachments: string[]
  against?: string
  mainClass?: string
  subClass?: string
  sensitivity?: string
  projectNumber?: string
  projectName?: string
  officerReply?: string
  responder?: string
  minutesNo?: string
  message?: string
  closure?: string
  replyChannels?: string[]
  evaluation?: string
  needsAnalysis?: string
  createdAt: string
  updatedAt: string
}

export interface FieldReport {
  id: string
  activityNo: string
  branch: string
  projectKind: string
  awarenessType: string
  projectNumber?: string
  projectName?: string
  date: string
  executor: string
  province: string
  location: string
  male: number
  female: number
  beneficiaries: number
  posters: number
  brochures: number
  description?: string
  hasCommittee?: string
  committeeDetails?: string
  hasBox?: string
  boxDetails?: string
  createdAt: string
}

export interface AwarenessActivity {
  id: string
  projectId: string
  type: "BASIC" | "RECURRING"
  date: string
  location: string
  audienceCount: number
  stickersUsed: number
  brochuresUsed: number
  notes?: string | null
  createdAt: string
}
export type AwarenessType = "BASIC" | "RECURRING"

export type BoxStatus = "ACTIVE" | "REMOVED" | "MAINTENANCE" | "COLLECTED"
export interface ComplaintBox {
  id: string
  recordNo?: string
  branch?: string
  projectNumber?: string
  projectName?: string
  boxNo?: string
  boxNumber?: string
  code?: string
  projectId?: string
  installDate?: string
  installedAt?: string
  installPlace?: string
  location?: string
  placeReason?: string
  locationWhy?: string
  chosenBy?: string
  status: BoxStatus
  minutesNo?: string
  openDate?: string
  minutesDate?: string
  totalOps?: number
  accepted?: number
  rejected?: number
  complaints?: number
  reports?: number
  minutesCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface BoxOpeningMinute {
  id: string
  minuteNo: string
  boxId: string
  projectId: string
  openedAt: string
  totalCount: number
  validCount: number
  suggestionCount: number
  blankCount: number
  invalidCount: number
  notes?: string | null
  createdAt: string
}
export interface OpeningMinute {
  id: string
  minuteNumber: string
  boxNumber: string
  openDate: string
  complaintsCount: number
  reportsCount: number
  requestsCount: number
  proposalsCount: number
  rejectedCount: number
  totalOperations: number
  notes?: string
  createdBy?: string
}

export type InventoryItemType = "POSTERS" | "BROCHURES" | "MINUTES_BOOKS" | "BOXES"
export type InventoryKind = "STICKER" | "BROCHURE" | "BOX" | "MINUTE_BOOK"
export interface InventoryItem {
  id: string
  kind: InventoryKind
  name: string
  quantity: number
  unit: string
  updatedAt: string
  itemType: InventoryItemType
  itemName: string
  totalSupplied: number
  totalDistributed: number
  remainingQuantity: number
  minAlertLimit: number
}
export interface InventoryMovement {
  id: string
  itemType: InventoryItemType
  itemName: string
  movementType: "IN" | "OUT"
  quantity: number
  reference?: string
  note?: string
  date: string
}
export interface StockMovement {
  id: string
  branch: string
  item: string
  direction: "إدخال" | "إخراج"
  quantity: number
  date: string
  note?: string
  createdAt: string
}
export interface StockRequest {
  id: string
  requestNo: string
  branch: string
  item: string
  quantity: number
  status: string
  date: string
  createdAt: string
}

export interface Analysis {
  id: string
  analysisNo: string
  branch: string
  operationNo: string
  rootCause: string
  correctiveAction: string
  responsible: string
  dueDate: string
  status: string
  notes?: string
  createdAt: string
}
export interface FollowUp {
  id: string
  followNo: string
  branch: string
  operationNo: string
  action: string
  responsible: string
  date: string
  rating?: string
  notes?: string
  createdAt: string
}
export interface Responder {
  id: string
  name: string
  branch: string
  email?: string
  active: boolean
}
export interface Project {
  id: string
  name: string
  code: string
  location?: string
  createdAt: string
  updatedAt: string
}

export type FieldActivityType = "BASIC" | "RECURRING"
export interface FieldActivity {
  id: string
  projectId: string
  activityType: FieldActivityType
  date: string
  executor: string
  location: string
  malesCount: number
  femalesCount: number
  postersCount: number
  brochuresCount: number
  hasBoxInstalled: boolean
  boxNumber?: string
  boxReason?: string
  description?: string
}

export type InventoryMovementType = "IN" | "OUT"
export const boxStatusLabels: Record<BoxStatus, string> = { ACTIVE: "نشط", REMOVED: "مرفوع", MAINTENANCE: "صيانة", COLLECTED: "تم الجمع" }
export const inventoryTypeLabels: Record<InventoryItemType, string> = { POSTERS: "ملصقات", BROCHURES: "بروشورات", MINUTES_BOOKS: "دفاتر محاضر", BOXES: "صناديق شكاوى" }

export interface ReportSummary {
  total: number
  byStatus: Record<ComplaintStatus, number>
  byCategory: Record<string, number>
  byPriority: Record<ComplaintPriority, number>
  resolvedRate: number
  avgResolutionDays: number
}

// أسماء بديلة مستخدمة في بعض مكونات الواجهة القديمة/الموروثة.
export const STATUS_LABELS = statusLabels
export const PRIORITY_LABELS = priorityLabels
