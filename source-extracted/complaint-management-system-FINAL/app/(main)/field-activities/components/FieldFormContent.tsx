"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface FieldFormContentProps {
  awarenessMode: "أساسية" | "تكرار"
  setAwarenessMode: (mode: "أساسية" | "تكرار") => void
  projectType: "ميداني" | "تدريبي" | "أخرى"
  setProjectType: (type: "ميداني" | "تدريبي" | "أخرى") => void
  searchNo: string
  setSearchNo: (val: string) => void
  searchName: string
  setSearchName: (val: string) => void
  selectedProject: any
  filteredProjects: any[]
  handleSelectProject: (p: any) => void
  awarenessExecuter: string
  setAwarenessExecuter: (val: string) => void
  awarenessDate: string
  setAwarenessDate: (val: string) => void
  awarenessPlace: string
  setAwarenessPlace: (val: string) => void
  repeatedSessions: any[]
  setRepeatedSessions: React.Dispatch<React.SetStateAction<any[]>>
  totalCalculatedMales: number
  totalCalculatedFemales: number
  totalBeneficiaries: number
  brochuresCount: number
  setBrochuresCount: (val: number) => void
  postersCount: number
  setPostersCount: (val: number) => void
  brochuresTarget: string
  setBrochuresTarget: (val: string) => void
  postersLocation: string
  setPostersLocation: (val: string) => void
  hasCommunityCommittee: "نعم" | "لا"
  setHasCommunityCommittee: (val: "نعم" | "لا") => void
  isCommitteeTrained: "نعم" | "لا"
  setIsCommitteeTrained: (val: "نعم" | "لا") => void
  committeeTrainer: string
  setCommitteeTrainer: (val: string) => void
  committeeType: string
  setCommitteeType: (val: string) => void
  trainingDate: string
  setTrainingDate: (val: string) => void
  trainingPlace: string
  setTrainingPlace: (val: string) => void
  presentMembers: any[]
  setPresentMembers: React.Dispatch<React.SetStateAction<any[]>>
  absentMembers: any[]
  setAbsentMembers: React.Dispatch<React.SetStateAction<any[]>>
  projectTeam: any[]
  setProjectTeam: React.Dispatch<React.SetStateAction<any[]>>
  presentMales: number
  presentFemales: number
  absentMales: number
  absentFemales: number
  hasBox: "نعم" | "لا"
  setHasBox: (val: "نعم" | "لا") => void
  noBoxReason: string
  setNoBoxReason: (val: string) => void
  boxCount: number
  setBoxCount: (val: number) => void
  boxHangDate: string
  setBoxHangDate: (val: string) => void
  boxLocation: string
  setBoxLocation: (val: string) => void
  boxChoiceReason: string
  setBoxChoiceReason: (val: string) => void
  boxChooserName: string
  setBoxChooserName: (val: string) => void
  hasBoard: "نعم" | "لا"
  setHasBoard: (val: "نعم" | "لا") => void
  noBoardReason: string
  setNoBoardReason: (val: string) => void
  hasMinutesBook: "نعم" | "لا"
  setHasMinutesBook: (val: "نعم" | "لا") => void
  noMinutesBookReason: string
  setNoMinutesBookReason: (val: string) => void
  receiverName: string
  setReceiverName: (val: string) => void
  receiverRole: string
  setReceiverRole: (val: string) => void
  receiverPhone: string
  setReceiverPhone: (val: string) => void
  minutesBookNotes: string
  setMinutesBookNotes: (val: string) => void
  setCurrentView: (view: "dashboard" | "form") => void
  handleFinalSave: () => void
  awarenessDescription: string
  setAwarenessDescription: (val: string) => void
  activitySubject: string
  setActivitySubject: (val: string) => void
  activityObjective: string
  setActivityObjective: (val: string) => void
  activityDuration: string
  setActivityDuration: (val: string) => void
  directBeneficiaries: number
  setDirectBeneficiaries: (val: number) => void
  indirectBeneficiaries: number
  setIndirectBeneficiaries: (val: number) => void
  committeeNoReason: string
  setCommitteeNoReason: (val: string) => void
  committeeNotTrainedReason: string
  setCommitteeNotTrainedReason: (val: string) => void
  trainingDescription: string
  setTrainingDescription: (val: string) => void
  boxNumber: string
  setBoxNumber: (val: string) => void
  boardCount: number
  setBoardCount: (val: number) => void
  boardLocation: string
  setBoardLocation: (val: string) => void
  boardReason: string
  setBoardReason: (val: string) => void
}

