import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Heart, Calendar } from 'lucide-react'
import { getUserByUsername } from '@/lib/queries/community'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  return { title: `${username} — Community` }
}

function timeAgo(date: string) {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params
  const { data: profile } = await getUserByUsername(username)

  if (!profile) notFound()

  const p = profile as any
  const topics = (p.topics ?? []) as any[]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">

      {/* Back */}
      <Link href="/community"
        className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Community
      </Link>

      {/* Profile card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-5">
          {p.avatar_url ? (
            <img src={p.avatar_url} alt={p.username}
              className="w-16 h-16 rounded-full ring-2 ring-white/10" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-violet-600/30 flex items-center
              justify-center text-2xl text-violet-400 font-bold ring-2 ring-white/10">
              {p.username[0].toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white">{p.username}</h1>
            {p.bio && <p className="text-sm text-white/50 mt-1">{p.bio}</p>}

            <div className="flex items-center gap-5 mt-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-white/30">
                <Calendar className="w-3.5 h-3.5" />
                Joined {timeAgo(p.created_at)}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/30">
                <MessageSquare className="w-3.5 h-3.5" />
                {p.post_count ?? 0} topics
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">
          Topics ({topics.length})
        </h2>

        {topics.length > 0 ? (
          <div className="glass-card rounded-2xl divide-y divide-white/5">
            {topics.map((topic: any) => (
              <Link key={topic.id} href={`/community/t/${topic.id}`}
                className="flex items-center justify-between px-5 py-4 group hover:bg-white/2 transition-colors">
                <div className="flex-1 min-w-0 space-y-1">
                  {topic.node && (
                    <span className="text-xs text-violet-400">{topic.node.name}</span>
                  )}
                  <p className="text-sm text-white/80 group-hover:text-white transition-colors
                    truncate leading-snug">
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
                  <span className="hidden sm:block">{timeAgo(topic.created_at)}</span>
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
