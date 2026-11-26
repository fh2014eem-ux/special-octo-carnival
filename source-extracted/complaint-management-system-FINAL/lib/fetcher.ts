export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const message = await res
      .json()
      .then((body) => body?.error as string | undefined)
      .catch(() => undefined)
    throw new Error(message ?? "فشل جلب البيانات")
  }
  return res.json() as Promise<T>
}
