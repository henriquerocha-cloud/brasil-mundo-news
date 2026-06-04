'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function Tracker() {
  const pathname = usePathname()
  const trackedPaths = useRef<Set<string>>(new Set())

  useEffect(() => {
    // Evita duplicar pings na mesma montagem ou no mesmo path rápido
    if (trackedPaths.current.has(pathname)) return
    
    trackedPaths.current.add(pathname)

    fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: pathname,
        referer: document.referrer,
        userAgent: navigator.userAgent
      })
    }).catch(() => {
      // Falha silenciosa no client
    })
  }, [pathname])

  return null
}
