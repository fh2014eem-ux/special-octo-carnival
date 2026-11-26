"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { OFFICIAL_NAME, SYSTEM_NAME } from "@/lib/data/constants"
import { ShieldCheck, LogIn, Eye, EyeOff } from "lucide-react"

export function LoginScreen() {
  const { login } = useStore()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await login(username, password)
      if (!res.ok) setError(res.error ?? "تعذر تسجيل الدخول.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-secondary to-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <ShieldCheck className="size-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground text-balance">{SYSTEM_NAME}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{OFFICIAL_NAME}</p>
        </div>

        <Card className="border-border/60 shadow-xl">
          <CardContent className="pt-6">
            <form onSubmit={submit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  autoComplete="username"
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    autoComplete="current-password"
                    className="pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute inset-y-0 left-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                    aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                <LogIn className="size-4" />
                {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>

          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          جميع الحقوق محفوظة &copy; {new Date().getFullYear()} {OFFICIAL_NAME}
        </p>
      </div>
    </main>
  )
}
