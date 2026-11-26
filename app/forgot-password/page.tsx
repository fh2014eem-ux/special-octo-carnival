"use client"

import { useState } from "react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)
    try {
      const result = await authClient.requestPasswordReset({
        email: email.trim(),
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (result.error) {
        setError("تعذر إرسال رسالة الاستعادة. تحقق من البريد وحاول مرة أخرى.")
      } else {
        setMessage("إذا كان البريد مرتبطاً بحساب نشط، فستصلك رسالة تحتوي على رابط إعادة التعيين. تحقق أيضاً من مجلد الرسائل غير المرغوب فيها.")
      }
    } catch {
      setError("تعذر الاتصال بالخادم. حاول مرة أخرى لاحقاً.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-gradient-to-b from-secondary to-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle>نسيت كلمة المرور؟</CardTitle>
          <CardDescription>أدخل البريد الإلكتروني المسجل في حسابك لإرسال رابط آمن لإعادة تعيين كلمة المرور.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            {error && <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
            {message && <p role="status" className="rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">{message}</p>}
            <Button type="submit" className="w-full" disabled={loading || !email}>{loading ? "جارٍ الإرسال..." : "إرسال رابط الاستعادة"}</Button>
            <Link href="/" className="text-center text-sm text-muted-foreground underline">العودة إلى تسجيل الدخول</Link>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
