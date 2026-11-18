import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import * as XLSX from "xlsx"
import { auth } from "@/lib/auth"
import { pool } from "@/lib/db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
const MAX_FILE_SIZE = 15 * 1024 * 1024
const SHEETS = {
  projects: { name: "المشاريع", headers: ["رقم المشروع", "اسم المشروع", "الفرع"] },
  locations: { name: "المواقع", headers: ["المحافظة", "المديرية", "العزلة", "القرية/الحي"] },
  categories: { name: "التصنيفات", headers: ["التصنيف الرئيسي", "التصنيف الفرعي", "التصنيف الفرعي الثاني"] },
} as const

type Row = Record<string, string>
type Dataset = { projects: Row[]; locations: Row[]; categories: Row[] }
const clean = (v: unknown) => String(v ?? "").trim()
const key = (parts: string[]) => parts.map((x) => x.normalize("NFC").trim()).join("\u001f")

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { ok: false as const, status: 401, message: "يرجى تسجيل الدخول أولاً." }
  const allowed = (process.env.CHM_ADMIN_EMAILS ?? "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean)
  if (!session.user.email || !allowed.includes(session.user.email.toLowerCase()))
    return { ok: false as const, status: 403, message: "هذه العملية متاحة لمدير النظام فقط. أضف بريد المدير إلى CHM_ADMIN_EMAILS في إعدادات Vercel." }
  return { ok: true as const, actor: session.user.email }
}

function readSheet(book: XLSX.WorkBook, name: string, required: readonly string[]) {
  const sheetName = book.SheetNames.find((n) => n.trim() === name)
  if (!sheetName) throw new Error(`الورقة المطلوبة غير موجودة: ${name}`)
  const sheet = book.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "", raw: false })
  const headers = (rows[0] ?? []).map(clean)
  const missing = required.filter((h) => !headers.includes(h))
  if (missing.length) throw new Error(`أعمدة مفقودة في ورقة ${name}: ${missing.join("، ")}`)
  return rows.slice(1).map((values) => {
    const row: Row = {}
    headers.forEach((h, i) => { if (h) row[h] = clean(values[i]) })
    return row
  }).filter((r) => Object.values(r).some(Boolean))
}

function parseWorkbook(buffer: Buffer) {
  const book = XLSX.read(buffer, { type: "buffer", cellDates: true })
  const projects = readSheet(book, SHEETS.projects.name, ["رقم المشروع", "اسم المشروع"])
  const locations = readSheet(book, SHEETS.locations.name, SHEETS.locations.headers)
  const categories = readSheet(book, SHEETS.categories.name, SHEETS.categories.headers)
  const unique = <T>(rows: T[], getKey: (r: T) => string) => {
    const map = new Map<string, T>()
    let duplicates = 0
    for (const row of rows) {
      const k = getKey(row)
      if (!k || k.replace(/\u001f/g, "").length === 0) continue
      if (map.has(k)) duplicates++
      map.set(k, row)
    }
    return { rows: [...map.values()], duplicates }
  }
  const p = unique(projects.filter(r => r["رقم المشروع"] && r["اسم المشروع"]), r => key([r["رقم المشروع"]]))
  const l = unique(locations.filter(r => r["المحافظة"] && r["المديرية"] && r["القرية/الحي"]), r => key([r["المحافظة"], r["المديرية"], r["العزلة"], r["القرية/الحي"]]))
  const c = unique(categories.filter(r => r["التصنيف الرئيسي"]), r => key([r["التصنيف الرئيسي"], r["التصنيف الفرعي"], r["التصنيف الفرعي الثاني"]]))
  return {
    data: { projects: p.rows, locations: l.rows, categories: c.rows } as Dataset,
    counts: {
      projects: { source: projects.length, valid: p.rows.length, duplicates: p.duplicates, rejected: projects.length - p.rows.length - p.duplicates },
      locations: { source: locations.length, valid: l.rows.length, duplicates: l.duplicates, rejected: locations.length - l.rows.length - l.duplicates },
      categories: { source: categories.length, valid: c.rows.length, duplicates: c.duplicates, rejected: categories.length - c.rows.length - c.duplicates },
    },
  }
}

