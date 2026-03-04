'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 backdrop-blur-xl bg-[#0a0a0f]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center
            group-hover:bg-violet-500 transition-colors">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white">AI Tools Hub</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/tools"
            className={cn(
              'text-sm transition-colors',
              pathname === '/tools' ? 'text-white' : 'text-white/50 hover:text-white'
            )}
          >
            Browse
          </Link>
          <Link
            href="/category/writing"
            className={cn(
              'text-sm transition-colors',
              pathname.startsWith('/category') ? 'text-white' : 'text-white/50 hover:text-white'
            )}
          >
            Categories
          </Link>
        </nav>

        {/* Submit button */}
        <Button asChild size="sm"
          className="bg-violet-600 hover:bg-violet-500 text-white rounded-full px-5">
          <Link href="/submit">Submit Tool</Link>
        </Button>
      </div>
    </header>
  )
}
