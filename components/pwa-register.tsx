"use client"

import { useEffect } from "react"

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return
    const register = () => navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((error) => {
      console.error("CHM-SFD service worker registration failed:", error)
    })
    if (document.readyState === "complete") void register()
    else window.addEventListener("load", register, { once: true })
    return () => window.removeEventListener("load", register)
  }, [])
  return null
}
