"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function FieldMonitoringPage() {
  const [monitorings, setMonitorings] = useState([
    { id: 1, project: "مشروع تحسين سبل العيش (800-13413)", date: "2026-10-15", location: "تعز - ماوية", officer: "أحمد المظفري", result: "التنفيذ يسير وفق الجدول الزمني المعتمد." }
  ])

  const [projectNo, setProjectNo] = useState("")
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [officer, setOfficer] = useState("")
  const [result, setResult] = useState("")

  const handleAdd = () => {
    if (!projectNo || !result) {
      toast.error("يرجى إدخال رقم المشروع ونتائج المتابعة.")
      return
    }
    setMonitorings([
      ...monitorings,
      { id: Date.now(), project: projectNo, date: date || "2026-10-16", location: location || "تعز", officer: officer || "المختص", result }
    ])
    setProjectNo("")
    setResult("")
    toast.success("تم تسجيل تقرير المتابعة الميدانية بنجاح.")
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 dir-rtl text-right font-sans">
      <div className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-gray-900">📍 المحور السادس: المتابعة الميدانية والرقابة</h1>
          <p className="text-xs text-gray-500 mt-0.5">توثيق زيارات ومتابعات المشاريع الميدانية، تسجيل الملاحظات، النتائج والتقارير المرتبطة.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-gray-50 py-3 border-b">
          <CardTitle className="text-sm font-bold">تسجيل تقرير متابعة ميدانية جديد</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold mb-1">رقم أو اسم المشروع *</label>
              <Input value={projectNo} onChange={(e) => setProjectNo(e.target.value)} placeholder="مثال: 800-13413" />
            </div>
            <div>
              <label className="block font-semibold mb-1">تاريخ المتابعة</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="block font-semibold mb-1">الموقع / العزلة</label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="الموقع" />
            </div>
            <div>
              <label className="block font-semibold mb-1">المنفذ / الضابط</label>
              <Input value={officer} onChange={(e) => setOfficer(e.target.value)} placeholder="اسم المختص" />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">نتائج المتابعة والملاحظات والتقرير *</label>
            <Textarea rows={3} value={result} onChange={(e) => setResult(e.target.value)} placeholder="اكتب نتائج المتابعة الميدانية والملاحظات الإدارية والفنية..." />
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={handleAdd}>حفظ وإرسال التقرير الميداني</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gray-50 py-3 border-b">
          <CardTitle className="text-sm font-bold">سجل تقارير المتابعة الميدانية المسجلة</CardTitle>
        </CardHeader>
        <CardContent className="p-4 overflow-x-auto text-xs">
          <table className="w-full border-collapse border bg-white">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2 border">#</th>
                <th className="p-2 border">المشروع</th>
                <th className="p-2 border">التاريخ</th>
                <th className="p-2 border">الموقع</th>
                <th className="p-2 border">المنفذ</th>
                <th className="p-2 border">النتائج والملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {monitorings.map((m, idx) => (
                <tr key={m.id} className="border-b">
                  <td className="p-2 border text-center">{idx + 1}</td>
                  <td className="p-2 border font-bold text-blue-700">{m.project}</td>
                  <td className="p-2 border">{m.date}</td>
                  <td className="p-2 border">{m.location}</td>
                  <td className="p-2 border">{m.officer}</td>
                  <td className="p-2 border">{m.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}