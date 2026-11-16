import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  ClipboardList,
  FilePlus2,
  BarChart3,
  MapPin,
  Inbox,
  Microscope,
  ListChecks,
  Boxes,
  Users,
  Settings,
  BellRing,
} from "lucide-react"

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  adminOnly?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/operations/new", label: "إدخال عملية", icon: FilePlus2 },
  { href: "/operations", label: "سجل العمليات", icon: ClipboardList },
  { href: "/reports", label: "الإحصائيات والتقارير", icon: BarChart3 },
  { href: "/field-activities", label: "الإدارة الميدانية والتوعية", icon: MapPin },
  { href: "/complaint-boxes", label: "صناديق الشكاوى ومحاضر الفتح", icon: Inbox },
  { href: "/corrective-actions", label: "التحليل والإجراءات التصحيحية", icon: Microscope },
  { href: "/monitoring", label: "إدارة المتابعة والتقييم", icon: ListChecks },
  { href: "/inventory", label: "إدارة المخزون والطلبات", icon: Boxes },
  { href: "/alerts", label: "التنبيهات والتأخير", icon: BellRing },
  { href: "/users", label: "إدارة المستخدمين والصلاحيات", icon: Users, adminOnly: true },
  { href: "/settings", label: "إعدادات النظام والبيانات المرجعية", icon: Settings, adminOnly: true },
]
