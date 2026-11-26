import type { Operation } from "@/lib/types"
import { STATUS } from "@/lib/data/constants"

export function countBy<T>(items: T[], key: (item: T) => string) {
  const map = new Map<string, number>()
  for (const item of items) {
    const k = key(item)
    if (!k) continue
    map.set(k, (map.get(k) ?? 0) + 1)
  }
  return map
}

export function toChartData(map: Map<string, number>) {
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
}

export function operationStats(ops: Operation[]) {
  const total = ops.length
  const closed = ops.filter((o) => o.status === STATUS.CLOSED).length
  const open = total - closed
  const highSensitivity = ops.filter((o) => o.sensitivity === "شكوى عالية الحساسية").length
  const closureRate = total ? Math.round((closed / total) * 100) : 0
  return { total, closed, open, highSensitivity, closureRate }
}
