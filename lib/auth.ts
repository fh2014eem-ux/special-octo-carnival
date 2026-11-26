import { betterAuth } from "better-auth"
import { username } from "better-auth/plugins"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { pool } from "@/lib/db"

async function sendPasswordResetEmail(to: string, url: string) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CHM_RESEND_FROM
  if (!apiKey || apiKey === "REPLACE_WITH_RESEND_API_KEY") throw new Error("Password reset email provider is not configured")
  if (!from || !/^[^\\s<>]+@[^\\s<>]+$/.test(from)) throw new Error("Verified password reset sender is not configured")
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `CHM-SFD <${from}>`,
      to: [to],
      subject: "إعادة تعيين كلمة مرور نظام الشكاوى CHM-SFD",
      html: `<div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.9;color:#172033"><h2>إعادة تعيين كلمة المرور</h2><p>تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك في نظام الشكاوى والبلاغات.</p><p><a href="${url}" style="display:inline-block;background:#155eef;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none">تعيين كلمة مرور جديدة</a></p><p>إذا لم تطلب ذلك، فتجاهل هذه الرسالة. الرابط صالح لمدة ساعة واحدة.</p><p>نظام CHM-SFD</p></div>`
    }),
  })
  if (!response.ok) {
    const detail = await response.text().catch(() => "")
    console.error("Resend password reset delivery failed:", response.status, detail.slice(0, 500))
    throw new Error("Password reset email could not be delivered")
  }
}

export const auth = betterAuth({
  database: pool,
  // Prefer the current deployment URL so Preview password-reset links return to the same deployment that issued them.
  baseURL: process.env.BETTER_AUTH_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : process.env.V0_RUNTIME_URL),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    sendResetPassword: async ({ user, url }) => { await sendPasswordResetEmail(user.email, url) },
  },
  user: { additionalFields: {
    role: { type: "string", required: true, defaultValue: "مدخل بيانات", input: false },
    branch: { type: "string", required: true, defaultValue: "الإدارة العامة", input: false },
    active: { type: "boolean", required: true, defaultValue: true, input: false },
  } },
  plugins: [username({ immutableUsername: true })],
  hooks: { before: createAuthMiddleware(async (ctx) => {
    if (ctx.path !== "/sign-up/email") return
    const bootstrapToken = ctx.headers?.get("x-chm-bootstrap-token") ?? null
    const provisionToken = ctx.headers?.get("x-chm-user-provision-token") ?? null
    const isBootstrap = Boolean(process.env.CHM_BOOTSTRAP_TOKEN && bootstrapToken === process.env.CHM_BOOTSTRAP_TOKEN)
    const isProvision = Boolean(process.env.CHM_USER_PROVISION_TOKEN && provisionToken === process.env.CHM_USER_PROVISION_TOKEN)
    if (!isBootstrap && !isProvision) throw new APIError("FORBIDDEN", { message: "إنشاء الحسابات متاح عبر إجراء التهيئة أو مدير النظام فقط." })
    if (isBootstrap) {
      const result = await pool.query('SELECT COUNT(*)::int AS count FROM public."user"')
      if (Number(result.rows[0]?.count ?? 0) > 0) throw new APIError("FORBIDDEN", { message: "تم إنشاء مدير النظام بالفعل؛ إجراء التهيئة لم يعد متاحاً." })
    }
  }) },
  trustedOrigins: [
    ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000", ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []), ...(process.env.V0_DEV_APP_URL ? [process.env.V0_DEV_APP_URL] : []), ...(process.env.V0_BUILD_URL ? [process.env.V0_BUILD_URL] : []), ...(process.env.V0_SANDBOX_URL ? [process.env.V0_SANDBOX_URL] : [])] : []),
    ...(process.env.NODE_ENV === "production" ? [...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []), ...(process.env.VERCEL_PROJECT_PRODUCTION_URL ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`] : [])] : []),
  ],
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
  ...(process.env.NODE_ENV === "development" ? { advanced: { defaultCookieAttributes: { sameSite: "lax" as const, secure: false } } } : {}),
})