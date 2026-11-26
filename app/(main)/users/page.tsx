"use client"

import React, { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ManagedUser = {
  id: string
  username: string | null
  name: string
  email: string
  role: string
  branch: string
  active: boolean
  createdAt: string
}

const BRANCHES = [
  "فرع تعز",
  "فرع عدن",
  "فرع المكلا",
  "مكتب مأرب",
  "فرع صنعاء",
  "فرع عمران",
  "فرع حجة",
  "فرع الحديدة",
  "فرع إب",
  "الإدارة العامة",
]

export default function UsersManagementPage() {
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [newUsername, setNewUsername] = useState("")
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newBranch, setNewBranch] = useState("فرع تعز")
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/users", { credentials: "same-origin", cache: "no-store" })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.message || "تعذر تحميل المستخدمين.")
      setUsers(result.users)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر تحميل المستخدمين.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void loadUsers() }, [loadUsers])

  async function handleAddUser(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ username: newUsername, name: newName, email: newEmail, password: newPassword, branch: newBranch }),
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.message || "تعذر إضافة المستخدم.")
      toast.success(result.message || "تم إنشاء المستخدم.")
      setNewUsername(""); setNewName(""); setNewEmail(""); setNewPassword("")
      await loadUsers()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر إضافة المستخدم.")
    } finally {
      setBusy(false)
    }
  }

  async function toggleUser(user: ManagedUser) {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id: user.id, active: !user.active }),
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.message || "تعذر تحديث حالة المستخدم.")
      await loadUsers()
      toast.success(user.active ? "تم إيقاف المستخدم." : "تم تفعيل المستخدم.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر تحديث المستخدم.")
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 dir-rtl text-right font-sans">
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <h1 className="text-lg font-bold text-gray-900">إدارة المستخدمين والصلاحيات ونطاق الفروع</h1>
        <p className="text-xs text-gray-500 mt-1">تُدار الحسابات في Neon عبر Better Auth، وتُطبّق صلاحيات الفرع من الخادم.</p>
      </div>

      <Card>
        <CardHeader className="bg-gray-50 py-3 border-b">
          <CardTitle className="text-sm font-bold">إضافة مستخدم جديد</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <label className="font-semibold">اسم المستخدم *
              <Input required minLength={3} maxLength={30} value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="مثال: Taiz" className="mt-1" />
            </label>
            <label className="font-semibold">الاسم الكامل *
              <Input required value={newName} onChange={e => setNewName(e.target.value)} className="mt-1" />
            </label>
            <label className="font-semibold">البريد الإلكتروني *
              <Input required type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="mt-1" />
            </label>
            <label className="font-semibold">كلمة المرور المؤقتة *
              <Input required type="password" minLength={12} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1" />
            </label>
            <label className="font-semibold">الفرع *
              <select value={newBranch} onChange={e => setNewBranch(e.target.value)} className="mt-1 w-full rounded-md border bg-white p-2.5">
                {BRANCHES.map(branch => <option key={branch} value={branch}>{branch}</option>)}
              </select>
            </label>
            <div className="flex items-end">
              <Button type="submit" disabled={busy} className="w-full">{busy ? "جارٍ الحفظ..." : "إنشاء المستخدم"}</Button>
            </div>
            <p className="md:col-span-3 text-slate-500">كلمة المرور المؤقتة لا تقل عن 12 خانة، ويُفضّل أن يغيّرها المستخدم بعد أول دخول.</p>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gray-50 py-3 border-b">
          <CardTitle className="text-sm font-bold">المستخدمون المسجلون</CardTitle>
        </CardHeader>
        <CardContent className="p-4 overflow-x-auto text-xs">
          {loading ? <p className="p-4 text-center">جارٍ تحميل المستخدمين...</p> : (
            <table className="w-full border-collapse border bg-white">
              <thead><tr className="bg-gray-100 border-b">
                <th className="p-2 border">#</th><th className="p-2 border">اسم المستخدم</th><th className="p-2 border">الاسم</th><th className="p-2 border">البريد</th><th className="p-2 border">الدور</th><th className="p-2 border">الفرع</th><th className="p-2 border">الحالة</th><th className="p-2 border">إجراء</th>
              </tr></thead>
              <tbody>
                {users.map((user, index) => <tr key={user.id} className="border-b">
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border font-bold">{user.username || "—"}</td>
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border" dir="ltr">{user.email}</td>
                  <td className="p-2 border">{user.role}</td>
                  <td className="p-2 border">{user.branch}</td>
                  <td className="p-2 border">{user.active ? "نشط" : "موقوف"}</td>
                  <td className="p-2 border"><Button size="sm" variant={user.active ? "destructive" : "default"} onClick={() => void toggleUser(user)}>{user.active ? "إيقاف" : "تفعيل"}</Button></td>
                </tr>)}
                {users.length === 0 && <tr><td colSpan={8} className="p-5 text-center text-slate-500">لا يوجد مستخدمون بعد.</td></tr>}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
