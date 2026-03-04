'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { motion } from 'motion/react'

export function HeroSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/tools?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex justify-center">
      <motion.div
        className="relative flex items-center"
        animate={{ width: focused ? 520 : 400 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <Search className="absolute left-4 w-4 h-4 text-white/30 pointer-events-none" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search AI tools..."
          className="w-full pl-11 pr-16 py-3.5 rounded-2xl
            bg-white/5 border border-white/10 text-white placeholder:text-white/30
            outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all text-sm"
        />
        <button
          type="submit"
          className="absolute right-2 px-4 py-1.5 rounded-xl bg-violet-600
            hover:bg-violet-500 text-white text-sm font-medium transition-colors"
        >
          Search
        </button>
      </motion.div>
    </form>
  )
}
