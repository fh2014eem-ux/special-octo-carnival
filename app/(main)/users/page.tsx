"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function UsersManagementPage() {
  const [users, setUsers] = useState([
    { id: 1, name: "Faheem", role: "مدير النظام (الادمن)", branch: "الإدارة العامة", active: true },
    { id: 2, name: "Taiz", role: "مدخل بيانات", branch: "فرع تعز", active: true },
    { id: 3, name: "Aden", role: "مدخل بيانات", branch: "فرع عدن", active: true },
    { id: 4, name: "Mukalla", role: "مدخل بيانات", branch: "فرع حضرموت", active: true },
    { id: 5, name: "Marib", role: "مدخل بيانات", branch: "مكتب مأرب", active: true },
  ])

  const [newUsername, setNewUsername] = useState("")
  const [newBranch, setNewBranch] = useState("فرع تعز")

  const handleAddUser = () => {
    if (!newUsername) {
      toast.error("يرجى إدخال اسم المستخدم.")
      return
    }
    setUsers([
      ...users,
      { id: Date.now(), name: newUsername, role: "مدخل بيانات", branch: newBranch, active: true }
    ])
    setNewUsername("")
    toast.success("تم إضافة المستخدم وتحديد صلاحيات نطاق الفرع بنجاح.")
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 dir-rtl text-right font-sans">
      <div className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-gray-900">👥 المحور الثامن: إدارة المستخدمين والصلاحيات والنطاق الجغرافي</h1>
          <p className="text-xs text-gray-500 mt-0.5">إدارة حسابات مدخلي البيانات، مسؤولي الفروع (تعز، عدن، حضرموت، مأرب)، وصلاحيات الوصول.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-gray-50 py-3 border-b">
          <CardTitle className="text-sm font-bold">إضافة مستخدم جديد وصلاحيات الفرع</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1">اسم المستخدم *</label>
              <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="اسم المستخدم بالإنجليزية" />
            </div>
            <div>
              <label className="block font-semibold mb-1">النطاق / الفرع *</label>
              <select value={newBranch} onChange={(e) => setNewBranch(e.target.value)} className="w-full p-2 border rounded-lg bg-white">
                <option value="فرع تعز">فرع تعز</option>
                <option value="فرع عدن">فرع عدن</option>
                <option value="فرع حضرموت">فرع حضرموت</option>
                <option value="مكتب مأرب">مكتب مأرب</option>
                <option value="الإدارة العامة">الإدارة العامة</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddUser} className="w-full">إضافة مستخدم جديد</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gray-50 py-3 border-b">
          <CardTitle className="text-sm font-bold">قائمة المستخدمين المسجلين وصلاحيات الفروع</CardTitle>
        </CardHeader>
        <CardContent className="p-4 overflow-x-auto text-xs">
          <table className="w-full border-collapse border bg-white">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2 border">#</th>
                <th className="p-2 border">اسم المستخدم</th>
                <th className="p-2 border">الدور والصلاحية</th>
                <th className="p-2 border">نطاق الفرع</th>
                <th className="p-2 border">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u.id} className="border-b">
                  <td className="p-2 border text-center">{idx + 1}</td>
                  <td className="p-2 border font-bold text-gray-800">{u.name}</td>
                  <td className="p-2 border">{u.role}</td>
                  <td className="p-2 border font-bold text-blue-700">{u.branch}</td>
                  <td className="p-2 border">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">نشط</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}