'use client'

import { useState } from 'react'
import { Heart, Loader2, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { MarkdownContent } from './markdown-content'

interface Reply {
  id: string
  content: string
  floor: number
  like_count: number
  created_at: string
  user: { id: string; username: string; avatar_url: string | null }
}

interface ReplySectionProps {
  topicId: string
  initialReplies: Reply[]
  communityUser: { id: string; username: string } | null
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function ReplySection({ topicId, initialReplies, communityUser }: ReplySectionProps) {
  const [replies, setReplies] = useState(initialReplies)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/community/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, content }),
      })
      const data = await res.json()
      if (data.reply) {
        setReplies(prev => [...prev, data.reply])
        setContent('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">
        {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
      </h2>

      {/* Replies */}
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {replies.map(reply => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  {reply.user.avatar_url ? (
                    <img src={reply.user.avatar_url} alt={reply.user.username}
                      className="w-7 h-7 rounded-full" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-violet-600/30 flex items-center
                      justify-center text-xs text-violet-400 font-medium">
                      {reply.user.username[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-white/80">{reply.user.username}</span>
                  <span className="text-xs text-white/30">{timeAgo(reply.created_at)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/20">#{reply.floor}</span>
                  <button className="flex items-center gap-1 text-xs text-white/30
                    hover:text-violet-400 transition-colors">
                    <Heart className="w-3.5 h-3.5" />{reply.like_count}
                  </button>
                </div>
              </div>
              {/* Content */}
              <div className="text-sm">
                <MarkdownContent content={reply.content} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Reply form */}
      {communityUser ? (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-medium text-white/60">Add a Reply</h3>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your reply... (Markdown supported)"
            rows={4}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10
              text-white placeholder:text-white/20 text-sm outline-none resize-none
              focus:border-violet-500/50 transition-colors"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting || !content.trim()}
              className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl gap-2">
              {submitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting...</>
                : <><Send className="w-4 h-4" /> Reply</>
              }
            </Button>
          </div>
        </form>
      ) : (
        <div className="glass-card rounded-2xl p-6 text-center space-y-3">
          <p className="text-white/50 text-sm">Login to join the discussion</p>
          <Button asChild variant="outline"
            className="border-white/10 text-white/70 hover:text-white rounded-xl gap-2">
            <a href="/api/community/auth">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Login with GitHub
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}
