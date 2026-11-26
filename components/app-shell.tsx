"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useStore } from "@/lib/store"
import { NAV_ITEMS } from "@/lib/nav"
import { LoginScreen } from "@/components/login-screen"
import { SYSTEM_NAME, OFFICIAL_NAME } from "@/lib/data/constants"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ShieldCheck, Menu, LogOut, UserCog } from "lucide-react"

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { isAdmin } = useStore()

  const items = NAV_ITEMS.filter((i) => !i.adminOnly || isAdmin)

  return (
    <nav className="flex flex-col gap-1 px-3">
      {items.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href)

        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-[1.15rem] shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

function SidebarHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
        <ShieldCheck className="size-5" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-sidebar-foreground">
          {SYSTEM_NAME}
        </p>

        <p className="truncate text-xs text-muted-foreground">
          {OFFICIAL_NAME}
        </p>
      </div>
    </div>
  )
}

function UserMenu() {
  const { currentUser, logout } = useStore()

  if (!currentUser) return null

  const initials = currentUser.username.slice(0, 2).toUpperCase()

  return (
    <div className="flex flex-col items-end gap-0.5">
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="h-auto gap-3 px-2 py-1.5">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight">
                {currentUser.username}
              </p>

              <p className="text-xs leading-tight text-muted-foreground">
                {currentUser.branch}
              </p>
            </div>
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{currentUser.username}</span>

            <span className="text-xs font-normal text-muted-foreground">
              {currentUser.role}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          render={
            <Link href="/settings" className="gap-2">
              <UserCog className="size-4" />
              الإعدادات وكلمة المرور
            </Link>
          }
        />

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={logout}
          className="gap-2 text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <Button type="button" variant="ghost" size="sm" onClick={logout} className="h-5 px-2 text-[10px] leading-none text-muted-foreground hover:text-destructive">
      <LogOut className="size-3" />
      تسجيل الخروج
    </Button>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { ready, currentUser, branchName } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!currentUser) return <LoginScreen />

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - desktop */}
      <aside className="fixed inset-y-0 right-0 z-30 hidden w-72 flex-col border-l border-sidebar-border bg-sidebar lg:flex">
        <SidebarHeader />

        <ScrollArea className="flex-1 py-4">
          <NavLinks />
        </ScrollArea>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col lg:mr-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="القائمة"
                  >
                    <Menu className="size-5" />
                  </Button>
                }
              />

              <SheetContent side="right" className="w-72 p-0">
                <SheetTitle className="sr-only">
                  القائمة الرئيسية
                </SheetTitle>

                <SidebarHeader />

                <ScrollArea className="h-[calc(100vh-4.5rem)] py-4">
                  <NavLinks onNavigate={() => setMobileOpen(false)} />
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <div>
              <p className="text-sm font-semibold sm:text-base">
                {branchName}
              </p>

              <p className="text-xs text-muted-foreground">
                مرحبًا بك في نظام الشكاوى
              </p>
            </div>
          </div>

          <UserMenu />
        </header>

        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}