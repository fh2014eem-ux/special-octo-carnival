"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function ResetPasswordForm() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get("token")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    if (!token) {
      setError("رابط الاستعادة غير صالح أو انتهت صلاحيته. اطلب رابطاً جديداً.")
      return
    }
    if (password.length < 12) {
      setError("يجب أن تتكون كلمة المرور من 12 خانة على الأقل.")
      return
    }
    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين.")
      return
    }
    setLoading(true)
    try {
      const result = await authClient.resetPassword({ newPassword: password, token })
      if (result.error) {
        setError("تعذر تغيير كلمة المرور. قد يكون الرابط مستخدماً أو منتهي الصلاحية؛ اطلب رابطاً جديداً.")
      } else {
        router.replace("/?passwordReset=success")
      }
    } catch {
      setError("تعذر الاتصال بالخادم. حاول مرة أخرى.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle>تعيين كلمة مرور جديدة</CardTitle>
        <CardDescription>اختر كلمة مرور جديدة وفريدة. سيتم إنهاء الجلسات السابقة بعد نجاح التغيير.</CardDescription>
      </CardHeader>
      <CardContent>
        {!token ? (
          <div className="flex flex-col gap-4">
            <p role="alert" className="text-sm text-destructive">رابط الاستعادة غير صالح أو انتهت صلاحيته.</p>
            <Link href="/forgot-password" className="text-sm text-primary underline">طلب رابط جديد</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">كلمة المرور الجديدة</Label>
              <Input id="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm">تأكيد كلمة المرور</Label>
              <Input id="confirm" type="password" autoComplete="new-password" minLength={12} maxLength={128} value={confirm} onChange={(event) => setConfirm(event.target.value)} required />
            </div>
            {error && <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading || !password || !confirm}>{loading ? "جارٍ الحفظ..." : "حفظ كلمة المرور الجديدة"}</Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-gradient-to-b from-secondary to-background p-4">
      <Suspense fallback={<div className="text-sm text-muted-foreground">جارٍ تحميل نموذج إعادة تعيين كلمة المرور...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  )
}
