"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ALL_PROJECTS_DATABASE } from "@/lib/appData"

export default function CorrectiveActionsPage() {
  const [currentView, setCurrentView] = useState<"dashboard" | "form">("dashboard")
  const [searchNo, setSearchNo] = useState("")
  const [searchName, setSearchName] = useState("")
  const [selectedProject, setSelectedProject] = useState<any | null>(null)

  const [correctiveType, setCorrectiveType] = useState("صندوق شكاوى تالف أو مفقود")
  const [actionDate, setActionDate] = useState("2026-10-30")
  const [actionExecutor, setActionExecutor] = useState("فريق الشكاوى والامتثال")
  const [actionDescription, setActionDescription] = useState("")
  const [box2Chooser, setBox2Chooser] = useState("ضابط الامتثال والمجتمع")

  const filteredProjects = ALL_PROJECTS_DATABASE.filter(p => {
    const matchNo = searchNo ? p.id.includes(searchNo) : true
    const matchName = searchName ? p.name.includes(searchName) : true
    return matchNo && matchName
  })

  const handleSelectProject = (p: typeof ALL_PROJECTS_DATABASE[0]) => {
    setSelectedProject(p)
    setSearchNo(p.id)
    setSearchName(p.name)
    toast.success(`تم استجلاب بيانات المشروع: ${p.id}`)
  }

  const handleFinalSave = () => {
    toast.success("✓ تم حفظ واعتماد تقرير الإجراءات التصحيحية بنجاح!")
    setCurrentView("dashboard")
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4 dir-rtl text-right font-sans text-xs">
      
      {/* رأس الصفحة الرئيسي */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row justify-between items-center gap-3 border-l-4 border-l-amber-600">
        <div>
          <h1 className="text-lg font-black text-slate-900">الإجراءات التصحيحية والمعالجات الميدانية</h1>
          <p className="text-[11px] text-slate-500">توثيق ومعالجة الملاحظات، صناديق الشكاوى البديلة، وتعديل اللوحات الإرشادية</p>
        </div>
        
        <div className="flex items-center gap-2">
          {currentView === "dashboard" ? (
            <Button onClick={() => setCurrentView("form")} className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 text-xs rounded-xl shadow-sm">
              + تسجيل إجراء تصحيحي جديد
            </Button>
          ) : (
            <Button onClick={() => setCurrentView("dashboard")} variant="outline" size="sm" className="text-xs bg-slate-100">
              ← العودة للقائمة الرئيسية
            </Button>
          )}
        </div>
      </div>

      {currentView === "dashboard" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card className="border bg-amber-50/40 shadow-sm">
              <CardContent className="p-4 flex flex-col justify-between">
                <span className="text-amber-900 font-bold">إجمالي الإجراءات التصحيحية</span>
                <span className="text-2xl font-black text-amber-800 mt-2">18 إجراء</span>
                <span className="text-[10px] text-amber-700 mt-1">مسجلة ومعتمدة في النظام</span>
              </CardContent>
            </Card>

            <Card className="border bg-blue-50/40 shadow-sm">
              <CardContent className="p-4 flex flex-col justify-between">
                <span className="text-blue-900 font-bold">صناديق تم استبدالها</span>
                <span className="text-2xl font-black text-blue-800 mt-2">12 صندوق</span>
                <span className="text-[10px] text-blue-700 mt-1">تالفة أو مفقودة</span>
              </CardContent>
            </Card>

            <Card className="border bg-emerald-50/40 shadow-sm">
              <CardContent className="p-4 flex flex-col justify-between">
                <span className="text-emerald-900 font-bold">لوحات تم تصحيحها</span>
                <span className="text-2xl font-black text-emerald-800 mt-2">6 لوحات</span>
                <span className="text-[10px] text-emerald-700 mt-1">تحديث مواقع وبيانات</span>
              </CardContent>
            </Card>
          </div>

          <Card className="border bg-white shadow-sm">
            <CardHeader className="bg-slate-50 border-b py-3">
              <CardTitle className="text-xs font-bold text-slate-900">سجل الإجراءات التصحيحية السابقة</CardTitle>
            </CardHeader>
            <CardContent className="p-4 overflow-x-auto">
              <table className="w-full text-right text-[11px]">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="p-2 border-l">رقم المشروع</th>
                    <th className="p-2 border-l">اسم المشروع</th>
                    <th className="p-2 border-l">نوع الإجراء التصحيحي</th>
                    <th className="p-2 border-l">تاريخ التنفيذ</th>
                    <th className="p-2 text-center">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-slate-50">
                    <td className="p-2 border-l font-mono font-bold text-blue-900">800-13059</td>
                    <td className="p-2 border-l">مشروع تأهيل المدرجات الزراعية - مقبنة</td>
                    <td className="p-2 border-l">تغيير مكان صندوق الشكاوى وتحديث اللوحة</td>
                    <td className="p-2 border-l font-mono">2026-10-25</td>
                    <td className="p-2 text-center">
                      <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">مكتمل ومعتمد</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          
          <Card className="border bg-white shadow-sm">
            <CardHeader className="bg-slate-50 border-b py-2.5">
              <CardTitle className="text-xs font-bold text-slate-900">بيانات المشروع المعني بالإجراء التصحيحي</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-blue-900">رقم المشروع:</label>
                  <Input value={searchNo} onChange={(e) => setSearchNo(e.target.value)} placeholder="بحث برقم المشروع..." className="h-8 font-mono text-xs bg-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold mb-1 text-blue-900">اسم المشروع (بحث تفاعلي):</label>
                  <Input value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="اكتب للبحث باسم المشروع..." className="h-8 text-xs bg-white" />
                </div>
              </div>

              {(searchNo || searchName) && filteredProjects.length > 0 && !selectedProject && (
                <div className="max-h-32 overflow-y-auto border bg-white rounded-lg p-1 space-y-1 shadow-inner">
                  {filteredProjects.slice(0, 8).map(p => (
                    <div key={p.id} onClick={() => handleSelectProject(p)} className="p-1.5 hover:bg-blue-50 cursor-pointer rounded flex justify-between items-center text-[11px]">
                      <span className="font-bold font-mono text-blue-900">{p.id}</span>
                      <span className="truncate max-w-md">{p.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {selectedProject ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-2 text-emerald-900 text-[11px]">
                  <div>• رقم المشروع: <span className="font-mono font-bold">{selectedProject.id}</span></div>
                  <div>• اسم المشروع: <span className="font-bold truncate">{selectedProject.name}</span></div>
                  <div>• القطاع: <span className="font-bold">{selectedProject.sector}</span></div>
                  <div>• الممول: <span className="font-bold">{selectedProject.funder}</span></div>
                </div>
              ) : (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-center font-bold text-[11px]">
                  يرجى اختيار المشروع أعلاه لاستجلاب البيانات تلقائياً.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border bg-white shadow-sm">
            <CardHeader className="bg-slate-50 border-b py-2.5">
              <CardTitle className="text-xs font-bold text-slate-900">تفاصيل الإجراء التصحيحي والمعالجة</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">نوع الإجراء التصحيحي *</label>
                  <select value={correctiveType} onChange={(e) => setCorrectiveType(e.target.value)} className="w-full h-8 border rounded p-1 bg-white font-bold text-amber-900 text-xs">
                    <option value="صندوق شكاوى تالف أو مفقود">صندوق شكاوى تالف أو مفقود</option>
                    <option value="تعديل موقع لوحة إرشادية">تعديل موقع لوحة إرشادية</option>
                    <option value="معالجة شكوى مجتمعية عاجلة">معالجة شكوى مجتمعية عاجلة</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">تاريخ التنفيذ *</label>
                  <Input type="date" value={actionDate} onChange={(e) => setActionDate(e.target.value)} className="h-8" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">الجهة المنفذة / المسؤول *</label>
                  <Input value={actionExecutor} onChange={(e) => setActionExecutor(e.target.value)} className="h-8" />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">الشخص المحدد (2) *</label>
                <Input value={box2Chooser} onChange={(e) => setBox2Chooser(e.target.value)} placeholder="اسم المسؤول أو الجهة المحددة..." className="h-8" />
              </div>

              <div>
                <label className="block font-semibold mb-1">وصف الإجراء التصحيحي والمعالجات المنفذة *</label>
                <Textarea rows={3} value={actionDescription} onChange={(e) => setActionDescription(e.target.value)} placeholder="اكتب تفاصيل الإجراء التصحيحي المتخذ..." className="text-xs" />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                <span className="font-bold text-amber-900">📸 إرفاق صور توثيق الإجراء التصحيحي:</span>
                <Input type="file" accept="image/*" multiple className="text-[11px] w-64 bg-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-white shadow-sm">
            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="w-full md:w-auto flex-1">
                <label className="block font-bold text-slate-800 mb-1">📎 إرفاق محضر أو تقرير المعالجة (PDF / Word):</label>
                <Input type="file" accept=".pdf, .doc, .docx" className="text-xs bg-white w-full" />
              </div>
              <div className="pt-2 md:pt-6 flex gap-2">
                <Button onClick={() => setCurrentView("dashboard")} variant="outline" className="text-xs">
                  إلغاء
                </Button>
                <Button onClick={handleFinalSave} className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-2.5 text-xs rounded-xl shadow-md">
                  حفظ واعتماد التقرير التصحيحي ✓
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      )}

    </div>
  )
}