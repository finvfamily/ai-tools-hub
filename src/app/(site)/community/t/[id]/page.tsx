import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, MessageSquare, Heart } from 'lucide-react'
import { getTopicById, getRepliesByTopic, getCommunityUser } from '@/lib/queries/community'
import { createServerClient } from '@/lib/supabase/server'
import { MarkdownContent } from '@/components/markdown-content'
import { ReplySection } from '@/components/reply-section'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data } = await getTopicById(id)
  if (!data) return {}
  return { title: `${data.title} — Community` }
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const d = Math.floor(diff / 86400000)
  if (d === 0) return 'today'
  if (d === 1) return 'yesterday'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default async function TopicPage({ params }: Props) {
  const { id } = await params

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: topic }, { data: replies }] = await Promise.all([
    getTopicById(id),
    getRepliesByTopic(id),
  ])

  if (!topic) notFound()

  let communityUser = null
  if (user) {
    const { data } = await getCommunityUser(user.id)
    communityUser = data
  }

  const t = topic as any

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">

      {/* Back */}
      <div className="flex items-center gap-3">
        <Link href={t.node ? `/community/${t.node.slug}` : '/community'}
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t.node ? t.node.name : 'Community'}
        </Link>
      </div>

      {/* Topic */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          {t.node && (
            <Link href={`/community/${t.node.slug}`}
              className="inline-flex text-xs px-3 py-1 rounded-full
                bg-violet-500/10 text-violet-400 border border-violet-500/20
                hover:bg-violet-500/20 transition-colors">
              {t.node.name}
            </Link>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            {t.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              {t.user?.avatar_url ? (
                <img src={t.user.avatar_url} alt={t.user.username}
                  className="w-7 h-7 rounded-full" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-violet-600/30 flex items-center
                  justify-center text-xs text-violet-400 font-medium">
                  {t.user?.username?.[0]?.toUpperCase()}
                </div>
              )}
              <Link href={`/community/u/${t.user?.username}`}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                {t.user?.username}
              </Link>
            </div>
            <span className="text-xs text-white/30">{timeAgo(t.created_at)}</span>
            <div className="flex items-center gap-3 text-xs text-white/30 ml-auto">
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{t.view_count}</span>
              <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{t.reply_count}</span>
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{t.like_count}</span>
            </div>
          </div>
        </div>

        <hr className="border-white/5" />

        {/* Content */}
        <div className="min-h-[100px]">
          <MarkdownContent content={t.content} />
        </div>
      </div>

      {/* Replies */}
      <ReplySection
        topicId={id}
        initialReplies={(replies as any[]) ?? []}
        communityUser={communityUser}
      />
    </div>
  )
}
