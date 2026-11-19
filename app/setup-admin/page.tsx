"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SetupAdminPage() {
  const router = useRouter()
  const [token, setToken] = useState("")
  const [username, setUsername] = useState("Faheem")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("fh2014eem@gmail.com")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage("")
    setError(false)
    try {
      const response = await fetch("/api/admin/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-chm-bootstrap-token": token },
        body: JSON.stringify({ username, name, email, password }),
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.message || "تعذر إنشاء الحساب.")
      setMessage(result.message)
      setPassword("")
      setToken("")
      window.setTimeout(() => router.push("/"), 1600)
    } catch (e) {
      setError(true)
      setMessage(e instanceof Error ? e.message : "حدث خطأ غير متوقع.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <section className="w-full max-w-xl rounded-2xl border bg-white p-6 shadow-sm space-y-5">
        <div>
          <p className="text-xs font-bold tracking-widest text-emerald-700">CHM-SFD</p>
          <h1 className="mt-2 text-2xl font-black text-slate-900">تهيئة أول مدير للنظام</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600">إجراء لمرة واحدة لإنشاء حساب المدير الأول في قاعدة Neon. لا تشارك رمز التهيئة أو كلمة المرور مع أي شخص.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-semibold">رمز التهيئة لمرة واحدة
            <input required type="password" autoComplete="off" value={token} onChange={e => setToken(e.target.value)} className="mt-1 w-full rounded-lg border p-3" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">اسم المستخدم
              <input required minLength={3} maxLength={30} value={username} onChange={e => setUsername(e.target.value)} className="mt-1 w-full rounded-lg border p-3" />
            </label>
            <label className="block text-sm font-semibold">الاسم
              <input required value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full rounded-lg border p-3" />
            </label>
          </div>
          <label className="block text-sm font-semibold">البريد الإلكتروني
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border p-3" />
          </label>
          <label className="block text-sm font-semibold">كلمة المرور الجديدة
            <input required type="password" minLength={12} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border p-3" />
            <span className="mt-1 block text-xs font-normal text-slate-500">12 خانة على الأقل. استخدم كلمة مرور جديدة وفريدة.</span>
          </label>
          {message && <p role="status" className={error ? "rounded-lg bg-red-50 p-3 text-sm text-red-700" : "rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"}>{message}</p>}
          <button disabled={busy} className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-bold text-white disabled:opacity-50">{busy ? "جارٍ إنشاء الحساب..." : "إنشاء مدير النظام"}</button>
        </form>
        <p className="text-center text-xs text-slate-500">بعد إنشاء الحساب، يُغلق هذا الإجراء تلقائياً ولا يمكن استخدامه مرة ثانية.</p>
      </section>
    </main>
  )
}
