import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  FolderKanban,
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
  { href: "/operations", label: "إدارة العمليات", icon: FolderKanban },
  { href: "/reports", label: "الإحصائيات والتقارير والتصدير", icon: BarChart3 },
  { href: "/field-activities", label: "الإدارة الميدانية", icon: MapPin },
  { href: "/complaint-boxes", label: "صناديق الشكاوى ومحاضر الفتح", icon: Inbox },
  { href: "/corrective-actions", label: "التحليل والإجراءات التصحيحية", icon: Microscope },
  { href: "/monitoring", label: "إدارة المتابعة والتقييم", icon: ListChecks },
  { href: "/inventory", label: "إدارة المخزون", icon: Boxes },
  { href: "/alerts", label: "التنبيهات والتأخير", icon: BellRing },
  { href: "/users", label: "إدارة المستخدمين والصلاحيات", icon: Users, adminOnly: true },
  { href: "/settings", label: "إعدادات النظام والبيانات المرجعية", icon: Settings, adminOnly: true },
]
