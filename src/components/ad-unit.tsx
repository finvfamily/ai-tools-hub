'use client'

import { useEffect } from 'react'

interface AdUnitProps {
  slot: string
}

export function AdUnit({ slot }: AdUnitProps) {
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch {}
  }, [])

  // Don't render in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="w-full h-20 rounded-xl border border-dashed border-white/10
        flex items-center justify-center text-xs text-white/20">
        Ad Placeholder [{slot}]
      </div>
    )
  }

  return (
    <ins
      className="adsbygoogle block"
      style={{ display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
