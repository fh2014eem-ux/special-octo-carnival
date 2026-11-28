"use client"

import Link from "next/link"
import { ClipboardList, FilePlus2, ArrowRight } from "lucide-react"

const actions = [
  { href: "/operations/records", title: "سجل العمليات", description: "البحث والاستعراض ومتابعة العمليات المسجلة", icon: ClipboardList, tone: "bg-blue-50 text-blue-800 border-blue-200" },
  { href: "/operations/new", title: "إدخال عملية", description: "تسجيل شكوى أو بلاغ أو طلب أو استعلام جديد", icon: FilePlus2, tone: "bg-emerald-50 text-emerald-800 border-emerald-200" },
]

export default function OperationsHomePage() {
  return (
    <div dir="rtl" className="mx-auto max-w-6xl space-y-6">
      <header className="rounded-2xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-black text-foreground">إدارة العمليات</h1>
        <p className="mt-2 text-sm text-muted-foreground">إدارة تسجيل العمليات ومراجعتها ومتابعة مراحل معالجتها</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {actions.map(({ href, title, description, icon: Icon, tone }) => (
          <Link key={href} href={href} className={`group flex min-h-44 items-center gap-5 rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}>
            <span className={`flex size-16 shrink-0 items-center justify-center rounded-2xl border ${tone}`}><Icon className="size-8" /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-lg font-black">{title}</span>
              <span className="mt-2 block text-sm leading-6 text-muted-foreground">{description}</span>
            </span>
            <ArrowRight className="size-5 rotate-180 text-muted-foreground transition group-hover:-translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  )
}