async function upsertRows(client: import("pg").PoolClient, table: string, columns: string[], rows: unknown[][], conflict: string, updates: string[]) {
  const chunkSize = 300
  for (let start = 0; start < rows.length; start += chunkSize) {
    const chunk = rows.slice(start, start + chunkSize)
    const values: unknown[] = []
    const tuples = chunk.map((row, ri) => {
      const placeholders = row.map((v, ci) => { values.push(v); return `$${ri * columns.length + ci + 1}` })
      return `(${placeholders.join(",")})`
    })
    const sql = `INSERT INTO "${table}" (${columns.map(c => `"${c}"`).join(",")}) VALUES ${tuples.join(",")} ON CONFLICT ("${conflict}") DO UPDATE SET ${updates.map(c => `"${c}"=EXCLUDED."${c}"`).join(",")}`
    await client.query(sql, values)
  }
}

export async function POST(req: NextRequest) {
  const gate = await requireAdmin()
  if (!gate.ok) return NextResponse.json({ success: false, message: gate.message }, { status: gate.status })
  try {
    const form = await req.formData()
    const file = form.get("file")
    const mode = clean(form.get("mode"))
    if (!(file instanceof File)) return NextResponse.json({ success: false, message: "يرجى اختيار ملف Excel." }, { status: 400 })
    if (file.size === 0 || file.size > MAX_FILE_SIZE) return NextResponse.json({ success: false, message: "حجم الملف غير صالح. الحد الأقصى 15 ميجابايت." }, { status: 400 })
    if (!file.name.toLowerCase().endsWith(".xlsx")) return NextResponse.json({ success: false, message: "يرجى رفع ملف بصيغة XLSX." }, { status: 400 })
    const parsed = parseWorkbook(Buffer.from(await file.arrayBuffer()))
    if (mode === "preview") {
      return NextResponse.json({ success: true, counts: parsed.counts, sample: {
        projects: parsed.data.projects.slice(0, 5),
        locations: parsed.data.locations.slice(0, 5),
        categories: parsed.data.categories.slice(0, 5),
      } })
    }
    if (mode !== "commit" || form.get("confirm") !== "YES")
      return NextResponse.json({ success: false, message: "لم يتم اعتماد الاستيراد. أعد المعاينة ثم أكد العملية." }, { status: 400 })

    const client = await pool.connect()
    try {
      await client.query("BEGIN")
      const projectRows = parsed.data.projects.map(r => [r["رقم المشروع"], r["اسم المشروع"], r["الفرع"] ?? "", JSON.stringify(r), true, new Date()])
      const locationRows = parsed.data.locations.map(r => [key([r["المحافظة"], r["المديرية"], r["العزلة"], r["القرية/الحي"]]), r["المحافظة"], r["المديرية"], r["العزلة"], r["القرية/الحي"], true, new Date()])
      const categoryRows = parsed.data.categories.map(r => [key([r["التصنيف الرئيسي"], r["التصنيف الفرعي"], r["التصنيف الفرعي الثاني"]]), r["التصنيف الرئيسي"], r["التصنيف الفرعي"], r["التصنيف الفرعي الثاني"], true, new Date()])
      await upsertRows(client, "chm_reference_projects", ["project_number","project_name","branch","data","active","updated_at"], projectRows, "project_number", ["project_name","branch","data","active","updated_at"])
      await upsertRows(client, "chm_reference_locations", ["location_key","governorate","directorate","sub_district","village","active","updated_at"], locationRows, "location_key", ["governorate","directorate","sub_district","village","active","updated_at"])
      await upsertRows(client, "chm_reference_categories", ["category_key","primary_category","sub_category","second_sub_category","active","updated_at"], categoryRows, "category_key", ["primary_category","sub_category","second_sub_category","active","updated_at"])
      await client.query(
        'INSERT INTO "chm_reference_imports" ("file_name","imported_by","row_counts") VALUES ($1,$2,$3::jsonb)',
        [file.name, gate.actor, JSON.stringify(parsed.counts)],
      )
      await client.query("COMMIT")
      return NextResponse.json({ success: true, message: "تم حفظ البيانات المرجعية في Neon بنجاح.", counts: parsed.counts })
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally { client.release() }
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذر معالجة ملف Excel."
    return NextResponse.json({ success: false, message }, { status: 400 })
  }
}
