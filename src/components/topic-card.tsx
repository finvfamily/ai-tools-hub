import Link from 'next/link'

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
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d`
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-white/5 last:border-0
      hover:bg-white/[0.02] transition-colors px-2 -mx-2 rounded-lg group">

      {/* Avatar */}
      <div className="shrink-0">
        {topic.user?.avatar_url ? (
          <img src={topic.user.avatar_url} alt={topic.user?.username ?? ''}
            className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center
            justify-center text-xs text-violet-400 font-medium">
            {topic.user?.username?.[0]?.toUpperCase() ?? '?'}
          </div>
        )}
      </div>

      {/* Main — title + meta */}
      <div className="flex-1 min-w-0">
        {/* Title row */}
        <div className="flex items-center gap-2 min-w-0">
          {topic.node && (
            <Link href={`/community/${topic.node.slug}`}
              className="shrink-0 text-[11px] px-2 py-0.5 rounded-full
                bg-violet-500/10 text-violet-400 border border-violet-500/20
                hover:bg-violet-500/20 transition-colors leading-none">
              {topic.node.name}
            </Link>
          )}
          <Link href={`/community/t/${topic.id}`}
            className="text-sm text-white/90 group-hover:text-white
              transition-colors truncate font-medium">
            {topic.title}
          </Link>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-1 text-xs text-white/30">
          <Link href={`/community/u/${topic.user?.username}`}
            className="hover:text-white/60 transition-colors">
            {topic.user?.username}
          </Link>
          <span>·</span>
          <span>{timeAgo(topic.created_at)}</span>
        </div>
      </div>

      {/* Right — replies + last active (V2EX style) */}
      <div className="shrink-0 text-right min-w-[48px]">
        <div className="text-sm font-medium text-white/40 group-hover:text-white/60
          transition-colors leading-none">
          {topic.reply_count}
        </div>
        <div className="text-[11px] text-white/20 mt-1 leading-none">
          {timeAgo(topic.last_reply_at)}
        </div>
      </div>
    </div>
  )
}
