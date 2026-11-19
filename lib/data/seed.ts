import type {
  User,
  Operation,
  FieldReport,
  ComplaintBox,
  Analysis,
  FollowUp,
  StockMovement,
  StockRequest,
  Responder,
} from "@/lib/types"

// لا توجد حسابات أو كلمات مرور تجريبية؛ الحسابات تُدار عبر Better Auth.
export const SEED_USERS: User[] = []

export const SEED_RESPONDERS: Responder[] = [
  { id: "r1", name: "أحمد الشرعبي", branch: "فرع تعز", email: "ahmed@sfd.org", active: true },
  { id: "r2", name: "منى القدسي", branch: "فرع تعز", email: "mona@sfd.org", active: true },
  { id: "r3", name: "ريم باعباد", branch: "فرع عدن", email: "reem@sfd.org", active: true },
]

const now = () => new Date().toISOString()
const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86400000).toISOString()

export const SEED_OPERATIONS: Operation[] = [
  {
    id: "op1", operationNo: "OP-2601-0001", type: "شكوى", status: "مغلقة", branch: "فرع تعز",
    channel: "رابط الشكاوى", phone: "771234567", name: "محمد عبده", gender: "ذكر", capacity: "مستفيد",
    province: "تعز", directorate: "المظفر", isolation: "حي المطار", village: "المطار القديم",
    subject: "تأخر صرف المستحقات", description: "لم يتم صرف المستحقات المتفق عليها منذ شهرين.",
    attachments: [], mainClass: "مالية", subClass: "تأخر مستحقات", sensitivity: "حساسية منخفضة",
    projectNumber: "800-13254", projectName: "مدرسة أحمد فرج حي المطار القديم - مديرية المظفر - محافظة تعز",
    officerReply: "تمت مراجعة كشوفات الصرف.", responder: "أحمد الشرعبي",
    closure: "تم صرف المستحقات وإبلاغ المستفيد.", replyChannels: ["الرسائل النصية"],
    evaluation: "محقة", needsAnalysis: "نعم", createdAt: daysAgo(30), updatedAt: daysAgo(20),
  },
  {
    id: "op2", operationNo: "OP-2601-0002", type: "بلاغ", status: "طور المعالجة", branch: "فرع تعز",
    channel: "مركز الاتصال", phone: "773456789", name: "سعاد أحمد", gender: "أنثى", capacity: "مستفيد",
    against: "مقاول المشروع", province: "تعز", directorate: "جبل حبشي", isolation: "الشراجه", village: "حمرة",
    subject: "مخالفة في مواصفات التنفيذ", description: "المواد المستخدمة لا تطابق المواصفات الفنية.",
    attachments: [], mainClass: "قضايا فنية", subClass: "تنفيذ غير مطابق", sensitivity: "شكوى عالية الحساسية",
    projectNumber: "800-13005", projectName: "مشروع تحسين الوضع الصحي والبيئي وتأهيل مدرجات لقرية حمرة - جبل حبشي - تعز",
    createdAt: daysAgo(15), updatedAt: daysAgo(10),
  },
  {
    id: "op3", operationNo: "OP-2601-0003", type: "شكوى", status: "جديدة", branch: "فرع تعز",
    channel: "صندوق الشكاوى", phone: "775678901", name: "علي صالح", gender: "ذكر", capacity: "مستفيد",
    province: "تعز", directorate: "المسراخ", isolation: "الأقروض", village: "الأقروض العليا",
    subject: "إقصاء من قائمة المستفيدين", description: "تم استبعادي من قائمة المستفيدين دون مبرر.",
    attachments: [], createdAt: daysAgo(3), updatedAt: daysAgo(3),
  },
  {
    id: "op4", operationNo: "OP-2601-0004", type: "استعلام", status: "مغلقة", branch: "فرع تعز",
    channel: "الحضور الشخصي", phone: "770001122", name: "فاطمة يحيى", gender: "أنثى", capacity: "مستفيد",
    province: "تعز", directorate: "المظفر", subject: "استعلام عن موعد الصرف",
    description: "الاستفسار عن موعد الدفعة القادمة.", attachments: [],
    closure: "تم إبلاغ المستفيدة بالموعد.", replyChannels: ["مركز الاتصال"],
    createdAt: daysAgo(25), updatedAt: daysAgo(24),
  },
  {
    id: "op5", operationNo: "OP-2601-0005", type: "إطراء", status: "مغلقة", branch: "فرع تعز",
    channel: "مواقع التواصل الاجتماعي", phone: "778889900", name: "نبيل قاسم", gender: "ذكر", capacity: "مستفيد",
    province: "تعز", subject: "إطراء", description: "إطراء مرتبط بالمشروع التلمذة المهنية.",
    attachments: [], projectNumber: "900-13482", projectName: "مشروع التلمذة المهنية لأجل تعزيز وتسهيل فرص عمل هادفة للشباب - محافظة تعز",
    closure: "تم تسجيل الإطراء.", evaluation: "محقة", createdAt: daysAgo(12), updatedAt: daysAgo(12),
  },
  {
    id: "op6", operationNo: "OP-2601-0006", type: "مقترح", status: "بانتظار الرد", branch: "فرع تعز",
    channel: "البريد الإلكتروني", phone: "779990011", name: "هدى ناصر", gender: "أنثى", capacity: "أخرى",
    province: "تعز", subject: "مقترح لتحسين آلية التوزيع", description: "اقتراح لتحسين توزيع المساعدات.",
    attachments: [], createdAt: daysAgo(6), updatedAt: daysAgo(5),
  },
  {
    id: "op7", operationNo: "OP-2601-0007", type: "طلب", status: "طور المعالجة", branch: "فرع تعز",
    channel: "تطبيق الهاتف", phone: "771112233", name: "ماجد فؤاد", gender: "ذكر", capacity: "مقاول",
    province: "تعز", subject: "طلب صرف دفعة مقاول", description: "طلب صرف الدفعة المستحقة للمقاول.",
    attachments: [], mainClass: "قضايا تعاقدية", subClass: "تأخر التنفيذ", sensitivity: "حساسية منخفضة",
    createdAt: daysAgo(8), updatedAt: daysAgo(7),
  },
  {
    id: "op8", operationNo: "OP-2601-0008", type: "شكوى", status: "مغلقة", branch: "فرع عدن",
    channel: "رابط الشكاوى", phone: "734445566", name: "أروى سالم", gender: "أنثى", capacity: "مستفيد",
    province: "عدن", directorate: "خور مكسر", subject: "خصم غير مبرر من المستحقات",
    description: "تم خصم مبلغ من المستحقات دون توضيح.", attachments: [],
    mainClass: "مالية", subClass: "خصم من المستحقات", sensitivity: "حساسية منخفضة",
    projectNumber: "700-14010", projectName: "مشروع تحسين سبل العيش - مديرية خور مكسر - محافظة عدن",
    closure: "تمت إعادة المبلغ المخصوم.", replyChannels: ["الرسائل النصية"], evaluation: "محقة",
    createdAt: daysAgo(20), updatedAt: daysAgo(14),
  },
  {
    id: "op9", operationNo: "OP-2601-0009", type: "بلاغ", status: "جديدة", branch: "فرع عدن",
    channel: "مركز الاتصال", phone: "736667788", name: "طارق عمر", gender: "ذكر", capacity: "مستفيد",
    against: "موظف ميداني", province: "عدن", subject: "سلوك غير لائق من موظف",
    description: "بلاغ عن سلوك غير مهني من أحد الموظفين الميدانيين.", attachments: [],
    createdAt: daysAgo(2), updatedAt: daysAgo(2),
  },
  {
    id: "op10", operationNo: "OP-2601-0010", type: "شكوى", status: "طور المعالجة", branch: "فرع المكلا",
    channel: "صندوق الشكاوى", phone: "715556677", name: "سالم بن عوض", gender: "ذكر", capacity: "مستفيد",
    province: "حضرموت", directorate: "المكلا", subject: "تأخر تسليم المشروع",
    description: "تأخر في تسليم مخرجات المشروع عن الموعد المحدد.", attachments: [],
    mainClass: "قضايا تعاقدية", subClass: "تأخر التنفيذ", sensitivity: "حساسية منخفضة",
    projectNumber: "700-14055", projectName: "مشروع دعم صمود المجتمعات - مدينة المكلا - محافظة حضرموت",
    createdAt: daysAgo(9), updatedAt: daysAgo(6),
  },
]

