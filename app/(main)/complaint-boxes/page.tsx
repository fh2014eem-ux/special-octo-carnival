"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Package, FileText, ArrowLeft } from "lucide-react"

type Summary = { boxes: number; minutes: number; projectsWithBoxes: number; projectsWithoutBoxes: number }

export default function ComplaintBoxesOverview() {
  const [summary, setSummary] = useState<Summary>({ boxes: 0, minutes: 0, projectsWithBoxes: 0, projectsWithoutBoxes: 0 })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    Promise.all([
      fetch("/api/complaint-boxes", { cache: "no-store" }).then(r => r.json()),
      fetch("/api/reference/projects", { cache: "no-store" }).then(r => r.json()),
    ]).then(([boxData, projectData]) => {
      if (!active) return
      const boxes = Array.isArray(boxData.boxes) ? boxData.boxes : []
      const projects = Array.isArray(projectData.projects) ? projectData.projects : []
      const projectSet = new Set(boxes.map((box: any) => box.projectNumber))
      setSummary({ boxes: boxes.length, minutes: Array.isArray(boxData.minutes) ? boxData.minutes.length : 0, projectsWithBoxes: projectSet.size, projectsWithoutBoxes: Math.max(0, projects.length - projectSet.size) })
    }).catch(() => {}).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  const tiles = [
    { href: "/complaint-boxes/field", title: "صناديق الشكاوى الميدانية", detail: "إضافة الصناديق واستعراض بياناتها وحالاتها حسب المشروع", count: summary.boxes, icon: Package, tone: "border-blue-200 bg-blue-50 text-blue-900" },
    { href: "/complaint-boxes/minutes", title: "محاضر الفتح", detail: "إضافة المحاضر ومراجعة حركة الفتح والتسليم والتأخير", count: summary.minutes, icon: FileText, tone: "border-violet-200 bg-violet-50 text-violet-900" },
  ]
  return (
    <div dir="rtl" className="mx-auto max-w-7xl space-y-6">
      <header className="rounded-2xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-black">صناديق الشكاوى ومحاضر الفتح</h1>
        <p className="mt-2 text-sm text-muted-foreground">لوحة عامة لمتابعة الصناديق الميدانية ومحاضر فتحها في المشاريع</p>
      </header>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">المشاريع التي بها صناديق</p><p className="mt-2 text-2xl font-black">{loading ? "—" : summary.projectsWithBoxes}</p></div>
        <div className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">المشاريع دون صناديق</p><p className="mt-2 text-2xl font-black">{loading ? "—" : summary.projectsWithoutBoxes}</p></div>
        <div className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">إجمالي الصناديق</p><p className="mt-2 text-2xl font-black">{loading ? "—" : summary.boxes}</p></div>
        <div className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">إجمالي المحاضر</p><p className="mt-2 text-2xl font-black">{loading ? "—" : summary.minutes}</p></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {tiles.map(({ href, title, detail, count, icon: Icon, tone }) => (
          <Link key={href} href={href} className="group flex min-h-44 items-center gap-5 rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <span className={`flex size-16 shrink-0 items-center justify-center rounded-2xl border ${tone}`}><Icon className="size-8" /></span>
            <span className="min-w-0 flex-1"><span className="block text-lg font-black">{title}</span><span className="mt-2 block text-sm leading-6 text-muted-foreground">{detail}</span><span className="mt-3 block text-sm font-bold">السجلات: {loading ? "…" : count}</span></span>
            <ArrowLeft className="size-5 text-muted-foreground transition group-hover:-translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  )
}
