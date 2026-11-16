import { NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const fileType = formData.get("type") as string

    if (!file) {
      return NextResponse.json({ success: false, message: "لم يتم إرفاق ملف" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // قراءة ملف الأكسل
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]

    // تحويل الشيت إلى بيانات JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet)

    return NextResponse.json({
      success: true,
      count: jsonData.length,
      type: fileType,
      data: jsonData,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}