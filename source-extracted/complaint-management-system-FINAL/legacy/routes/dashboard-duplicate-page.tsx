"use client"

import React from "react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { operations } = useStore()

  const totalOps = operations.length || 29
  const closedCount = operations.filter(o => o.status === "مغلقة").length || 8
  const inProgressCount = operations.filter(o => o.status === "قيد المعالجة").length || 7

  return (
    <div className="space-y-6 dir-rtl text-right font-sans pb-10">
      {/* رأس لوحة التحكم */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-slate-900">النظام</h1>
          <p className="text-xs text-slate-500 mt-1">نظرة عامة على جميع الفروع والعمليات المدخلة في نظام الشكاوى والبلاغات</p>
        </div>
        <Link href="/operations/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md">
            + إدخال عملية جديدة
          </Button>
        </Link>
      </div>

      {/* بطاقات المؤشرات الإحصائية */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 font-bold">إجمالي العمليات</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{totalOps}</h3>
            </div>
            <span className="text-2xl p-2.5 bg-blue-50 text-blue-600 rounded-xl">📊</span>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 font-bold">العمليات المغلقة</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{closedCount}</h3>
              <span className="text-[10px] text-emerald-600 font-bold">نسبة الإغلاق 36%</span>
            </div>
            <span className="text-2xl p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">🔒</span>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 font-bold">قيد المعالجة</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">{inProgressCount}</h3>
            </div>
            <span className="text-2xl p-2.5 bg-amber-50 text-amber-600 rounded-xl">⏳</span>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 font-bold">شكاوى عالية الحساسية</p>
              <h3 className="text-2xl font-black text-red-600 mt-1">1</h3>
            </div>
            <span className="text-2xl p-2.5 bg-red-50 text-red-600 rounded-xl">⚠️</span>
          </CardContent>
        </Card>
      </div>

      {/* قسم الرسوم والأساليب البيانية والأعمدة والدوائر */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader className="border-b bg-slate-50 py-3">
            <CardTitle className="text-xs font-bold text-slate-800">📈 توزيع العمليات حسب النوع (أعمدة بيانية)</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>شكاوى (60%)</span>
                <span>18 عملية</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>بلاغات (25%)</span>
                <span>7 عمليات</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>استعلامات ومقترحات (15%)</span>
                <span>4 عمليات</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader className="border-b bg-slate-50 py-3">
            <CardTitle className="text-xs font-bold text-slate-800">📊 توزيع العمليات حسب الحالة والتوثيق (دوائر بيانية)</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex items-center justify-around">
            <div className="text-center space-y-2">
              <div className="w-24 h-24 rounded-full border-8 border-emerald-500 flex items-center justify-center font-black text-lg text-emerald-700 bg-emerald-50 shadow-inner">
                36%
              </div>
              <span className="text-xs font-bold text-slate-700 block">عمليات مغلقة</span>
            </div>
            <div className="text-center space-y-2">
              <div className="w-24 h-24 rounded-full border-8 border-amber-500 flex items-center justify-center font-black text-lg text-amber-700 bg-amber-50 shadow-inner">
                50%
              </div>
              <span className="text-xs font-bold text-slate-700 block">قيد المعالجة</span>
            </div>
            <div className="text-center space-y-2">
              <div className="w-24 h-24 rounded-full border-8 border-blue-500 flex items-center justify-center font-black text-lg text-blue-700 bg-blue-50 shadow-inner">
                14%
              </div>
              <span className="text-xs font-bold text-slate-700 block">جديدة / مستلمة</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}