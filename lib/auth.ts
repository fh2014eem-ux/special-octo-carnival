import { betterAuth } from "better-auth"
import { username } from "better-auth/plugins"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { pool } from "@/lib/db"

export const auth = betterAuth({
  database: pool,
  baseURL:
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.V0_RUNTIME_URL),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      role: { type: "string", required: true, defaultValue: "مدخل بيانات", input: false },
      branch: { type: "string", required: true, defaultValue: "الإدارة العامة", input: false },
      active: { type: "boolean", required: true, defaultValue: true, input: false },
    },
  },
  plugins: [username({ immutableUsername: true })],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return
      // ctx.request is absent for server-side auth.api calls; ctx.headers is available in both modes.
      const bootstrapToken = ctx.headers?.get("x-chm-bootstrap-token") ?? null
      const provisionToken = ctx.headers?.get("x-chm-user-provision-token") ?? null
      const isBootstrap = Boolean(process.env.CHM_BOOTSTRAP_TOKEN && bootstrapToken === process.env.CHM_BOOTSTRAP_TOKEN)
      const isProvision = Boolean(process.env.CHM_USER_PROVISION_TOKEN && provisionToken === process.env.CHM_USER_PROVISION_TOKEN)
      if (!isBootstrap && !isProvision) {
        throw new APIError("FORBIDDEN", { message: "إنشاء الحسابات متاح عبر إجراء التهيئة أو مدير النظام فقط." })
      }
      if (isBootstrap) {
        const result = await pool.query('SELECT COUNT(*)::int AS count FROM public."user"')
        if (Number(result.rows[0]?.count ?? 0) > 0) {
          throw new APIError("FORBIDDEN", { message: "تم إنشاء مدير النظام بالفعل؛ إجراء التهيئة لم يعد متاحاً." })
        }
      }
    }),
  },
  trustedOrigins: [
    ...(process.env.NODE_ENV === "development"
      ? [
          "http://localhost:3000",
          ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
          ...(process.env.V0_DEV_APP_URL ? [process.env.V0_DEV_APP_URL] : []),
          ...(process.env.V0_BUILD_URL ? [process.env.V0_BUILD_URL] : []),
          ...(process.env.V0_SANDBOX_URL ? [process.env.V0_SANDBOX_URL] : []),
        ]
      : []),
    ...(process.env.NODE_ENV === "production"
      ? [
          ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
          ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
            : []),
        ]
      : []),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  ...(process.env.NODE_ENV === "development"
    ? {
        advanced: {
          defaultCookieAttributes: {
            sameSite: "lax" as const,
            secure: false,
          },
        },
      }
    : {}),
})
