// أدوات التنسيق للتواريخ والأرقام (بالعربية)

export function formatDate(iso?: string) {
  if (!iso) return "-"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "-"
  return new Intl.DateTimeFormat("ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d)
}

export function formatDateShort(iso?: string) {
  if (!iso) return "-"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "-"
  return new Intl.DateTimeFormat("ar", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d)
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("ar").format(n)
}

export function relativeTime(iso?: string) {
  if (!iso) return "-"
  const d = new Date(iso).getTime()
  const diff = Date.now() - d
  const days = Math.floor(diff / 86400000)
  if (days <= 0) return "اليوم"
  if (days === 1) return "أمس"
  if (days < 30) return `منذ ${formatNumber(days)} يومًا`
  const months = Math.floor(days / 30)
  return `منذ ${formatNumber(months)} شهرًا`
}

export function formatDateTime(iso?: string) {
  if (!iso) return "-"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "-"
  return new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" }).format(d)
}