export const SEED_FIELD_REPORTS: FieldReport[] = [
  {
    id: "f1", activityNo: "FLD-0001", branch: "فرع تعز", projectKind: "مشاريع ميدانية",
    awarenessType: "التوعية الأساسية", projectNumber: "800-13005",
    projectName: "مشروع تحسين الوضع الصحي والبيئي وتأهيل مدرجات لقرية حمرة - جبل حبشي - تعز",
    date: daysAgo(18), executor: "أحمد الشرعبي", province: "تعز", location: "قرية حمرة",
    male: 45, female: 30, beneficiaries: 75, posters: 20, brochures: 100,
    description: "توعية أساسية حول آلية تقديم الشكاوى وصناديق الشكاوى.",
    hasCommittee: "نعم", committeeDetails: "تدريب 8 أعضاء (5 ذكور، 3 إناث) في مقر القرية.",
    hasBox: "نعم", boxDetails: "تركيب صندوق واحد في مركز القرية.", createdAt: daysAgo(18),
  },
  {
    id: "f2", activityNo: "FLD-0002", branch: "فرع تعز", projectKind: "مشاريع تدريبية",
    awarenessType: "التوعية المتكررة", projectNumber: "900-13482",
    projectName: "مشروع التلمذة المهنية لأجل تعزيز وتسهيل فرص عمل هادفة للشباب - محافظة تعز",
    date: daysAgo(5), executor: "سارة عبده", province: "تعز", location: "مركز التدريب - تعز",
    male: 20, female: 18, beneficiaries: 38, posters: 10, brochures: 50,
    description: "جلسة توعية متكررة للمتدربين حول الحقوق وآلية الشكاوى.", createdAt: daysAgo(5),
  },
]

