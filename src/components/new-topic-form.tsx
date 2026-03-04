'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface Node {
  id: string
  name: string
  slug: string
  icon: string
}

interface Props {
  nodes: Node[]
  defaultNode?: string
  communityUser: { id: string; username: string }
}

export function NewTopicForm({ nodes, defaultNode, communityUser }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [nodeId, setNodeId] = useState(() => {
    if (defaultNode) {
      return nodes.find(n => n.slug === defaultNode)?.id ?? ''
    }
    return nodes[0]?.id ?? ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !nodeId || submitting) return
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/community/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content, nodeId }),
      })
      const data = await res.json()
      if (data.topic?.id) {
        router.push(`/community/t/${data.topic.id}`)
      } else {
        setError(data.error ?? 'Failed to create topic')
      }
    } catch {
      setError('Network error, please try again')
    } finally {
      setSubmitting(false)
    }
  }, [title, content, nodeId, submitting, router])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/community"
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Community
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-white">New Topic</h1>

      {/* Node selector */}
      <div className="glass-card rounded-2xl p-5 space-y-3">
        <label className="text-sm font-medium text-white/60">Node</label>
        <div className="flex flex-wrap gap-2">
          {nodes.map(node => (
            <button
              key={node.id}
              type="button"
              onClick={() => setNodeId(node.id)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                nodeId === node.id
                  ? 'bg-violet-600 text-white'
                  : 'glass-card text-white/50 hover:text-white'
              }`}
            >
              {node.icon} {node.name}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="glass-card rounded-2xl p-5 space-y-3">
        <label className="text-sm font-medium text-white/60">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter topic title..."
          maxLength={200}
          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10
            text-white placeholder:text-white/20 text-sm outline-none
            focus:border-violet-500/50 transition-colors"
        />
        <p className="text-xs text-white/20 text-right">{title.length}/200</p>
      </div>

      {/* Content editor */}
      <div className="glass-card rounded-2xl p-5 space-y-3">
        <label className="text-sm font-medium text-white/60">
          Content <span className="text-red-400">*</span>
        </label>
        <div data-color-mode="dark">
          <MDEditor
            value={content}
            onChange={val => setContent(val ?? '')}
            height={360}
            preview="live"
            className="!bg-transparent !border-white/10"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/30">
          Posting as <span className="text-violet-400">{communityUser.username}</span>
        </span>
        <Button
          type="submit"
          disabled={submitting || !title.trim() || !content.trim() || !nodeId}
          className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl gap-2"
        >
          {submitting
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
            : <><Send className="w-4 h-4" /> Publish Topic</>
          }
        </Button>
      </div>
    </form>
  )
}
