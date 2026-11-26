"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const NAV_ITEMS = [
  { name: "لوحة التحكم", href: "/", icon: "📊" },
  { name: "إدخال عملية", href: "/operations/new", icon: "📝" },
  { name: "سجل العمليات", href: "/operations", icon: "📋" },
  { name: "الإحصائيات والتقارير", href: "/reports", icon: "📈" },
  { name: "الأنشطة الميدانية", href: "/field-activities", icon: "📍" },
  { name: "صناديق الشكاوى", href: "/complaint-boxes", icon: "📦" },
  { name: "تحليل الأسباب الجذرية", href: "/corrective-actions", icon: "🔍" },
  { name: "المتابعة والتقييم", href: "/monitoring", icon: "📉" },
  { name: "المخزون والطلبات", href: "/inventory", icon: "🏷️" },
  { name: "إدارة المستخدمين", href: "/users", icon: "👥" },
  { name: "الإعدادات", href: "/settings", icon: "⚙️" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white text-slate-800 min-h-screen p-4 flex flex-col justify-between font-sans border-l border-slate-200 shadow-sm sticky top-0 h-screen overflow-y-auto">
      <div className="space-y-6">
        <div className="p-3 border-b border-slate-100 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-lg shadow-md">
            🛡️
          </div>
          <div>
            <h2 className="text-xs font-black text-slate-900 leading-tight">نظام الشكاوى والبلاغات</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">الصندوق الاجتماعي للتنمية</p>
          </div>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[#2A528BE6] text-white shadow-md shadow-blue-900/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="leading-tight">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
        <div>
          <span className="block font-bold text-slate-900">فرع تعز</span>
          <span className="text-[10px] text-blue-600">المستخدم: فهيم السامعي</span>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>
    </aside>
  )
}