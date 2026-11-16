// عميل Prisma (نمط singleton لتفادي إنشاء اتصالات متعددة أثناء التطوير)
// لا يُستورد هذا الملف إلا عند وجود DATABASE_URL (انظر lib/data.ts)
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
