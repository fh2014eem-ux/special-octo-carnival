// إعدادات مصادر البيانات المرجعية. تُستخدم على الخادم فقط عند إضافة موصل Google المعتمد.
export const REFERENCE_SOURCE_IDS = {
  projects: "1ShVONcFSl-bqRxBdiKd-SWcfUojFrQY2",
  locations: "1ffqU0Jn5q6n9rHIxX7pLzfZO-PILQsgs",
  classifications: "1q30lsr_FakvdkImwXpdx7Ze3_HuO8mtN",
  masterTemplate: "1xyVIGoZ9AX_51yZ-A9BSZjIiJlqIIGZa",
} as const

export type ReferenceSourceType = keyof typeof REFERENCE_SOURCE_IDS

/**
 * لا يجوز اعتبار صلاحية فتح رابط Drive في المتصفح تكاملاً برمجياً.
 * يتطلب التحديث الآلي اعتماد OAuth أو حساب خدمة لديه صلاحية قراءة الملفات،
 * ثم استيراد الصفوف إلى جداول المرجع مع سجل مزامنة.
 */
export function getReferenceSourceId(type: ReferenceSourceType) {
  return REFERENCE_SOURCE_IDS[type]
}
