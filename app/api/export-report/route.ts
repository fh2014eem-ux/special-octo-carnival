import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type OperationRow = {
  type: string; status: string; gender: string; channel: string
  primaryCategory: string | null; projectNumber: string | null
  createdAt: Date
}
type AwarenessRow = {
  projectNumber: string; projectName: string; sector: string
  awarenessType: string; totalBeneficiaries: number; menCount: number
  womenCount: number; directBeneficiaries: number; indirectBeneficiaries: number
  createdAt: Date
}
type BoxRow = {
  boxNumber: string; projectNumber: string; projectName: string
  installDate: string; installLocation: string; status: string
  minutes: Array<{ minuteNumber: string; openingDate: string; totalDocuments: number;
    complaintsCount: number; reportsCount: number; requestsCount: number;
    proposalsCount: number; inquiriesCount: number; praisesCount: number }>
}

const arDate = (value: Date | string) => new Intl.DateTimeFormat("ar-YE", {
  year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Aden",
}).format(new Date(value))
const esc = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
)
const countBy = (rows: Array<Record<string, unknown>>, key: string) => {
  const result = new Map<string, number>()
  for (const row of rows) {
    const label = String(row[key] || "غير محدد")
    result.set(label, (result.get(label) || 0) + 1)
  }
  return [...result.entries()].sort((a, b) => b[1] - a[1])
}
const table = (headers: string[], rows: unknown[][]) => `
<table><thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
<tbody>${rows.length ? rows.map((row) => `<tr>${row.map((v) => `<td>${esc(v)}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${headers.length}" class="empty">لا توجد بيانات خلال الفترة المحددة</td></tr>`}</tbody></table>`

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.active === false) {
    return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً." }, { status: 401 })
  }

  const params = req.nextUrl.searchParams
  const format = params.get("format") === "pdf" ? "pdf" : "word"
  const isAdmin = session.user.role === "مدير النظام" || session.user.role === "إدارة عامة" || session.user.branch === "الإدارة العامة"
  const requestedBranch = params.get("branch")?.trim() || ""
  const branch = isAdmin && requestedBranch ? requestedBranch : (session.user.branch || "")
  const fromValue = params.get("from") || ""
  const toValue = params.get("to") || ""
  const now = new Date()
  const defaultStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
  const from = fromValue ? new Date(`${fromValue}T00:00:00.000Z`) : defaultStart
  const to = toValue ? new Date(`${toValue}T23:59:59.999Z`) : now
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) {
    return NextResponse.json({ error: "فترة التقرير غير صحيحة." }, { status: 400 })
  }

  const scope = branch ? { branch } : {}
  const dateScope = { createdAt: { gte: from, lte: to } }
  try {
    const [operations, awareness, boxes] = await Promise.all([
      prisma.complaintOperation.findMany({
        where: { ...scope, ...dateScope },
        select: { type: true, status: true, gender: true, channel: true, primaryCategory: true, projectNumber: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.fieldAwareness.findMany({
        where: { ...scope, ...dateScope },
        select: { projectNumber: true, projectName: true, sector: true, awarenessType: true,
          totalBeneficiaries: true, menCount: true, womenCount: true,
          directBeneficiaries: true, indirectBeneficiaries: true, createdAt: true },
      }),
      prisma.fieldBox.findMany({
        where: scope,
        select: { boxNumber: true, projectNumber: true, projectName: true, installDate: true,
          installLocation: true, status: true, minutes: { select: { minuteNumber: true, openingDate: true,
            totalDocuments: true, complaintsCount: true, reportsCount: true, requestsCount: true,
            proposalsCount: true, inquiriesCount: true, praisesCount: true },
            where: { createdAt: { gte: from, lte: to } }, orderBy: { createdAt: "asc" } } },
        orderBy: { createdAt: "asc" },
      }),
    ]) as [OperationRow[], AwarenessRow[], BoxRow[]]

    const total = operations.length
    const closed = operations.filter((o) => ["CLOSED", "RESOLVED", "مغلقة", "مكتملة"].includes(o.status)).length
    const inProgress = operations.filter((o) => ["IN_PROGRESS", "قيد المعالجة", "طور المعالجة", "محالة"].includes(o.status)).length
    const types = countBy(operations as unknown as Array<Record<string, unknown>>, "type")
    const statuses = countBy(operations as unknown as Array<Record<string, unknown>>, "status")
    const genders = countBy(operations as unknown as Array<Record<string, unknown>>, "gender")
    const channels = countBy(operations as unknown as Array<Record<string, unknown>>, "channel")
    const categories = countBy(operations.filter(o => o.primaryCategory).map(o => ({ category: o.primaryCategory })) as unknown as Array<Record<string, unknown>>, "category")
    const totalBeneficiaries = awareness.reduce((sum, row) => sum + row.totalBeneficiaries, 0)
    const men = awareness.reduce((sum, row) => sum + row.menCount, 0)
    const women = awareness.reduce((sum, row) => sum + row.womenCount, 0)
    const totalMinutes = boxes.reduce((sum, box) => sum + box.minutes.length, 0)
    const totalDocuments = boxes.reduce((sum, box) => sum + box.minutes.reduce((n, m) => n + m.totalDocuments, 0), 0)
    const titlePeriod = `من ${arDate(from)} إلى ${arDate(to)}`
    const branchLabel = branch || "جميع الفروع المصرح بها"
    const summaryCards = [
      ["إجمالي العمليات", total], ["العمليات المغلقة", closed], ["قيد المعالجة", inProgress],
      ["أنشطة التوعية", awareness.length], ["المستفيدون بالتوعية", totalBeneficiaries],
      ["صناديق الشكاوى", boxes.length], ["محاضر الفتح", totalMinutes], ["وثائق الصناديق", totalDocuments],
    ].map(([label, value]) => `<div class="metric"><b>${esc(value)}</b><span>${esc(label)}</span></div>`).join("")

    const content = `
<section class="cover">
  <div class="org">الجمهورية اليمنية · رئاسة مجلس الوزراء</div>
  <div class="logo">الصندوق الاجتماعي للتنمية</div>
  <div class="dept">إدارة الشكاوى والبلاغات</div>
  <h1>تقرير الإنجاز لقسم الشكاوى والبلاغات</h1>
  <h2>${esc(branchLabel)}</h2><p>${esc(titlePeriod)}</p>
</section>
<section><h2>مقدمة التقرير</h2><p>يعرض هذا التقرير مؤشرات العمليات والشكاوى والبلاغات وأنشطة التوعية الميدانية وحركة صناديق الشكاوى ومحاضر فتحها، وفق البيانات المسجلة في النظام خلال الفترة المحددة. تم احتساب المؤشرات من سجلات الفرع المصرح بها وقت إنشاء التقرير.</p></section>
<section><h2>ملخص تنفيذي</h2><div class="metrics">${summaryCards}</div></section>
<section><h2>أولاً: الإدارة الميدانية والتوعية</h2>
<h3>جدول (1): أنشطة التوعية المسجلة</h3>
${table(["المشروع","رقم المشروع","القطاع","نوع التوعية","المستفيدون","ذكور","إناث"], awareness.map(a => [a.projectName,a.projectNumber,a.sector,a.awarenessType,a.totalBeneficiaries,a.menCount,a.womenCount]))}
<p class="note">إجمالي المستفيدين: ${totalBeneficiaries} · الذكور: ${men} · الإناث: ${women}</p></section>
<section><h2>ثانياً: حركة صناديق الشكاوى ومحاضر الفتح</h2>
<h3>جدول (2): بيانات الصناديق وحركة المحاضر خلال الفترة</h3>
${table(["رقم الصندوق","المشروع","رقم المشروع","الحالة","مكان التعليق","عدد المحاضر","عدد الوثائق"], boxes.map(b => [b.boxNumber,b.projectName,b.projectNumber,b.status,b.installLocation,b.minutes.length,b.minutes.reduce((n,m)=>n+m.totalDocuments,0)]))}
<h3>تفاصيل المحاضر</h3>
${table(["رقم المحضر","رقم الصندوق","تاريخ الفتح","الشكاوى","البلاغات","الطلبات","المقترحات","الاستعلامات","الإطراءات","إجمالي الوثائق"], boxes.flatMap(b=>b.minutes.map(m=>[m.minuteNumber,b.boxNumber,m.openingDate,m.complaintsCount,m.reportsCount,m.requestsCount,m.proposalsCount,m.inquiriesCount,m.praisesCount,m.totalDocuments])))}
</section>
<section><h2>ثالثاً: إدارة العمليات</h2>
<h3>جدول (3): العمليات حسب النوع</h3>${table(["نوع العملية","العدد"],types)}
<h3>جدول (4): العمليات حسب الحالة</h3>${table(["الحالة","العدد"],statuses)}
<h3>جدول (5): العمليات حسب الجنس</h3>${table(["الجنس","العدد"],genders)}
<h3>جدول (6): العمليات حسب قناة الاستقبال</h3>${table(["قناة الاستقبال","العدد"],channels)}
<h3>جدول (7): التصنيفات الرئيسية</h3>${table(["التصنيف الرئيسي","العدد"],categories)}
</section>
<section><h2>رابعاً: المخرجات والتوصيات والتغذية الراجعة</h2>
<p>تُستكمل التوصيات والإجراءات التصحيحية والدروس المستفادة وقصص النجاح من سجلات المتابعة المعتمدة أو من قبل معد التقرير؛ لا تُنشأ توصيات تلقائية غير موثقة.</p>
<div class="signatures"><div>ضابط الشكاوى بالفرع<br><br>الاسم والتوقيع: ........................</div><div>مدير الفرع<br><br>الاسم والتوقيع: ........................</div></div>
</section>
<footer>تم إنشاء التقرير إلكترونياً بتاريخ ${esc(arDate(new Date()))} · مصدر البيانات: نظام الشكاوى والبلاغات CHM-SFD</footer>`

    const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>تقرير الإنجاز - CHM-SFD</title><style>
      @page{size:A4;margin:18mm 15mm}*{box-sizing:border-box}body{font-family:Arial,"Tahoma",sans-serif;color:#172033;line-height:1.65;font-size:12pt;direction:rtl}
      .cover{min-height:245mm;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;page-break-after:always;border:2px solid #24466c;padding:22mm}
      .org{font-weight:bold;color:#334155}.logo{margin-top:20mm;font-size:22pt;font-weight:bold;color:#174c78}.dept{margin-top:8mm;border-block:1px solid #94a3b8;padding:4mm 15mm}
      h1{font-size:25pt;color:#173e68;margin-top:35mm}h2{font-size:18pt;color:#173e68;border-bottom:2px solid #d8e2ed;padding-bottom:3mm;margin-top:8mm}
      h3{font-size:14pt;color:#245783;margin:7mm 0 3mm}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm;margin:5mm 0}
      .metric{border:1px solid #b9c7d6;border-radius:5px;padding:4mm;text-align:center;background:#f5f8fb}.metric b{display:block;font-size:20pt;color:#164a76}.metric span{font-size:9pt}
      table{width:100%;border-collapse:collapse;margin:3mm 0 8mm;page-break-inside:auto}thead{display:table-header-group}tr{page-break-inside:avoid}
      th,td{border:1px solid #64748b;padding:2.5mm;text-align:center;font-size:9.5pt}th{background:#dce6f1;color:#173e68}tbody tr:nth-child(even){background:#f8fafc}
      .empty{padding:6mm;color:#64748b}.note{background:#f3f6fa;padding:3mm}.signatures{display:grid;grid-template-columns:1fr 1fr;gap:20mm;margin-top:25mm;text-align:center}
      footer{margin-top:15mm;border-top:1px solid #cbd5e1;padding-top:4mm;font-size:9pt;color:#64748b}
      @media screen{body{max-width:210mm;margin:15px auto;padding:15mm;box-shadow:0 0 10px #bbb}.cover{min-height:250mm}}
      @media print{.cover{min-height:255mm}section{break-inside:auto}h2,h3{break-after:avoid}}
    </style></head><body>${content}${format === "pdf" ? `<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),500))</script>` : ""}</body></html>`

    if (format === "pdf") {
      return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Content-Disposition": "inline; filename=CHM-SFD-report-print.html", "Cache-Control": "no-store" } })
    }
    return new NextResponse(html, {
      headers: {
        "Content-Type": "application/msword; charset=utf-8",
        "Content-Disposition": "attachment; filename=CHM-SFD-Quarterly-Report.doc",
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("CHM_REPORT_EXPORT_FAILED", error)
    return NextResponse.json({ error: "تعذر إنشاء التقرير من قاعدة البيانات. يرجى مراجعة سجلات النظام." }, { status: 503 })
  }
}
