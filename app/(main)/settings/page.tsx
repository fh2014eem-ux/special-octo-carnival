"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  const [projectFile, setProjectFile] = useState<File | null>(null)
  const [locationFile, setLocationFile] = useState<File | null>(null)
  const [categoryFile, setCategoryFile] = useState<File | null>(null)

  const handleUpload = (type: string, file: File | null) => {
    if (!file) {
      toast.error(`يرجى اختيار ملف ${type} أولاً.`)
      return
    }
    toast.info(`تم اختيار ملف (${file.name}). لم يتم تحديث قاعدة البيانات بعد؛ يلزم ربط خدمة الاستيراد والتحقق من أعمدة الملف قبل اعتماد التحديث.`)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 dir-rtl text-right font-sans">
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h1 className="text-xl font-black text-slate-900">إعدادات النظام وتحديث قواعد البيانات</h1>
        <p className="text-xs text-slate-500 mt-1">إدارة مصادر البيانات المرجعية. يجب التحقق من بنية الملف ومراجعة النتائج قبل اعتماد أي تحديث</p>
      </div>

      <div className="space-y-4">
        {/* تحديث المشاريع */}
        <Card className="bg-white border">
          <CardHeader className="bg-slate-50 border-b py-3">
            <CardTitle className="text-xs font-bold">📁 تحديث بيانات المشاريع (المشاريع.xlsx)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <input type="file" accept=".xlsx, .csv" onChange={(e) => setProjectFile(e.target.files?.[0] || null)} className="w-full text-xs" />
            <Button onClick={() => handleUpload("المشاريع", projectFile)} className="bg-blue-900 text-white font-bold">
              فحص ملف المشاريع وتجهيزه للاستيراد
            </Button>
          </CardContent>
        </Card>

        {/* تحديث المواقع */}
        <Card className="bg-white border">
          <CardHeader className="bg-slate-50 border-b py-3">
            <CardTitle className="text-xs font-bold">🗺️ تحديث بيانات المواقع (المواقع.xlsx)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <input type="file" accept=".xlsx, .csv" onChange={(e) => setLocationFile(e.target.files?.[0] || null)} className="w-full text-xs" />
            <Button onClick={() => handleUpload("المواقع", locationFile)} className="bg-blue-900 text-white font-bold">
              فحص ملف المواقع وتجهيزه للاستيراد
            </Button>
          </CardContent>
        </Card>

        {/* تحديث التصنيفات */}
        <Card className="bg-white border">
          <CardHeader className="bg-slate-50 border-b py-3">
            <CardTitle className="text-xs font-bold">🏷️ تحديث التصنيفات (التصنيفات.xlsx)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <input type="file" accept=".xlsx, .csv" onChange={(e) => setCategoryFile(e.target.files?.[0] || null)} className="w-full text-xs" />
            <Button onClick={() => handleUpload("التصنيفات", categoryFile)} className="bg-blue-900 text-white font-bold">
              فحص ملف التصنيفات وتجهيزه للاستيراد
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}