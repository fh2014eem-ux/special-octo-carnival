import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import * as XLSX from "xlsx"
import { auth } from "@/lib/auth"
import { pool } from "@/lib/db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
const MAX_FILE_SIZE = 15 * 1024 * 1024
type Row = Record<string, string>
const clean = (v: unknown) => String(v ?? "").trim().normalize("NFC")
const key = (parts: string[]) => parts.map(clean).join("\u001f")

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.active === false) return { ok: false as const, status: 401, message: "يرجى تسجيل الدخول أولاً." }
  const allowed = (process.env.CHM_ADMIN_EMAILS ?? "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean)
  if (!session.user.email || !allowed.includes(session.user.email.toLowerCase()))
    return { ok: false as const, status: 403, message: "هذه العملية متاحة لمدير النظام فقط." }
  return { ok: true as const, actor: session.user.email }
}

function parse(file: Buffer, dataset: "projects" | "locations") {
  const book = XLSX.read(file, { type: "buffer", cellDates: true })
  const accepted = dataset === "projects" ? ["المشاريع", "مرجع_المشاريع"] : ["المواقع", "مرجع_المواقع"]
  const sheetName = book.SheetNames.find(n => accepted.includes(n.trim()))
  if (!sheetName) throw new Error(`ورقة البيانات المطلوبة غير موجودة: ${accepted.join(" أو ")}`)
  const rows = XLSX.utils.sheet_to_json<unknown[]>(book.Sheets[sheetName], { header: 1, defval: "", raw: false })
  const headers = (rows[0] ?? []).map(clean)
  const required = dataset === "projects" ? ["رقم المشروع", "اسم المشروع"] : ["المحافظة", "المديرية", "العزلة", "القرية/الحي"]
  const missing = required.filter(h => !headers.includes(h))
  if (missing.length) throw new Error(`أعمدة مفقودة: ${missing.join("، ")}`)
  const data: Row[] = rows.slice(1).map(values => {
    const row: Row = {}
    headers.forEach((h, i) => { if (h) row[h] = clean(values[i]) })
    return row
  }).filter(row => Object.values(row).some(Boolean))
  const map = new Map<string, Row>()
  let duplicates = 0, rejected = 0
  for (const row of data) {
    const valid = dataset === "projects" ? !!row["رقم المشروع"] && !!row["اسم المشروع"] : !!row["المحافظة"] && !!row["المديرية"]
    if (!valid) { rejected++; continue }
    const k = dataset === "projects" ? key([row["رقم المشروع"]]) : key([row["المحافظة"], row["المديرية"], row["العزلة"], row["القرية/الحي"]])
    if (map.has(k)) duplicates++
    map.set(k, row)
  }
  return { rows: [...map.values()], source: data.length, duplicates, rejected }
}

async function upsert(client: import("pg").PoolClient, table: string, columns: string[], rows: unknown[][], conflict: string, updates: string[]) {
  for (let start = 0; start < rows.length; start += 250) {
    const chunk = rows.slice(start, start + 250), values: unknown[] = []
    const tuples = chunk.map((row, ri) => `(${row.map((v, ci) => { values.push(v); return `$${ri * columns.length + ci + 1}` }).join(",")})`)
    await client.query(`INSERT INTO "${table}" (${columns.map(c => `"${c}"`).join(",")}) VALUES ${tuples.join(",")} ON CONFLICT ("${conflict}") DO UPDATE SET ${updates.map(c => `"${c}"=EXCLUDED."${c}"`).join(",")}`, values)
  }
}

export async function POST(req: NextRequest) {
  const gate = await requireAdmin()
  if (!gate.ok) return NextResponse.json({ success: false, message: gate.message }, { status: gate.status })
  try {
    const form = await req.formData()
    const dataset = String(form.get("dataset") ?? "")
    const file = form.get("file")
    const mode = String(form.get("mode") ?? "preview")
    if (dataset !== "projects" && dataset !== "locations") return NextResponse.json({ success: false, message: "حدد نوع ملف واحد: المشاريع أو المواقع." }, { status: 400 })
    if (!(file instanceof File) || !file.name.toLowerCase().endsWith(".xlsx") || file.size === 0 || file.size > MAX_FILE_SIZE)
      return NextResponse.json({ success: false, message: "اختر ملف XLSX صالحاً لا يتجاوز 15 ميجابايت." }, { status: 400 })
    const parsed = parse(Buffer.from(await file.arrayBuffer()), dataset)
    if (parsed.rows.length === 0) return NextResponse.json({ success: false, message: "لم توجد سجلات صالحة؛ لم تتغير قاعدة البيانات." }, { status: 422 })
    if (mode === "preview") return NextResponse.json({ success: true, dataset, fileName: file.name, counts: { source: parsed.source, valid: parsed.rows.length, duplicates: parsed.duplicates, rejected: parsed.rejected }, sample: parsed.rows.slice(0, 5) })
    if (mode !== "commit" || form.get("confirm") !== "YES") return NextResponse.json({ success: false, message: "يلزم إجراء المعاينة ثم تأكيد الاستيراد." }, { status: 400 })
    const client = await pool.connect()
    try {
      await client.query("BEGIN")
      if (dataset === "projects") {
        await client.query('UPDATE "chm_reference_projects" SET active = FALSE')
        const rows = parsed.rows.map(r => [r["رقم المشروع"], r["اسم المشروع"], r["الفرع"] ?? "", JSON.stringify(r), true, new Date()])
        await upsert(client, "chm_reference_projects", ["project_number","project_name","branch","data","active","updated_at"], rows, "project_number", ["project_name","branch","data","active","updated_at"])
      } else {
        await client.query('UPDATE "chm_reference_locations" SET active = FALSE')
        const rows = parsed.rows.map(r => [key([r["المحافظة"],r["المديرية"],r["العزلة"],r["القرية/الحي"]]), r["المحافظة"], r["المديرية"], r["العزلة"] ?? "", r["القرية/الحي"] ?? "", true, new Date()])
        await upsert(client, "chm_reference_locations", ["location_key","governorate","directorate","sub_district","village","active","updated_at"], rows, "location_key", ["governorate","directorate","sub_district","village","active","updated_at"])
      }
      await client.query('INSERT INTO "chm_reference_imports" ("file_name","imported_by","row_counts") VALUES ($1,$2,$3::jsonb)', [file.name, gate.actor, JSON.stringify({ dataset, source: parsed.source, valid: parsed.rows.length, duplicates: parsed.duplicates, rejected: parsed.rejected })])
      await client.query("COMMIT")
      return NextResponse.json({ success: true, dataset, counts: { source: parsed.source, imported: parsed.rows.length, duplicates: parsed.duplicates, rejected: parsed.rejected }, message: "تم تحديث المجموعة المحددة فقط بنجاح." })
    } catch (error) { await client.query("ROLLBACK"); throw error } finally { client.release() }
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذر استيراد الملف."
    return NextResponse.json({ success: false, message }, { status: 400 })
  }
}
