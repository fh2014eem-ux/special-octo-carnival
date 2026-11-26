import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(_request: Request, { params }: { params: Promise<{ attachmentId: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.active === false) return new Response("Unauthorized", { status: 401 })
  const { attachmentId } = await params
  const isAdmin = session.user.role === "مدير النظام" || session.user.role === "إدارة عامة" || session.user.branch === "الإدارة العامة"
  const branch = session.user.branch || ""

  const boxAttachment = await prisma.fieldBoxAttachment.findFirst({
    where: { id: attachmentId, box: isAdmin ? undefined : { branch } },
    select: { fileName: true, mimeType: true, fileSize: true, fileContent: true },
  })
  const minuteAttachment = boxAttachment ? null : await prisma.boxOpeningMinuteAttachment.findFirst({
    where: { id: attachmentId, minute: isAdmin ? undefined : { branch } },
    select: { fileName: true, mimeType: true, fileSize: true, fileContent: true },
  })
  const file = boxAttachment ?? minuteAttachment
  if (!file) return new Response("Not found", { status: 404 })

  return new Response(new Uint8Array(file.fileContent), {
    status: 200,
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": String(file.fileSize),
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.fileName)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
