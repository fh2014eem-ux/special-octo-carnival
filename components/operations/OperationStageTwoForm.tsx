"use client"

import React, { useState } from "react"

interface OperationStageTwoFormProps {
  onNext?: (data: any) => void
  onBack?: () => void
}

export function OperationStageTwoForm({ onNext, onBack }: OperationStageTwoFormProps) {
  const [formData, setFormData] = useState({
    sensitivity: "عادية",
    category: "اداري",
    project: "",
    files: null as FileList | null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onNext) {
      onNext(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 dir-rtl text-right">
      {/* 1. درجة الحساسية والتصنيف */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            درجة الحساسية <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.sensitivity}
            onChange={(e) => setFormData({ ...formData, sensitivity: e.target.value })}
            className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="عادية">عادية</option>
            <option value="متوسطة">متوسطة</option>
            <option value="عالية">عالية الحساسية</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            التصنيف الرئيسي <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="اداري">إداري</option>
            <option value="مالي">مالي</option>
            <option value="ميداني">ميداني / فني</option>
            <option value="سلوكي">سلوكي</option>
          </select>
        </div>
      </div>

      {/* 2. تفعيل رفع المرفقات بدلاً من المربع النصي التنبيهي */}
      <div className="space-y-2 border-2 border-dashed border-gray-300 p-5 rounded-lg bg-gray-50">
        <label className="block text-sm font-medium text-gray-700">المرفقات والوثائق</label>
        <input
          type="file"
          multiple
          className="w-full text-sm text-gray-500 file:ml-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          onChange={(e) => setFormData({ ...formData, files: e.target.files })}
        />
        <span className="text-xs text-gray-500 block mt-1">
          يمكنك أرفاق المستندات أو الصور الداعمة للعملية (PDF, PNG, JPG).
        </span>
      </div>

      {/* أزرار التنقل */}
      <div className="flex justify-between items-center pt-4 border-t">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 text-sm font-medium"
          >
            السابق
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
        >
          التالي / حفظ العملية
        </button>
      </div>
    </form>
  )
}