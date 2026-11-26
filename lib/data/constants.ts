// الثوابت الأساسية لنظام الشكاوى والبلاغات - الصندوق الاجتماعي للتنمية
// مستمدة من كود Apps Script V10 (غير قابلة للحذف حسب متطلبات النظام)

export const OPERATION_TYPES = [
  "شكوى",
  "بلاغ",
  "استعلام",
  "مقترح",
  "طلب",
  "إطراء",
] as const

export type OperationType = (typeof OPERATION_TYPES)[number]

export const CHANNELS = [
  "مواقع التواصل الاجتماعي",
  "مركز الاتصال",
  "فاكس",
  "الرسائل النصية",
  "البريد الإلكتروني",
  "رابط الشكاوى",
  "صندوق الشكاوى",
  "الحضور الشخصي",
  "تطبيق الهاتف",
  "الموقع الإلكتروني",
  "يد بيد",
] as const

export const RESPONSE_CHANNELS = [
  "الرسائل النصية",
  "مركز الاتصال",
  "المعالجة الميدانية",
  "يد بيد",
  "مواقع التواصل الاجتماعي",
  "البريد الإلكتروني",
  "أخرى",
] as const

// القنوات التي تتطلب كتابة نص رسالة للرد
export const MESSAGE_CHANNELS = [
  "الرسائل النصية",
  "البريد الإلكتروني",
  "مواقع التواصل الاجتماعي",
]

export const STATUS = {
  RECEIVED: "مستلمة",
  NEW: "جديدة",
  PROCESSING: "طور المعالجة",
  WAITING: "بانتظار الرد",
  CLOSED: "مغلقة",
} as const

export type Status = (typeof STATUS)[keyof typeof STATUS]

export const STATUS_LIST = Object.values(STATUS)

export const GENDERS = ["ذكر", "أنثى"] as const

export const CAPACITIES = [
  "مستفيد",
  "استشاري",
  "فني مقيم",
  "مقاول",
  "مورد",
  "أخرى",
] as const

export const SENSITIVITY = ["حساسية منخفضة", "شكوى عالية الحساسية"] as const

export const EVALUATIONS = [
  "محقة",
  "غير محقة",
  "كيدية",
  "شكوى غير دقيقة",
] as const

export interface Branch {
  key: string
  name: string
  provinces: string[]
  fixedProvince?: string
}

export const BRANCHES: Record<string, Branch> = {
  Taiz: { key: "Taiz", name: "فرع تعز", provinces: ["تعز"], fixedProvince: "تعز" },
  Aden: { key: "Aden", name: "فرع عدن", provinces: ["عدن", "أبين", "لحج", "الضالع"] },
  Mukalla: {
    key: "Mukalla",
    name: "فرع المكلا",
    provinces: ["حضرموت", "شبوة", "المهرة", "سقطرى"],
  },
  Sanaa: { key: "Sanaa", name: "فرع صنعاء", provinces: ["أمانة العاصمة", "صنعاء"] },
  Amran: { key: "Amran", name: "فرع عمران", provinces: ["عمران"], fixedProvince: "عمران" },
  Hajjah: { key: "Hajjah", name: "فرع حجة", provinces: ["حجة"], fixedProvince: "حجة" },
  Hodeidah: { key: "Hodeidah", name: "فرع الحديدة", provinces: ["الحديدة"], fixedProvince: "الحديدة" },
  Ibb: { key: "Ibb", name: "فرع إب", provinces: ["إب"], fixedProvince: "إب" },
  Marib: { key: "Marib", name: "مكتب مأرب", provinces: ["مأرب"], fixedProvince: "مأرب" },
  General: { key: "General", name: "الإدارة العامة", provinces: ["تعز", "عدن", "حضرموت", "مأرب"] },
}

export const BRANCH_NAMES = Object.values(BRANCHES).map((b) => b.name)

export const ROLES = [
  "مدخل بيانات",
  "مسؤول شكاوى وامتثال",
  "إدارة عامة",
  "مدير النظام",
] as const

export type Role = (typeof ROLES)[number]

// شجرة التصنيف: الرئيسي -> الفرعي
export const CLASS_TREE: Record<string, string[]> = {
  مالية: ["تأخر مستحقات", "عدم استلام مستحقات", "خصم من المستحقات", "مشكلة مالية أخرى"],
  "قضايا ذات عدالة التدخلات": [
    "استهداف غير عادل",
    "إقصاء من التدخل",
    "تمييز",
    "عدالة تدخل أخرى",
  ],
  "قضايا فنية": ["مشكلة جودة", "مواصفات فنية", "تنفيذ غير مطابق", "مشكلة فنية أخرى"],
  "قضايا تعاقدية": ["إخلال بالعقد", "تأخر التنفيذ", "نزاع تعاقدي", "قضية تعاقدية أخرى"],
  "السلامة المهنية": ["حادث", "مخالفة سلامة", "مخاطر مهنية", "قضية سلامة أخرى"],
  "قضايا عامة": ["سلوك موظف", "معلومة عامة", "إجراء إداري", "قضية عامة أخرى"],
}

export const MAIN_CLASSES = Object.keys(CLASS_TREE)

// أنواع مشاريع التوعية الميدانية
export const PROJECT_KINDS = ["مشاريع ميدانية", "مشاريع تدريبية"] as const
export const AWARENESS_TYPES = ["التوعية الأساسية", "التوعية المتكررة"] as const

// أصناف المخزون
export const STOCK_ITEMS = ["ملصقات", "بروشورات", "صناديق شكاوى", "دفاتر"] as const

export const OFFICIAL_NAME = "الصندوق الاجتماعي للتنمية"
export const SYSTEM_NAME = "نظام الشكاوى والبلاغات"

export const CATEGORIES = ["COMPLAINT", "REPORT", "REQUEST", "PROPOSAL"] as const
