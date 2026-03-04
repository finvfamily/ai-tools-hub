import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Heart } from 'lucide-react'
import { getUserByUsername, getCommunityUser } from '@/lib/queries/community'
import { createServerClient } from '@/lib/supabase/server'
import { ProfileCard } from '@/components/profile-card'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  return { title: `${username} — Community` }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, communityUserResult] = await Promise.all([
    getUserByUsername(username),
    user ? getCommunityUser(user.id) : Promise.resolve({ data: null }),
  ])

  if (!profile) notFound()

  const p = profile as any
  const topics = (p.topics ?? []) as any[]
  const isOwner = !!(communityUserResult.data?.username === username)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">

      {/* Back */}
      <Link href="/community"
        className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Community
      </Link>

      {/* Profile card — with inline edit for owner */}
      <ProfileCard
        profile={{
          username: p.username,
          avatar_url: p.avatar_url,
          bio: p.bio,
          github_url: p.github_url,
          post_count: p.post_count ?? 0,
          created_at: p.created_at,
        }}
        isOwner={isOwner}
      />

      {/* Topics */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">
          Topics ({topics.length})
        </h2>

        {topics.length > 0 ? (
          <div className="glass-card rounded-2xl divide-y divide-white/5">
            {topics.map((topic: any) => (
              <Link key={topic.id} href={`/community/t/${topic.id}`}
                className="flex items-center justify-between px-5 py-4 group
                  hover:bg-white/[0.02] transition-colors">
                <div className="flex-1 min-w-0 space-y-1">
                  {topic.node && (
                    <span className="text-xs text-violet-400">{topic.node.name}</span>
                  )}
                  <p className="text-sm text-white/80 group-hover:text-white
                    transition-colors truncate leading-snug">
                    {topic.title}
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4 shrink-0 text-xs text-white/30">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />{topic.reply_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />{topic.like_count}
                  </span>
                  <span className="hidden sm:block">{formatDate(topic.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-10 text-center text-white/30">
            <p>No topics yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
