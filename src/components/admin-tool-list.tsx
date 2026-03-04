'use client'

import { useState } from 'react'
import { ExternalLink, Check, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'

interface Tool {
  id: string
  name: string
  slug: string
  website_url: string
  description: string
  thumbnail_url: string | null
  pricing_type: string | null
  submitted_by: string | null
  created_at: string
  category?: { name: string; slug: string } | null
}

interface AdminToolListProps {
  tools: Tool[]
}

export function AdminToolList({ tools: initialTools }: AdminToolListProps) {
  const [tools, setTools] = useState(initialTools)
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    setLoading(prev => ({ ...prev, [id]: true }))
    try {
      const res = await fetch('/api/admin/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        setTools(prev => prev.filter(t => t.id !== id))
      }
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }))
    }
  }

  if (tools.length === 0) {
    return (
      <div className="text-center py-16 text-white/30">
        <p>No pending submissions 🎉</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {tools.map(tool => (
          <motion.div
            key={tool.id}
            layout
            exit={{ opacity: 0, x: -20, height: 0 }}
            className="glass-card rounded-2xl p-5 flex gap-4"
          >
            {/* Thumbnail */}
            {tool.thumbnail_url ? (
              <img
                src={tool.thumbnail_url}
                alt={tool.name}
                className="w-24 h-16 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="w-24 h-16 rounded-lg bg-white/5 shrink-0 flex items-center justify-center text-2xl">
                🤖
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white truncate">{tool.name}</h3>
                {tool.category && (
                  <span className="text-xs text-violet-400 shrink-0">{tool.category.name}</span>
                )}
                {tool.pricing_type && (
                  <span className="text-xs text-white/30 capitalize shrink-0">{tool.pricing_type}</span>
                )}
              </div>
              <p className="text-sm text-white/50 line-clamp-1">{tool.description}</p>
              <div className="flex items-center gap-3 text-xs text-white/30">
                <a href={tool.website_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-violet-400 transition-colors">
                  <ExternalLink className="w-3 h-3" />
                  {tool.website_url.replace(/^https?:\/\//, '')}
                </a>
                <span>by {tool.submitted_by}</span>
                <span>{new Date(tool.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={() => updateStatus(tool.id, 'approved')}
                disabled={loading[tool.id]}
                className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 w-8 p-0 rounded-lg"
              >
                {loading[tool.id] ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
              </Button>
              <Button
                size="sm"
                onClick={() => updateStatus(tool.id, 'rejected')}
                disabled={loading[tool.id]}
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-8 w-8 p-0 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