export const SEED_BOXES: ComplaintBox[] = [
  {
    id: "b1", status: "ACTIVE", recordNo: "BOX-0001", branch: "فرع تعز", projectNumber: "800-13005",
    projectName: "مشروع تحسين الوضع الصحي والبيئي - حمرة", boxNo: "TZ-01",
    installDate: daysAgo(40), installPlace: "مركز قرية حمرة", placeReason: "موقع مركزي يسهل الوصول إليه",
    chosenBy: "اللجنة المجتمعية", minutesNo: "MIN-001", openDate: daysAgo(10), minutesDate: daysAgo(9),
    totalOps: 12, accepted: 10, rejected: 2, complaints: 7, reports: 3, createdAt: daysAgo(40),
  },
]

export const SEED_ANALYSES: Analysis[] = [
  {
    id: "a1", analysisNo: "AN-0001", branch: "فرع تعز", operationNo: "OP-2601-0001",
    rootCause: "تأخر في إجراءات الصرف لدى الوحدة المالية.",
    correctiveAction: "تبسيط دورة اعتماد الصرف وتحديد سقف زمني.",
    responsible: "الوحدة المالية", dueDate: daysAgo(-15), status: "قيد التنفيذ",
    notes: "مرتبطة بشكوى مغلقة تتطلب تحليلًا.", createdAt: daysAgo(19),
  },
]

export const SEED_FOLLOWS: FollowUp[] = [
  {
    id: "fo1", followNo: "FU-0001", branch: "فرع تعز", operationNo: "OP-2601-0001",
    action: "التحقق من صرف المستحقات فعليًا للمستفيد.", responsible: "أحمد الشرعبي",
    date: daysAgo(16), rating: "مرضٍ", notes: "تم التأكد من الصرف.", createdAt: daysAgo(16),
  },
]

export const SEED_STOCK: StockMovement[] = [
  { id: "s1", branch: "فرع تعز", item: "صناديق شكاوى", direction: "إدخال", quantity: 50, date: daysAgo(60), note: "دفعة أولى", createdAt: daysAgo(60) },
  { id: "s2", branch: "فرع تعز", item: "صناديق شكاوى", direction: "إخراج", quantity: 8, date: daysAgo(40), note: "تركيب ميداني", createdAt: daysAgo(40) },
  { id: "s3", branch: "فرع تعز", item: "بروشورات", direction: "إدخال", quantity: 1000, date: daysAgo(55), createdAt: daysAgo(55) },
  { id: "s4", branch: "فرع تعز", item: "بروشورات", direction: "إخراج", quantity: 150, date: daysAgo(18), note: "توعية حمرة", createdAt: daysAgo(18) },
]

export const SEED_STOCK_REQUESTS: StockRequest[] = [
  { id: "sr1", requestNo: "REQ-0001", branch: "فرع تعز", item: "ملصقات", quantity: 200, status: "قيد المراجعة", date: daysAgo(4), createdAt: daysAgo(4) },
]

export const SEED_TIMESTAMP = now
