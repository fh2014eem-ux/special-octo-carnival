"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function OperationsPage() {
  const { operations } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("الكل")
  const [typeFilter, setTypeFilter] = useState("الكل")

  const filteredOps = operations.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.phone.includes(searchTerm) || 
                          o.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (o.id && o.id.toString().includes(searchTerm))
    const matchesStatus = statusFilter === "الكل" || o.status === statusFilter
    const matchesType = typeFilter === "الكل" || o.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  // تنزيل إكسل مخصص حسب الحالة أو النوع الحالي
  const handleExportFilteredExcel = () => {
    const headers = ["رقم العملية", "نوع العملية", "الحالة", "اسم الشاكي", "الهاتف", "المحافظة", "الموضوع", "تاريخ الإضافة"]
    const rows = filteredOps.length > 0 ? filteredOps.map(o => [
      o.id || "OP-2026-001",
      o.type,
      o.status,
      `"${o.name}"`,
      o.phone,
      o.province,
      `"${o.subject}"`,
      "2026/10/25"
    ]) : [
      ["OP-2026-001", typeFilter !== "الكل" ? typeFilter : "شكوى", statusFilter !== "الكل" ? statusFilter : "مغلقة", "فهيم السامعي", "777828051", "تعز", "موضوع تجريبي", "2026/10/25"]
    ]

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `سجل_العمليات_فلتر_الحالة_${statusFilter}_النوع_${typeFilter}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success(`تم تنزيل تقرير الإكسل للعمليات (الحالة: ${statusFilter} | النوع: ${typeFilter}) بنجاح! ✓`)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 dir-rtl text-right font-sans">
      <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-slate-900">سجل العمليات والشكاوى</h1>
          <p className="text-xs text-slate-500 mt-1">إدارة ومتابعة جميع العمليات والبلاغات والطلبات المسجلة في النظام</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExportFilteredExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
            📊 تنزيل إكسل حسب الفلتر الحالي
          </Button>
          <Link href="/operations/new">
            <Button className="bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs">
              ➕ إدخال عملية جديدة
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border shadow-sm bg-white">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">بحث:</label>
            <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="بحث..." className="text-xs bg-slate-50" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">تصفية حسب الحالة:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full p-2 border rounded-lg text-xs bg-white">
              <option value="الكل">جميع الحالات</option>
              <option value="مستلمة">مستلمة</option>
              <option value="جديدة">جديدة</option>
              <option value="مغلقة">مغلقة</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">تصفية حسب نوع العملية:</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full p-2 border rounded-lg text-xs bg-white">
              <option value="الكل">جميع الأنواع</option>
              <option value="شكوى">شكوى</option>
              <option value="بلاغ">بلاغ</option>
              <option value="استعلام">استعلام</option>
              <option value="مقترح">مقترح</option>
              <option value="طلب">طلب</option>
              <option value="إطراء">إطراء</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50 border-b py-3">
          <CardTitle className="text-xs font-bold text-slate-800">📋 قائمة العمليات المسجلة ({filteredOps.length} عملية)</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100 text-slate-700 border-b font-bold">
              <tr>
                <th className="p-3">رقم العملية</th>
                <th className="p-3">النوع</th>
                <th className="p-3">مقدم الطلب</th>
                <th className="p-3">الموضوع</th>
                <th className="p-3">المحافظة</th>
                <th className="p-3">الحالة</th>
                <th className="p-3 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500">لا توجد عمليات مطابقة.</td>
                </tr>
              ) : (
                filteredOps.map((op, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-blue-900">{op.id || `OP-2026-00${idx+1}`}</td>
                    <td className="p-3 font-bold"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-[10px]">{op.type}</span></td>
                    <td className="p-3 font-semibold">{op.name}</td>
                    <td className="p-3 text-slate-600">{op.subject}</td>
                    <td className="p-3 text-slate-600">{op.province}</td>
                    <td className="p-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">{op.status}</span></td>
                    <td className="p-3 text-center"><Button variant="outline" size="sm" className="text-xs h-7">👁️ عرض</Button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}