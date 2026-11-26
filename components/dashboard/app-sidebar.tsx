"use client"

import {
  LayoutDashboard,
  MessageSquareWarning,
  Megaphone,
  PackageOpen,
  Boxes,
  Clock,
  Settings,
  ShieldCheck,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export type SectionKey =
  | "dashboard"
  | "complaints"
  | "field"
  | "boxes"
  | "inventory"
  | "sla"
  | "settings"

const navItems: {
  key: SectionKey
  title: string
  icon: React.ComponentType
  badge?: string
}[] = [
  { key: "dashboard", title: "لوحة التحكم والتحليلات", icon: LayoutDashboard },
  {
    key: "complaints",
    title: "إدارة الشكاوى والبلاغات",
    icon: MessageSquareWarning,
    badge: "5",
  },
  { key: "field", title: "الإدارة الميدانية والتوعية", icon: Megaphone },
  { key: "boxes", title: "صناديق الشكاوى ومحاضر الفتح", icon: PackageOpen },
  { key: "inventory", title: "إدارة المخزون", icon: Boxes, badge: "2" },
  { key: "sla", title: "مراقبة التأخير والتنبيهات", icon: Clock },
  { key: "settings", title: "الإعدادات والصلاحيات", icon: Settings },
]

export function AppSidebar({
  active,
  onChange,
}: {
  active: SectionKey
  onChange: (key: SectionKey) => void
}) {
  return (
    <Sidebar side="right" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold leading-tight">
              نظام الشكاوى
            </span>
            <span className="text-xs text-muted-foreground leading-tight">
              الإدارة والمتابعة الميدانية
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={active === item.key}
                    tooltip={item.title}
                    onClick={() => onChange(item.key)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge ? (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="size-8">
            <AvatarFallback>مش</AvatarFallback>
          </Avatar>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium leading-tight">
              المشرف العام
            </span>
            <span className="text-xs text-muted-foreground leading-tight">
              admin@complaints.org
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
