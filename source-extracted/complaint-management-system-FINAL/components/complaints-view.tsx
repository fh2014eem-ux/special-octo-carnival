"use client"

import { useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { Search, PlusCircle, Loader2 } from "lucide-react"
import {
  fetcher,
  updateComplaintRequest,
  type ComplaintsResponse,
} from "@/lib/api-client"
import {
  CATEGORIES,
  STATUS_LABELS,
  STATUS_ORDER,
  type ComplaintStatus,
} from "@/lib/types"
import { PageHeader } from "@/components/page-header"
import { StatusBadge, PriorityBadge } from "@/components/badges"

export function ComplaintsView() {
  const [status, setStatus] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [q, setQ] = useState<string>("")
  const [savingId, setSavingId] = useState<string | null>(null)

  const params = new URLSearchParams()
  if (status) params.set("status", status)
  if (category) params.set("category", category)
  if (q.trim()) params.set("q", q.trim())
  const key = `/api/complaints${params.toString() ? `?${params}` : ""}`

  const { data, isLoading, mutate } = useSWR<ComplaintsResponse>(key, fetcher)
  const complaints = data?.complaints ?? []

  async function handleStatusChange(id: string, next: ComplaintStatus) {
    setSavingId(id)
    // تحديث متفائل
    await mutate(
      async () => {
        await updateComplaintRequest(id, { status: next })
        const res = await fetcher<ComplaintsResponse>(key)
        return res
      },
      {
        optimisticData: {
          complaints: complaints.map((c) =>
            c.id === id ? { ...c, status: next } : c,
          ),
        },
        rollbackOnError: true,
        revalidate: false,
      },
    )
    setSavingId(null)
  }

  const inputCls =
    "h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"

  return (
    <div>
      <PageHeader
        title="الشكاوى"
        description="استعراض وتصفية وتحديث حالة الشكاوى"
        action={
          <Link
            href="/complaints/new"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <PlusCircle className="size-4" />
            شكوى جديدة
          </Link>
        }
      />

      {/* أدوات التصفية */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="بحث بالعنوان أو الرقم المرجعي أو اسم مقدم الشكوى"
            className={`${inputCls} w-full pr-9`}
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={inputCls}
        >
          <option value="">كل الحالات</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputCls}
        >
          <option value="">كل الفئات</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* الجدول */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">الرقم المرجعي</th>
                <th className="px-4 py-3 font-medium">العنوان</th>
                <th className="px-4 py-3 font-medium">الفئة</th>
                <th className="px-4 py-3 font-medium">الأولوية</th>
                <th className="px-4 py-3 font-medium">مقدم الشكوى</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
                <th className="px-4 py-3 font-medium">تغيير الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    <Loader2 className="mx-auto size-5 animate-spin" />
                  </td>
                </tr>
              )}
              {!isLoading &&
                complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                      {c.referenceNo}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{c.title}</p>
                      {c.location && (
                        <p className="text-xs text-muted-foreground">
                          {c.location}
                        </p>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {c.category}
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {c.citizenName}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={c.status}
                          disabled={savingId === c.id}
                          onChange={(e) =>
                            handleStatusChange(
                              c.id,
                              e.target.value as ComplaintStatus,
                            )
                          }
                          className="h-8 rounded-md border border-input bg-card px-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                        >
                          {STATUS_ORDER.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                        {savingId === c.id && (
                          <Loader2 className="size-4 animate-spin text-muted-foreground" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              {!isLoading && complaints.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    لا توجد شكاوى مطابقة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
