'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, Github, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CommunityUser {
  id: string
  username: string
  avatar_url: string | null
}

interface NavbarProps {
  communityUser?: CommunityUser | null
}

export function Navbar({ communityUser }: NavbarProps) {
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
          <Link
            href="/community"
            className={cn(
              'text-sm transition-colors flex items-center gap-1.5',
              pathname.startsWith('/community') ? 'text-white' : 'text-white/50 hover:text-white'
            )}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Community
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/finvfamily/ai-tools-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>

          {/* Community user avatar or login */}
          {communityUser ? (
            <Link
              href={`/community/u/${communityUser.username}`}
              className="flex items-center gap-2 group"
            >
              {communityUser.avatar_url ? (
                <img
                  src={communityUser.avatar_url}
                  alt={communityUser.username}
                  className="w-7 h-7 rounded-full ring-2 ring-white/10
                    group-hover:ring-violet-500/50 transition-all"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-violet-600/30 flex items-center
                  justify-center text-xs text-violet-400 font-medium
                  ring-2 ring-white/10 group-hover:ring-violet-500/50 transition-all">
                  {communityUser.username[0].toUpperCase()}
                </div>
              )}
            </Link>
          ) : null}

          {/* Submit button */}
          <Button asChild size="sm"
            className="bg-violet-600 hover:bg-violet-500 text-white rounded-full px-5">
            <Link href="/submit">Submit Tool</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
