import Link from 'next/link'
import { PenSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TopicCard } from '@/components/topic-card'
import { getNodes, getLatestTopics, getHotTopics } from '@/lib/queries/community'
import { createServerClient } from '@/lib/supabase/server'
import { getCommunityUser } from '@/lib/queries/community'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Community — AI Tools Hub',
  description: 'Discuss AI tools, share your creations and ideas with the community.',
}

export const revalidate = 60

export default async function CommunityPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: nodes }, { data: latest }, { data: hot }] = await Promise.all([
    getNodes(),
    getLatestTopics(20),
    getHotTopics(5),
  ])

  let communityUser = null
  if (user) {
    const { data } = await getCommunityUser(user.id)
    communityUser = data
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid lg:grid-cols-[1fr_280px] gap-8">

        {/* Main */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Community</h1>
              <p className="text-sm text-white/40 mt-0.5">
                Discuss AI tools, share ideas and showcase your creations
              </p>
            </div>
            {communityUser ? (
              <Button asChild
                className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl gap-2">
                <Link href="/community/new">
                  <PenSquare className="w-4 h-4" /> New Topic
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline"
                className="border-white/10 text-white/70 hover:text-white rounded-xl gap-2">
                <a href="/api/community/auth">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  Login with GitHub
                </a>
              </Button>
            )}
          </div>

          {/* Node tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            <Link href="/community"
              className="shrink-0 px-4 py-1.5 rounded-full text-sm bg-violet-600 text-white">
              All
            </Link>
            {nodes?.map(node => (
              <Link key={node.id} href={`/community/${node.slug}`}
                className="shrink-0 px-4 py-1.5 rounded-full text-sm glass-card
                  text-white/50 hover:text-white transition-colors whitespace-nowrap">
                {node.icon} {node.name}
              </Link>
            ))}
          </div>

          {/* Topic list */}
          <div className="glass-card rounded-2xl px-4 py-2">
            {latest && latest.length > 0 ? (
              latest.map(topic => <TopicCard key={topic.id} topic={topic as any} />)
            ) : (
              <div className="text-center py-16 text-white/30">
                <p>No topics yet</p>
                <p className="text-sm mt-1">Be the first to start a discussion!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Nodes list */}
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
              Nodes
            </h2>
            {nodes?.map(node => (
              <Link key={node.id} href={`/community/${node.slug}`}
                className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <span className="text-base">{node.icon}</span>
                  <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                    {node.name}
                  </span>
                </div>
                <span className="text-xs text-white/30">{node.topic_count}</span>
              </Link>
            ))}
          </div>

          {/* Hot topics */}
          {hot && hot.length > 0 && (
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                Hot Topics
              </h2>
              {hot.map((topic, i) => (
                <Link key={topic.id} href={`/community/t/${topic.id}`}
                  className="flex items-start gap-2 group">
                  <span className={`text-sm font-bold shrink-0 mt-0.5 ${
                    i === 0 ? 'text-amber-400' : i === 1 ? 'text-white/40' : 'text-white/20'
                  }`}>{i + 1}</span>
                  <span className="text-sm text-white/60 group-hover:text-white
                    transition-colors line-clamp-2 leading-snug">
                    {topic.title}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Post guide */}
          <div className="glass-card rounded-2xl p-5 space-y-2">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
              Community Guidelines
            </h2>
            <ul className="space-y-1.5 text-xs text-white/40">
              <li>• Be respectful and constructive</li>
              <li>• Stay on topic (AI tools & creativity)</li>
              <li>• Share your real experience</li>
              <li>• No spam or self-promotion</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
