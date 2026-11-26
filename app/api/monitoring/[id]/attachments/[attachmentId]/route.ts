import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string; attachmentId: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.active === false) {
    return new Response("Unauthorized", { status: 401 })
  }
  const { id, attachmentId } = await params
  const isAdmin = session.user.role === "مدير النظام" || session.user.role === "إدارة عامة" || session.user.branch === "الإدارة العامة"

  const attachment = await prisma.fieldMonitoringAttachment.findFirst({
    where: {
      id: attachmentId,
      visitId: id,
      visit: isAdmin ? undefined : { branch: session.user.branch || "" },
    },
    select: { fileName: true, mimeType: true, fileContent: true, fileSize: true },
  })
  if (!attachment) return new Response("Not found", { status: 404 })

  return new Response(new Uint8Array(attachment.fileContent), {
    status: 200,
    headers: {
      "Content-Type": attachment.mimeType,
      "Content-Length": String(attachment.fileSize),
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(attachment.fileName)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
