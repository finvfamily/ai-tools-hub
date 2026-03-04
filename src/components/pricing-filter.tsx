'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { motion } from 'motion/react'

const options = [
  { label: 'All',       value: '' },
  { label: 'Free',      value: 'free' },
  { label: 'Freemium',  value: 'freemium' },
  { label: 'Paid',      value: 'paid' },
]

export function PricingFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get('pricing') ?? ''

  function handleClick(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('pricing', value)
    } else {
      params.delete('pricing')
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="relative flex gap-1 rounded-full bg-white/5 border border-white/8 p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleClick(opt.value)}
          className="relative z-10 px-4 py-1.5 text-sm rounded-full transition-colors"
          style={{ color: active === opt.value ? 'white' : 'rgba(255,255,255,0.4)' }}
        >
          {active === opt.value && (
            <motion.div
              layoutId="pricing-pill"
              className="absolute inset-0 bg-violet-600 rounded-full -z-10"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          {opt.label}
        </button>
      ))}
    </div>
  )
}
