"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// الأصناف الثابتة المعرفة تشغيلياً
const CATEGORY_OPTIONS = [
  "ملصقات",
  "بروشورات",
  "صناديق شكاوى",
  "دفاتر فتح محاضر الشكاوى",
  "لوحات إرشادية",
  "أخرى",
]

export default function InventoryPage() {
  const [items, setItems] = useState([
    { id: 1, name: "ملصقات", supplied: 1000, distributed: 850, unit: "ملصق" },
    { id: 2, name: "بروشورات", supplied: 5000, distributed: 3200, unit: "نسخة" },
    { id: 3, name: "صناديق شكاوى", supplied: 50, distributed: 42, unit: "صندوق" },
    { id: 4, name: "دفاتر فتح محاضر الشكاوى", supplied: 100, distributed: 65, unit: "دفتر" },
    { id: 5, name: "لوحات إرشادية", supplied: 120, distributed: 90, unit: "لوحة" },
  ])

  // حالة نموذج توريد أصناف جديدة
  const [selectedSupplyCategory, setSelectedSupplyCategory] = useState("")
  const [customSupplyItemName, setCustomSupplyItemName] = useState("")
  const [suppliedQty, setSuppliedQty] = useState<number | "">("")

  // حالة نموذج طلب أصناف للمشاريع والأفرع
  const [selectedOrderCategory, setSelectedOrderCategory] = useState("")
  const [orderQty, setOrderQty] = useState<number | "">("")
  const [targetProject, setTargetProject] = useState("")
  const [recipientOfficer, setRecipientOfficer] = useState("")

  // سجل طلبات التوزيع والتحويلات
  const [ordersHistory, setOrdersHistory] = useState([
    { id: 1, item: "صناديق شكاوى", qty: 5, project: "800-13413 (جبل حبشي)", officer: "م. أحمد المظفري", date: "2026-10-15" }
  ])

  // إضافة توريد جديد إلى المخزون
  const handleAddSupply = () => {
    const itemName = selectedSupplyCategory === "أخرى" ? customSupplyItemName : selectedSupplyCategory
    if (!itemName || !suppliedQty || Number(suppliedQty) <= 0) {
      toast.error("يرجى اختيار الصنف وتحديد الكمية الموردة بشكل صحيح.")
      return
    }

    setItems(prevItems => {
      const existing = prevItems.find(i => i.name === itemName)
      if (existing) {
        return prevItems.map(i => i.name === itemName ? { ...i, supplied: i.supplied + Number(suppliedQty) } : i)
      } else {
        return [...prevItems, { id: Date.now(), name: itemName, supplied: Number(suppliedQty), distributed: 0, unit: "وحدة" }]
      }
    })

    setSelectedSupplyCategory("")
    setCustomSupplyItemName("")
    setSuppliedQty("")
    toast.success(`تم توريد (${suppliedQty}) من صنف [${itemName}] إلى المخزون بنجاح.`)
  }

  // تنفيذ طلب صنف وصرفه لمشروع أو فرع
  const handleCreateOrder = () => {
    if (!selectedOrderCategory || !orderQty || Number(orderQty) <= 0 || !targetProject) {
      toast.error("يرجى تحديد الصنف والكمية المرتجية والمشروع المستهدف.")
      return
    }

    const itemObj = items.find(i => i.name === selectedOrderCategory)
    const currentBalance = itemObj ? itemObj.supplied - itemObj.distributed : 0

    if (Number(orderQty) > currentBalance) {
      toast.error(`الكمية المطلوبة (${orderQty}) تتجاوز الرصيد المتاح للمخزون (${currentBalance}).`)
      return
    }

    // خصم الكمية وتحديث جدول المخزون آلياً
    setItems(prevItems =>
      prevItems.map(i => i.name === selectedOrderCategory ? { ...i, distributed: i.distributed + Number(orderQty) } : i)
    )

    // إدراج الطلب في السجل
    setOrdersHistory([
      {
        id: Date.now(),
        item: selectedOrderCategory,
        qty: Number(orderQty),
        project: targetProject,
        officer: recipientOfficer || "المستلم الميداني",
        date: new Date().toISOString().split("T")[0]
      },
      ...ordersHistory
    ])

    setSelectedOrderCategory("")
    setOrderQty("")
    setTargetProject("")
    setRecipientOfficer("")
    toast.success("تم تسجيل طلب الصرف وخصم الكمية من رصيد المخزون آلياً!")
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 dir-rtl text-right font-sans">
      <div className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-gray-900">🏷️ إدارة المخزون وطلبات المواد الميدانية والتوعوية</h1>
          <p className="text-xs text-gray-500 mt-0.5">تتبع التوريد، الأرصدة الحالية، وطلبات توزيع الملصقات والصناديق للمشاريع.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. نافذة طلب أصناف للمشاريع والأفرع */}
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50/60 py-3 border-b border-blue-100">
            <CardTitle className="text-sm font-bold text-blue-900">📋 نافذة طلب أصناف ومواد للمشاريع</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">اختر الصنف المطلوب *</label>
                <select
                  value={selectedOrderCategory}
                  onChange={(e) => setSelectedOrderCategory(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="">-- اختر الصنف --</option>
                  {CATEGORY_OPTIONS.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">الكمية المطلوبة *</label>
                <Input
                  type="number"
                  min={1}
                  value={orderQty}
                  onChange={(e) => setOrderQty(e.target.value ? Number(e.target.value) : "")}
                  placeholder="عدد الوحدات"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">المشروع / الجهة المستهدفة *</label>
                <Input
                  value={targetProject}
                  onChange={(e) => setTargetProject(e.target.value)}
                  placeholder="رقم أو اسم المشروع"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">اسم المستلم / ضابط المشروع</label>
                <Input
                  value={recipientOfficer}
                  onChange={(e) => setRecipientOfficer(e.target.value)}
                  placeholder="اسم الشخص المستلم"
                />
              </div>
            </div>

            <Button onClick={handleCreateOrder} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold pt-2">
              تأكيد طلب الصرف والتحويل الميداني
            </Button>
          </CardContent>
        </Card>

        {/* 2. نافذة إضافة وتوريد أصناف جديدة للمخزون */}
        <Card>
          <CardHeader className="bg-gray-50 py-3 border-b">
            <CardTitle className="text-sm font-bold">➕ إدخال دفعة توريد جديدة للمخزون</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">الصنف المورد *</label>
                <select
                  value={selectedSupplyCategory}
                  onChange={(e) => setSelectedSupplyCategory(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="">-- اختر الصنف --</option>
                  {CATEGORY_OPTIONS.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">الكمية الموردة *</label>
                <Input
                  type="number"
                  min={1}
                  value={suppliedQty}
                  onChange={(e) => setSuppliedQty(e.target.value ? Number(e.target.value) : "")}
                  placeholder="الكمية"
                />
              </div>
            </div>

            {selectedSupplyCategory === "أخرى" && (
              <div>
                <label className="block font-semibold mb-1">اسم الصنف الإضافي *</label>
                <Input
                  value={customSupplyItemName}
                  onChange={(e) => setCustomSupplyItemName(e.target.value)}
                  placeholder="اكتب اسم الصنف الإضافي"
                />
              </div>
            )}

            <Button onClick={handleAddSupply} variant="outline" className="w-full font-bold pt-2">
              إضافة للمخزون وتحديث الأرصدة
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 3. جدول أرصدة الأرصدة المتبقية والمصروفة آلياً */}
      <Card>
        <CardHeader className="bg-gray-50 py-3 border-b">
          <CardTitle className="text-sm font-bold">📊 جدول أرصدة الأصناف الحالية في المخزون</CardTitle>
        </CardHeader>
        <CardContent className="p-4 overflow-x-auto text-xs">
          <table className="w-full border-collapse border bg-white text-right">
            <thead>
              <tr className="bg-gray-100 border-b text-gray-700">
                <th className="p-2 border">#</th>
                <th className="p-2 border">اسم الصنف</th>
                <th className="p-2 border text-center">الكمية الموردة الكلية</th>
                <th className="p-2 border text-center">الكمية المصروفة / المطلوبة</th>
                <th className="p-2 border text-center">الرصيد المتبقي (آلياً)</th>
                <th className="p-2 border text-center">وحدة القياس</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const balance = item.supplied - item.distributed
                return (
                  <tr key={item.id} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="p-2 border text-center font-bold text-gray-500">{idx + 1}</td>
                    <td className="p-2 border font-bold text-gray-800">{item.name}</td>
                    <td className="p-2 border text-center font-mono text-blue-700 font-semibold">{item.supplied}</td>
                    <td className="p-2 border text-center font-mono text-orange-600 font-semibold">{item.distributed}</td>
                    <td className="p-2 border text-center font-mono font-bold text-emerald-700">{balance}</td>
                    <td className="p-2 border text-center text-gray-500">{item.unit}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 4. سجل عمليات الطلب والتحويل الميداني */}
      <Card>
        <CardHeader className="bg-gray-50 py-3 border-b">
          <CardTitle className="text-sm font-bold">📜 سجل الطلبات وصرف المواد للمشاريع</CardTitle>
        </CardHeader>
        <CardContent className="p-4 overflow-x-auto text-xs">
          <table className="w-full border-collapse border bg-white text-right">
            <thead>
              <tr className="bg-gray-100 border-b text-gray-700">
                <th className="p-2 border">#</th>
                <th className="p-2 border">الصنف المصروف</th>
                <th className="p-2 border text-center">الكمية المصروفة</th>
                <th className="p-2 border">المشروع المستهدف</th>
                <th className="p-2 border">اسم المستلم</th>
                <th className="p-2 border text-center">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {ordersHistory.map((order, idx) => (
                <tr key={order.id} className="border-b">
                  <td className="p-2 border text-center">{idx + 1}</td>
                  <td className="p-2 border font-bold text-gray-800">{order.item}</td>
                  <td className="p-2 border text-center font-mono font-bold text-blue-800">{order.qty}</td>
                  <td className="p-2 border text-gray-700">{order.project}</td>
                  <td className="p-2 border text-gray-600">{order.officer}</td>
                  <td className="p-2 border text-center text-gray-500 font-mono">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}