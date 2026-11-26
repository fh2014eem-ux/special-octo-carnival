import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import { Toaster } from "sonner"
import { StoreProvider } from "@/lib/store"
import "./globals.css"

const cairo = Cairo({ subsets: ["arabic"] })

export const metadata: Metadata = {
  title: "نظام الشكاوى والبلاغات - الصندوق الاجتماعي للتنمية",
  description: "نظام إدارة ومتابعة الشكاوى والبلاغات",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <StoreProvider>
          {children}
        </StoreProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}