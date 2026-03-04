import Link from 'next/link'
import { MessageSquare, Heart, Eye } from 'lucide-react'

interface TopicCardProps {
  topic: {
    id: string
    title: string
    reply_count: number
    like_count: number
    view_count: number
    last_reply_at: string
    created_at: string
    node?: { name: string; slug: string } | null
    user?: { username: string; avatar_url: string | null } | null
  }
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-white/5 last:border-0
      hover:bg-white/2 transition-colors px-2 -mx-2 rounded-lg group">

      {/* Avatar */}
      <div className="shrink-0 mt-0.5">
        {topic.user?.avatar_url ? (
          <img src={topic.user.avatar_url} alt={topic.user.username}
            className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center
            justify-center text-xs text-violet-400 font-medium">
            {topic.user?.username?.[0]?.toUpperCase() ?? '?'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start gap-2 flex-wrap">
          {topic.node && (
            <Link href={`/community/${topic.node.slug}`}
              className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10
                text-violet-400 border border-violet-500/20 hover:bg-violet-500/20
                transition-colors shrink-0">
              {topic.node.name}
            </Link>
          )}
          <Link href={`/community/t/${topic.id}`}
            className="text-sm font-medium text-white/90 hover:text-white
              transition-colors line-clamp-1 group-hover:text-violet-300">
            {topic.title}
          </Link>
        </div>

        <div className="flex items-center gap-4 text-xs text-white/30">
          <span>{topic.user?.username}</span>
          <span>{timeAgo(topic.last_reply_at)}</span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />{topic.reply_count}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" />{topic.like_count}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />{topic.view_count}
          </span>
        </div>
      </div>
    </div>
  )
}