export default function FieldFormContent(props: FieldFormContentProps) {
  const {
    awarenessMode, setAwarenessMode,
    projectType, setProjectType,
    searchNo, setSearchNo,
    searchName, setSearchName,
    selectedProject, filteredProjects, handleSelectProject,
    awarenessExecuter, setAwarenessExecuter,
    awarenessDate, setAwarenessDate,
    awarenessPlace, setAwarenessPlace,
    awarenessDescription, setAwarenessDescription,
    activitySubject, setActivitySubject,
    activityObjective, setActivityObjective,
    activityDuration, setActivityDuration,
    directBeneficiaries, setDirectBeneficiaries,
    indirectBeneficiaries, setIndirectBeneficiaries,
    repeatedSessions, setRepeatedSessions,
    totalCalculatedMales, totalCalculatedFemales, totalBeneficiaries,
    brochuresCount, setBrochuresCount,
    postersCount, setPostersCount,
    brochuresTarget, setBrochuresTarget,
    postersLocation, setPostersLocation,
    hasCommunityCommittee, setHasCommunityCommittee,
    committeeNoReason, setCommitteeNoReason,
    committeeNotTrainedReason, setCommitteeNotTrainedReason,
    isCommitteeTrained, setIsCommitteeTrained,
    committeeTrainer, setCommitteeTrainer,
    committeeType, setCommitteeType,
    trainingDate, setTrainingDate,
    trainingPlace, setTrainingPlace,
    trainingDescription, setTrainingDescription,
    presentMembers, setPresentMembers,
    absentMembers, setAbsentMembers,
    projectTeam, setProjectTeam,
    presentMales, presentFemales, absentMales, absentFemales,
    hasBox, setHasBox, noBoxReason, setNoBoxReason,
    boxCount, setBoxCount, boxHangDate, setBoxHangDate,
    boxLocation, setBoxLocation, boxChoiceReason, setBoxChoiceReason,
    boxNumber, setBoxNumber,
    boxChooserName, setBoxChooserName,
    hasBoard, setHasBoard, noBoardReason, setNoBoardReason,
    boardCount, setBoardCount, boardLocation, setBoardLocation, boardReason, setBoardReason,
    hasMinutesBook, setHasMinutesBook, noMinutesBookReason, setNoMinutesBookReason,
    receiverName, setReceiverName, receiverRole, setReceiverRole,
    receiverPhone, setReceiverPhone, minutesBookNotes, setMinutesBookNotes,
    setCurrentView, handleFinalSave
  } = props

  return (
        <div className="space-y-4">
          
          <div className="bg-white p-3 rounded-xl shadow-sm border flex justify-between items-center">
            <span className="font-bold text-slate-800">نوع نموذج الإدخال:</span>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              <Button 
                size="sm"
                variant={awarenessMode === "أساسية" ? "default" : "ghost"} 
                onClick={() => setAwarenessMode("أساسية")}
                className={awarenessMode === "أساسية" ? "bg-blue-900 text-white text-xs h-7" : "text-xs h-7"}
              >
                🟢 التوعية الأساسية
              </Button>
              <Button 
                size="sm"
                variant={awarenessMode === "تكرار" ? "default" : "ghost"} 
                onClick={() => setAwarenessMode("تكرار")}
                className={awarenessMode === "تكرار" ? "bg-indigo-900 text-white text-xs h-7" : "text-xs h-7"}
              >
                🔄 استمرار التوعية (مكررة)
              </Button>
            </div>
          </div>

          <Card className="border bg-white shadow-sm">
            <CardHeader className="bg-slate-50 border-b py-2.5">
              <CardTitle className="text-xs font-bold text-slate-900">بيانات المشروع</CardTitle>
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
                  <div>• ضابط المشروع: <span className="font-bold">{selectedProject.officer}</span></div>
                  <div>• نسبة الإنجاز: <span className="font-bold">{selectedProject.progress || "80%"}</span></div>
                </div>
              ) : (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-center font-bold text-[11px]">
                  يرجى اختيار المشروع أعلاه لاستجلاب البيانات تلقائياً.
                </div>
              )}

              {awarenessMode === "أساسية" && (
                <div className="pt-2 border-t">
                  <label className="block font-semibold mb-1 text-slate-700">نوع التوعية / المشروع (ميداني / تدريبي / أخرى):</label>
                  <select value={projectType} onChange={(e) => setProjectType(e.target.value as any)} className="w-full h-8 p-1 border rounded bg-white font-bold text-blue-900 text-xs">
                    <option value="ميداني">ميداني (بنية تحتية / خدمية)</option>
                    <option value="تدريبي">تدريبي</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
              )}
            </CardContent>
          </Card>

          {awarenessMode === "تكرار" ? (
            <Card className="border border-indigo-200 bg-indigo-50/10 shadow-sm">
              <CardHeader className="bg-indigo-100/50 border-b border-indigo-200 py-2.5">
                <CardTitle className="text-xs font-bold text-indigo-900">بيانات التوعية (تكرار / استمرار التوعية)</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">منفذ التوعية *</label>
                    <Input value={awarenessExecuter} onChange={(e) => setAwarenessExecuter(e.target.value)} className="h-8" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">تاريخ التوعية *</label>
                    <Input type="date" value={awarenessDate} onChange={(e) => setAwarenessDate(e.target.value)} className="h-8" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">مكان التوعية *</label>
                    <Input value={awarenessPlace} onChange={(e) => setAwarenessPlace(e.target.value)} className="h-8" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-white p-3 rounded-lg border">
                  <div>
                    <label className="block font-semibold mb-1">عدد الذكور *</label>
                    <Input type="number" value={totalCalculatedMales} disabled className="h-8" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">عدد الإناث *</label>
                    <Input type="number" value={totalCalculatedFemales} disabled className="h-8" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">إجمالي المستفيدين (تلقائي)</label>
                    <Input value={totalBeneficiaries} disabled className="h-8 bg-slate-200 font-mono font-bold" />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">وصف النشاط المنفذ *</label>
                  <Textarea rows={2} value={awarenessDescription} onChange={(e) => setAwarenessDescription(e.target.value)} placeholder="اكتب وصفاً مختصراً للنشاط..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border p-3 rounded-lg bg-white">
                  <div>
                    <label className="block font-semibold mb-1">عدد البروشورات والملصقات:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="number" value={brochuresCount} onChange={(e) => setBrochuresCount(Number(e.target.value))} placeholder="البروشورات" className="h-8" />
                      <Input type="number" value={postersCount} onChange={(e) => setPostersCount(Number(e.target.value))} placeholder="الملصقات" className="h-8" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">📸 إرفاق صور تعليق الملصقات وتوزيع البروشورات:</label>
                    <Input type="file" accept="image/*" multiple className="text-[11px]" />
                  </div>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
                  <span className="font-bold text-indigo-900">📄 تحميل استمارة تكرار التوعية:</span>
                  <Input type="file" accept=".pdf, .doc, .docx" className="text-[11px] w-64 bg-white" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              
              <Card className="border bg-white shadow-sm">
                <CardHeader className="bg-slate-50 border-b py-2.5">
                  <CardTitle className="text-xs font-bold text-slate-900">بيانات التوعية الأساسية ومنفذ التوعية</CardTitle>
                </CardHeader>
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">منفذ التوعية *</label>
                    <Input value={awarenessExecuter} onChange={(e) => setAwarenessExecuter(e.target.value)} className="h-8" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">تاريخ التوعية *</label>
                    <Input type="date" value={awarenessDate} onChange={(e) => setAwarenessDate(e.target.value)} className="h-8" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">مكان التنفيذ *</label>
                    <Input value={awarenessPlace} onChange={(e) => setAwarenessPlace(e.target.value)} className="h-8" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">موضوع التوعية</label>
                    <Input value={activitySubject} onChange={(e) => setActivitySubject(e.target.value)} className="h-8" placeholder="موضوع النشاط" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">الهدف من النشاط</label>
                    <Input value={activityObjective} onChange={(e) => setActivityObjective(e.target.value)} className="h-8" placeholder="الهدف" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">مدة النشاط</label>
                    <Input value={activityDuration} onChange={(e) => setActivityDuration(e.target.value)} className="h-8" placeholder="مثال: ساعتان" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">المستفيدون المباشرون</label>
                    <Input type="number" min="0" value={directBeneficiaries} onChange={(e) => setDirectBeneficiaries(Number(e.target.value))} className="h-8" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">المستفيدون غير المباشرين</label>
                    <Input type="number" min="0" value={indirectBeneficiaries} onChange={(e) => setIndirectBeneficiaries(Number(e.target.value))} className="h-8" />
                  </div>
                </CardContent>
              </Card>

              {/* إذا كان نوع المشروع ميداني */}
              {projectType === "ميداني" && (
                <>
                  <Card className="border border-blue-200 bg-blue-50/10 shadow-sm">
                    <CardHeader className="bg-blue-100/50 border-b border-blue-200 py-2.5">
                      <CardTitle className="text-xs font-bold text-blue-900">بيانات تدريب اللجنة المجتمعية وفريق المشروع</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">هل توجد لجنة مجتمعية؟ *</label>
                          <select value={hasCommunityCommittee} onChange={(e) => setHasCommunityCommittee(e.target.value as any)} className="w-full h-8 border rounded p-1 bg-white font-bold">
                            <option value="نعم">نعم</option>
                            <option value="لا">لا</option>
                          </select>
                        </div>
                        {hasCommunityCommittee === "نعم" && (
                          <div>
                            <label className="block font-semibold mb-1">هل تم تدريب اللجنة؟ *</label>
                            <select value={isCommitteeTrained} onChange={(e) => setIsCommitteeTrained(e.target.value as any)} className="w-full h-8 border rounded p-1 bg-white font-bold">
                              <option value="نعم">نعم</option>
                              <option value="لا">لا</option>
                            </select>
                          </div>
                        )}
                      </div>

                      {hasCommunityCommittee === "لا" && (
                        <div className="mt-2">
                          <label className="block font-semibold mb-1 text-rose-800">سبب عدم وجود لجنة مجتمعية *</label>
                          <Textarea rows={2} value={committeeNoReason} onChange={(e) => setCommitteeNoReason(e.target.value)} className="bg-rose-50" />
                        </div>
                      )}

                      {hasCommunityCommittee === "نعم" && isCommitteeTrained === "لا" && (
                        <div className="mt-2">
                          <label className="block font-semibold mb-1 text-rose-800">سبب عدم تدريب اللجنة *</label>
                          <Textarea rows={2} value={committeeNotTrainedReason} onChange={(e) => setCommitteeNotTrainedReason(e.target.value)} className="bg-rose-50" />
                        </div>
                      )}

                      {hasCommunityCommittee === "نعم" && isCommitteeTrained === "نعم" && (
                        <div className="space-y-3 pt-3 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                              <label className="block font-semibold mb-1">منفذ التدريب *</label>
                              <Input value={committeeTrainer} onChange={(e) => setCommitteeTrainer(e.target.value)} className="h-8" />
                            </div>
                            <div>
                              <label className="block font-semibold mb-1">نوع اللجنة *</label>
                              <select value={committeeType} onChange={(e) => setCommitteeType(e.target.value)} className="w-full h-8 border rounded p-1 bg-white">
                                <option value="لجنة مشروع">لجنة مشروع</option>
                                <option value="محورية/مجلس تعاون قرية">محورية / مجلس تعاون قرية</option>
                                <option value="تعاقدات مجتمعية">تعاقدات مجتمعية</option>
                                <option value="مجلس آباء - أخرى">مجلس آباء - أخرى</option>
                              </select>
                            </div>
                            <div>
                              <label className="block font-semibold mb-1">تاريخ التدريب *</label>
                              <Input type="date" value={trainingDate} onChange={(e) => setTrainingDate(e.target.value)} className="h-8" />
                            </div>
                            <div>
                              <label className="block font-semibold mb-1">مكان التدريب *</label>
                              <Input value={trainingPlace} onChange={(e) => setTrainingPlace(e.target.value)} className="h-8" />
                            </div>
                          </div>
                          <div>
                            <label className="block font-semibold mb-1">وصف نشاط تدريب اللجنة</label>
                            <Textarea rows={2} value={trainingDescription} onChange={(e) => setTrainingDescription(e.target.value)} placeholder="تفاصيل التدريب والموضوعات التي تم تناولها..." />
                          </div>

                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                            <span className="font-bold text-blue-900">📸 إرفاق صور تدريب اللجنة المجتمعية:</span>
                            <Input type="file" accept="image/*" multiple className="text-[11px] w-64 bg-white" />
                          </div>

                          <div className="bg-slate-900 text-white p-3 rounded-lg flex justify-between items-center text-[11px] font-bold">
                            <div>✅ الحاضرون: ذكور ({presentMales}) | إناث ({presentFemales}) | المجموع: {presentMales + presentFemales}</div>
                            <div>❌ الغائبون: ذكور ({absentMales}) | إناث ({absentFemales}) | المجموع: {absentMales + absentFemales}</div>
                          </div>

                          {/* جدول الحاضرين مع زر الحذف */}
                          <div className="border p-2 rounded-lg bg-white space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-800">أعضاء اللجنة الحاضرون التدريب:</span>
                              <div className="flex gap-1">
                                <Button onClick={() => setPresentMembers([...presentMembers, { id: Date.now(), name: "", gender: "ذكر", role: "عضو", phone1: "", notes: "" }])} size="sm" variant="outline" className="text-[10px] h-6 bg-blue-50 text-blue-900">+ إضافة عضو</Button>
                                {presentMembers.length > 0 && (
                                  <Button onClick={() => setPresentMembers(presentMembers.slice(0, -1))} size="sm" variant="outline" className="text-[10px] h-6 bg-rose-50 text-rose-800 border-rose-200">🗑️ حذف سطر</Button>
                                )}
                              </div>
                            </div>
                            <div className="overflow-x-auto">
                              <datalist id="committee-member-roles">
                                <option value="رئيس اللجنة" />
                                <option value="منسق العزلة" />
                                <option value="عضو" />
                                <option value="رئيس لجنة الرقابة" />
                                <option value="محاسب" />
                                <option value="عضو رقابة" />
                                <option value="مدير مدرسة" />
                                <option value="رئيس مجلس الآباء" />
                                <option value="عضو مجلس الآباء" />
                                <option value="أخرى" />
                              </datalist>
                              <table className="w-full text-right text-[11px]">
                                <thead className="bg-slate-100 border-b">
                                  <tr>
                                    <th className="p-1 border-l">#</th>
                                    <th className="p-1 border-l">الاسم</th>
                                    <th className="p-1 border-l">الجنس</th>
                                    <th className="p-1 border-l">الصفة</th>
                                    <th className="p-1 border-l">الهاتف</th>
                                    <th className="p-1 border-l">هاتف آخر</th>
                                    <th className="p-1 border-l">ملاحظات</th>
                                    <th className="p-1 text-center">حذف</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {presentMembers.map((m, idx) => (
                                    <tr key={m.id} className="border-b">
                                      <td className="p-1 border-l font-bold text-center">{idx + 1}</td>
                                      <td className="p-1 border-l"><Input value={m.name} onChange={(e) => { const u = [...presentMembers]; u[idx].name = e.target.value; setPresentMembers(u); }} className="h-6 text-[11px]" /></td>
                                      <td className="p-1 border-l">
                                        <select value={m.gender} onChange={(e) => { const u = [...presentMembers]; u[idx].gender = e.target.value as any; setPresentMembers(u); }} className="h-6 border rounded p-0.5 bg-white text-[11px]">
                                          <option value="ذكر">ذكر</option>
                                          <option value="أنثى">أنثى</option>
                                        </select>
                                      </td>
                                      <td className="p-1 border-l"><Input list="committee-member-roles" value={m.role} onChange={(e) => { const u = [...presentMembers]; u[idx].role = e.target.value; setPresentMembers(u); }} className="h-6 text-[11px]" /></td>
                                      <td className="p-1 border-l"><Input value={m.phone1} onChange={(e) => { const u = [...presentMembers]; u[idx].phone1 = e.target.value; setPresentMembers(u); }} className="h-6 text-[11px] font-mono" /></td>
                                      <td className="p-1 border-l"><Input value={m.phone2 || ""} onChange={(e) => { const u = [...presentMembers]; u[idx].phone2 = e.target.value; setPresentMembers(u); }} className="h-6 text-[11px] font-mono" /></td>
                                      <td className="p-1 border-l"><Input value={m.notes} onChange={(e) => { const u = [...presentMembers]; u[idx].notes = e.target.value; setPresentMembers(u); }} className="h-6 text-[11px]" /></td>
                                      <td className="p-1 text-center">
                                        <Button onClick={() => setPresentMembers(presentMembers.filter((_, i) => i !== idx))} size="sm" variant="ghost" className="h-6 w-6 p-0 text-rose-600 hover:bg-rose-50">✕</Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* جدول الغائبين مع زر الحذف */}
                          <div className="border p-2 rounded-lg bg-white space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-rose-800">أعضاء اللجنة الغائبون عن التدريب:</span>
                              <div className="flex gap-1">
                                <Button onClick={() => setAbsentMembers([...absentMembers, { id: Date.now(), name: "", gender: "ذكر", role: "عضو", phone1: "", absenceReason: "", notes: "" }])} size="sm" variant="outline" className="text-[10px] h-6 bg-rose-50 text-rose-900">+ إضافة غائب</Button>
                                {absentMembers.length > 0 && (
                                  <Button onClick={() => setAbsentMembers(absentMembers.slice(0, -1))} size="sm" variant="outline" className="text-[10px] h-6 bg-rose-100 text-rose-900 border-rose-300">🗑️ حذف سطر</Button>
                                )}
                              </div>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-right text-[11px]">
                                <thead className="bg-rose-50 border-b text-rose-900">
                                  <tr>
                                    <th className="p-1 border-l">#</th>
                                    <th className="p-1 border-l">الاسم</th>
                                    <th className="p-1 border-l">الجنس</th>
                                    <th className="p-1 border-l">الصفة</th>
                                    <th className="p-1 border-l">الهاتف</th>
                                    <th className="p-1 border-l">هاتف آخر</th>
                                    <th className="p-1 border-l text-rose-800">سبب الغياب *</th>
                                    <th className="p-1 border-l">ملاحظات</th>
                                    <th className="p-1 text-center">حذف</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {absentMembers.map((m, idx) => (
                                    <tr key={m.id} className="border-b">
                                      <td className="p-1 border-l font-bold text-center">{idx + 1}</td>
                                      <td className="p-1 border-l"><Input value={m.name} onChange={(e) => { const u = [...absentMembers]; u[idx].name = e.target.value; setAbsentMembers(u); }} className="h-6 text-[11px]" /></td>
                                      <td className="p-1 border-l">
                                        <select value={m.gender} onChange={(e) => { const u = [...absentMembers]; u[idx].gender = e.target.value as any; setAbsentMembers(u); }} className="h-6 border rounded p-0.5 bg-white text-[11px]">
                                          <option value="ذكر">ذكر</option>
                                          <option value="أنثى">أنثى</option>
                                        </select>
                                      </td>
                                      <td className="p-1 border-l"><Input list="committee-member-roles" value={m.role} onChange={(e) => { const u = [...absentMembers]; u[idx].role = e.target.value; setAbsentMembers(u); }} className="h-6 text-[11px]" /></td>
                                      <td className="p-1 border-l"><Input value={m.phone1} onChange={(e) => { const u = [...absentMembers]; u[idx].phone1 = e.target.value; setAbsentMembers(u); }} className="h-6 text-[11px] font-mono" /></td>
                                      <td className="p-1 border-l"><Input value={m.phone2 || ""} onChange={(e) => { const u = [...absentMembers]; u[idx].phone2 = e.target.value; setAbsentMembers(u); }} className="h-6 text-[11px] font-mono" /></td>
                                      <td className="p-1 border-l"><Input value={m.absenceReason} onChange={(e) => { const u = [...absentMembers]; u[idx].absenceReason = e.target.value; setAbsentMembers(u); }} placeholder="السبب..." className="h-6 text-[11px] bg-rose-50" /></td>
                                      <td className="p-1 border-l"><Input value={m.notes} onChange={(e) => { const u = [...absentMembers]; u[idx].notes = e.target.value; setAbsentMembers(u); }} className="h-6 text-[11px]" /></td>
                                      <td className="p-1 text-center">
                                        <Button onClick={() => setAbsentMembers(absentMembers.filter((_, i) => i !== idx))} size="sm" variant="ghost" className="h-6 w-6 p-0 text-rose-600 hover:bg-rose-50">✕</Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ملخص الحضور لفريق المشروع */}
                      <div className="rounded-lg bg-slate-900 text-white p-3 text-[11px] font-bold flex flex-wrap justify-between gap-2">
                        <span>فريق المشروع الحاضرون: ذكور ({projectTeam.filter((m) => m.attendance === "حاضر" && m.gender === "ذكر").length})</span>
                        <span>إناث ({projectTeam.filter((m) => m.attendance === "حاضر" && m.gender === "أنثى").length})</span>
                        <span>الإجمالي ({projectTeam.filter((m) => m.attendance === "حاضر").length})</span>
                      </div>

                      {/* فريق المشروع مع زر الحذف */}
                      <div className="border p-3 rounded-lg bg-white space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">فريق المشروع الميداني (استشاري، فني مقيم، مجتمعي):</span>
                          <div className="flex gap-1">
                            <Button onClick={() => setProjectTeam([...projectTeam, { id: Date.now(), name: "", role: "فني مقيم", gender: "ذكر", phone: "", attendance: "حاضر", notes: "" }])} size="sm" variant="outline" className="text-[10px] h-6 bg-slate-50 text-slate-900">+ إضافة عضو للفريق</Button>
                            {projectTeam.length > 0 && (
                              <Button onClick={() => setProjectTeam(projectTeam.slice(0, -1))} size="sm" variant="outline" className="text-[10px] h-6 bg-rose-50 text-rose-800 border-rose-200">🗑️ حذف سطر</Button>
                            )}
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-right text-[11px]">
                            <thead className="bg-slate-100 border-b">
                              <tr>
                                <th className="p-1 border-l">#</th>
                                <th className="p-1 border-l">الاسم</th>
                                <th className="p-1 border-l">الصفة</th>
                                <th className="p-1 border-l">الجنس</th>
                                <th className="p-1 border-l">الهاتف</th>
                                <th className="p-1 border-l">حضور التدريب</th>
                                <th className="p-1 border-l">سبب الغياب</th>
                                <th className="p-1 border-l">ملاحظات</th>
                                <th className="p-1 text-center">حذف</th>
                              </tr>
                            </thead>
                            <tbody>
                              {projectTeam.map((t, idx) => (
                                <tr key={t.id} className="border-b">
                                  <td className="p-1 border-l font-bold text-center">{idx + 1}</td>
                                  <td className="p-1 border-l"><Input value={t.name} onChange={(e) => { const u = [...projectTeam]; u[idx].name = e.target.value; setProjectTeam(u); }} className="h-6 text-[11px]" /></td>
                                  <td className="p-1 border-l">
                                    <select value={t.role} onChange={(e) => { const u = [...projectTeam]; u[idx].role = e.target.value as any; setProjectTeam(u); }} className="h-6 border rounded p-0.5 bg-white text-[11px]">
                                      <option value="استشاري">استشاري</option>
                                      <option value="مهندس استشاري">مهندس استشاري</option>
                                      <option value="فني مقيم">فني مقيم</option>
                                      <option value="مجتمعي">مجتمعي</option>
                                    </select>
                                  </td>
                                  <td className="p-1 border-l">
                                    <select value={t.gender} onChange={(e) => { const u = [...projectTeam]; u[idx].gender = e.target.value as any; setProjectTeam(u); }} className="h-6 border rounded p-0.5 bg-white text-[11px]">
                                      <option value="ذكر">ذكر</option>
                                      <option value="أنثى">أنثى</option>
                                    </select>
                                  </td>
                                  <td className="p-1 border-l"><Input value={t.phone} onChange={(e) => { const u = [...projectTeam]; u[idx].phone = e.target.value; setProjectTeam(u); }} className="h-6 text-[11px] font-mono" /></td>
                                  <td className="p-1 border-l">
                                    <select value={t.attendance} onChange={(e) => { const u = [...projectTeam]; u[idx].attendance = e.target.value as any; setProjectTeam(u); }} className="h-6 border rounded p-0.5 bg-white text-[11px] font-bold">
                                      <option value="حاضر">حاضر</option>
                                      <option value="غائب">غائب</option>
                                    </select>
                                  </td>
                                  <td className="p-1 border-l"><Input value={t.absenceReason || ""} disabled={t.attendance === "حاضر"} onChange={(e) => { const u = [...projectTeam]; u[idx].absenceReason = e.target.value; setProjectTeam(u); }} className="h-6 text-[11px] bg-slate-50" /></td>
                                  <td className="p-1 border-l"><Input value={t.notes || ""} onChange={(e) => { const u = [...projectTeam]; u[idx].notes = e.target.value; setProjectTeam(u); }} className="h-6 text-[11px]" /></td>
                                  <td className="p-1 text-center">
                                    <Button onClick={() => setProjectTeam(projectTeam.filter((_, i) => i !== idx))} size="sm" variant="ghost" className="h-6 w-6 p-0 text-rose-600 hover:bg-rose-50">✕</Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* توعية المستفيدين */}
              <Card className="border bg-white shadow-sm">
                <CardHeader className="bg-slate-50 border-b py-2.5">
                  <CardTitle className="text-xs font-bold text-slate-900">توعية المستفيدين</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">إضافة أسطر متعددة لتغطية أيام التوعية:</span>
                      <div className="flex gap-1">
                        <Button onClick={() => setRepeatedSessions([...repeatedSessions, { id: Date.now(), date: "", place: "", description: "", males: 0, females: 0 }])} size="sm" variant="outline" className="text-[11px] h-7 bg-emerald-50 text-emerald-800">+ إضافة يوم</Button>
                        {repeatedSessions.length > 0 && (
                          <Button onClick={() => setRepeatedSessions(repeatedSessions.slice(0, -1))} size="sm" variant="outline" className="text-[11px] h-7 bg-rose-50 text-rose-800 border-rose-200">🗑️ حذف سطر</Button>
                        )}
                      </div>
                    </div>
                    <div className="overflow-x-auto border rounded-lg bg-white">
                      <table className="w-full text-right text-[11px]">
                        <thead className="bg-slate-100 border-b">
                          <tr>
                            <th className="p-1.5 border-l">تاريخ التوعية</th>
                            <th className="p-1.5 border-l">المكان</th>
                            <th className="p-1.5 border-l">وصف النشاط</th>
                            <th className="p-1.5 border-l">الذكور</th>
                            <th className="p-1.5 border-l">الإناث</th>
                            <th className="p-1.5 border-l">الإجمالي</th>
                            <th className="p-1.5 text-center">حذف</th>
                          </tr>
                        </thead>
                        <tbody>
                          {repeatedSessions.map((s, idx) => (
                            <tr key={s.id} className="border-b">
                              <td className="p-1 border-l"><Input type="date" value={s.date} onChange={(e) => { const u = [...repeatedSessions]; u[idx].date = e.target.value; setRepeatedSessions(u); }} className="h-6 text-[11px]" /></td>
                              <td className="p-1 border-l"><Input value={s.place} onChange={(e) => { const u = [...repeatedSessions]; u[idx].place = e.target.value; setRepeatedSessions(u); }} className="h-6 text-[11px]" /></td>
                              <td className="p-1 border-l"><Input value={s.description} onChange={(e) => { const u = [...repeatedSessions]; u[idx].description = e.target.value; setRepeatedSessions(u); }} className="h-6 text-[11px]" /></td>
                              <td className="p-1 border-l"><Input type="number" value={s.males} onChange={(e) => { const u = [...repeatedSessions]; u[idx].males = Number(e.target.value); setRepeatedSessions(u); }} className="h-6 text-[11px] w-14" /></td>
                              <td className="p-1 border-l"><Input type="number" value={s.females} onChange={(e) => { const u = [...repeatedSessions]; u[idx].females = Number(e.target.value); setRepeatedSessions(u); }} className="h-6 text-[11px] w-14" /></td>
                              <td className="p-1 border-l font-bold font-mono text-center">{s.males + s.females}</td>
                              <td className="p-1 text-center">
                                <Button onClick={() => setRepeatedSessions(repeatedSessions.filter((_, i) => i !== idx))} size="sm" variant="ghost" className="h-6 w-6 p-0 text-rose-600 hover:bg-rose-50">✕</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border">
                    <div>
                      <label className="block font-semibold mb-1">عدد الذكور</label>
                      <Input value={totalCalculatedMales} disabled className="h-8 bg-slate-200 font-bold" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">عدد الإناث</label>
                      <Input value={totalCalculatedFemales} disabled className="h-8 bg-slate-200 font-bold" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">إجمالي المستفيدين (تلقائي)</label>
                      <Input value={totalBeneficiaries} disabled className="h-8 bg-emerald-100 text-emerald-900 font-bold font-mono" />
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                    <span className="font-bold text-emerald-900">📷 إدراج صور التوعية للمستفيدين:</span>
                    <Input type="file" accept="image/*" multiple className="text-[11px] w-64 bg-white" />
                  </div>
                </CardContent>
              </Card>

              {/* توزيع البروشورات وتعليق الملصقات */}
              <Card className="border bg-white shadow-sm">
                <CardHeader className="bg-slate-50 border-b py-2.5">
                  <CardTitle className="text-xs font-bold text-slate-900">توزيع البروشورات وتعليق الملصقات</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">البروشورات التوعوية:</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input type="number" value={brochuresCount} onChange={(e) => setBrochuresCount(Number(e.target.value))} placeholder="العدد" className="h-8" />
                        <Input value={brochuresTarget} onChange={(e) => setBrochuresTarget(e.target.value)} placeholder="الفئة المستهدفة" className="h-8" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">الملصقات التوعوية:</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input type="number" value={postersCount} onChange={(e) => setPostersCount(Number(e.target.value))} placeholder="العدد" className="h-8" />
                        <Input value={postersLocation} onChange={(e) => setPostersLocation(e.target.value)} placeholder="موقع التعليق" className="h-8" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
                    <span className="font-bold text-purple-900">📸 إرفاق صور تعليق الملصقات وتوزيع البروشورات:</span>
                    <Input type="file" accept="image/*" multiple className="text-[11px] w-64 bg-white" />
                  </div>
                </CardContent>
              </Card>

              {/* صناديق الشكاوى واللوحة ودفتر المحاضر (للمشاريع الميدانية فقط) */}
              {projectType === "ميداني" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card className="border bg-white shadow-sm">
                      <CardHeader className="bg-slate-50 border-b py-2.5">
                        <CardTitle className="text-xs font-bold text-slate-900">تعليق صندوق الشكاوى</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 space-y-2">
                        <div>
                          <label className="block font-semibold mb-1">هل تم تعليق الصندوق؟ *</label>
                          <select value={hasBox} onChange={(e) => setHasBox(e.target.value as any)} className="w-full h-8 border rounded p-1 bg-white font-bold">
                            <option value="نعم">نعم</option>
                            <option value="لا">لا</option>
                          </select>
                        </div>
                        {hasBox === "لا" ? (
                          <div>
                            <label className="block font-semibold mb-1 text-rose-800">سبب عدم تعليق الصندوق *</label>
                            <Input value={noBoxReason} onChange={(e) => setNoBoxReason(e.target.value)} placeholder="اكتب السبب..." className="h-8 bg-rose-50" />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] text-slate-600 mb-0.5">عدد الصناديق</label>
                                <Input type="number" value={boxCount} onChange={(e) => setBoxCount(Number(e.target.value))} className="h-8" />
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-600 mb-0.5">رقم الصندوق (إن وجد)</label>
                                <Input value={boxNumber} onChange={(e) => setBoxNumber(e.target.value)} className="h-8" />
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-600 mb-0.5">تاريخ تعليق الصندوق</label>
                                <Input type="date" value={boxHangDate} onChange={(e) => setBoxHangDate(e.target.value)} className="h-8" />
                              </div>
                            </div>
                            <Input value={boxLocation} onChange={(e) => setBoxLocation(e.target.value)} placeholder="موقع تعليق الصندوق" className="h-8" />
                            <Input value={boxChoiceReason} onChange={(e) => setBoxChoiceReason(e.target.value)} placeholder="سبب اختيار مكان التعليق" className="h-8" />
                            <Input value={boxChooserName} onChange={(e) => setBoxChooserName(e.target.value)} placeholder="الشخص الذي قام باختيار مكان الصندوق" className="h-8" />
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border bg-white shadow-sm">
                      <CardHeader className="bg-slate-50 border-b py-2.5">
                        <CardTitle className="text-xs font-bold text-slate-900">تعليق اللوحة الإرشادية</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 space-y-2">
                        <div>
                          <label className="block font-semibold mb-1">هل تم تعليق اللوحة الإرشادية؟ *</label>
                          <select value={hasBoard} onChange={(e) => setHasBoard(e.target.value as any)} className="w-full h-8 border rounded p-1 bg-white font-bold">
                            <option value="نعم">نعم</option>
                            <option value="لا">لا</option>
                          </select>
                        </div>
                        {hasBoard === "لا" ? (
                          <div>
                            <label className="block font-semibold mb-1 text-rose-800">سبب عدم تعليق اللوحة الإرشادية *</label>
                            <Input value={noBoardReason} onChange={(e) => setNoBoardReason(e.target.value)} placeholder="اكتب السبب..." className="h-8 bg-rose-50" />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div>
                              <label className="block font-semibold mb-1">عدد اللوحات المعلقة *</label>
                              <Input type="number" min="0" value={boardCount} onChange={(e) => setBoardCount(Number(e.target.value))} className="h-8" />
                            </div>
                            <div>
                              <label className="block font-semibold mb-1">مكان تعليق اللوحة *</label>
                              <Input value={boardLocation} onChange={(e) => setBoardLocation(e.target.value)} className="h-8" />
                            </div>
                            <div>
                              <label className="block font-semibold mb-1">سبب اختيار المكان *</label>
                              <Textarea rows={2} value={boardReason} onChange={(e) => setBoardReason(e.target.value)} placeholder="توضيح سبب اختيار المكان..." className="text-xs" />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                    <span className="font-bold text-amber-900">📸 صور تعليق صندوق الشكاوى واللوحة الإرشادية:</span>
                    <Input type="file" accept="image/*" multiple className="text-[11px] w-64 bg-white" />
                  </div>

                  {/* تسليم دفتر المحاضر */}
                  <Card className="border border-emerald-200 bg-emerald-50/10 shadow-sm">
                    <CardHeader className="bg-emerald-100/50 border-b border-emerald-200 py-2.5">
                      <CardTitle className="text-xs font-bold text-emerald-900">تسليم دفتر المحاضر</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 space-y-3">
                      <div>
                        <label className="block font-semibold mb-1">هل تم تسليم دفتر المحاضر؟ *</label>
                        <select value={hasMinutesBook} onChange={(e) => setHasMinutesBook(e.target.value as any)} className="w-full h-8 border rounded p-1 bg-white font-bold">
                          <option value="نعم">نعم</option>
                          <option value="لا">لا</option>
                        </select>
                      </div>

                      {hasMinutesBook === "لا" ? (
                        <div>
                          <label className="block font-semibold mb-1 text-rose-800">سبب عدم تسليم دفتر المحاضر *</label>
                          <Input value={noMinutesBookReason} onChange={(e) => setNoMinutesBookReason(e.target.value)} placeholder="اكتب السبب..." className="h-8 bg-rose-50" />
                        </div>
                      ) : (
                        <div className="space-y-2 border p-3 rounded-lg bg-white">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div>
                              <label className="block font-semibold mb-1">اسم الشخص المستلم *</label>
                              <Input value={receiverName} onChange={(e) => setReceiverName(e.target.value)} placeholder="الاسم الرباعي" className="h-8" />
                            </div>
                            <div>
                              <label className="block font-semibold mb-1">صفة الشخص *</label>
                              <Input value={receiverRole} onChange={(e) => setReceiverRole(e.target.value)} placeholder="مثال: رئيس اللجنة المجتمعية" className="h-8" />
                            </div>
                            <div>
                              <label className="block font-semibold mb-1">رقم الهاتف *</label>
                              <Input value={receiverPhone} onChange={(e) => setReceiverPhone(e.target.value)} placeholder="77XXXXXXX" className="h-8 font-mono" />
                            </div>
                          </div>
                          <div>
                            <label className="block font-semibold mb-1">ملاحظات تسليم الدفتر:</label>
                            <Input value={minutesBookNotes} onChange={(e) => setMinutesBookNotes(e.target.value)} placeholder="أية ملاحظات إضافية..." className="h-8" />
                          </div>
                        </div>
                      )}

                      <div className="p-3 bg-white border rounded-lg flex items-center justify-between">
                        <span className="font-bold text-slate-800">📸 صور أثناء تسليم دفتر المحاضر:</span>
                        <Input type="file" accept="image/*" multiple className="text-[11px] w-64 bg-white" />
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

            </div>
          )}

          {/* زر الحفظ النهائي وإرفاق استمارة/تقرير التوعية */}
          <Card className="border bg-white shadow-sm">
            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="w-full md:w-auto flex-1">
                <label className="block font-bold text-slate-800 mb-1">📎 إرفاق استمارة / تقرير التوعية (PDF / Word):</label>
                <Input type="file" accept=".pdf, .doc, .docx" className="text-xs bg-white w-full" />
              </div>
              <div className="pt-2 md:pt-6 flex gap-2">
                <Button onClick={() => setCurrentView("dashboard")} variant="outline" className="text-xs">
                  إلغاء
                </Button>
                <Button onClick={handleFinalSave} className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-8 py-2.5 text-xs rounded-xl shadow-md">
                  حفظ التقرير الميداني (محلياً) ✓
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
  )
}
