'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'
import { Badge } from '@/components/ui/badge'
import type { ToolWithRelations } from '@/types'

const pricingColors: Record<string, string> = {
  free:      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  freemium:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  paid:      'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

interface ToolCardProps {
  tool: ToolWithRelations
  index?: number
}

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
    >
      <Link href={`/tools/${tool.slug}`} className="group block">
        <motion.div
          className="h-full rounded-2xl p-5 glass-card cursor-pointer"
          whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(139,92,246,0.15)' }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {/* Thumbnail */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-white/5 mb-4">
            {tool.thumbnail_url ? (
              <img
                src={tool.thumbnail_url}
                alt={tool.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl">{tool.category?.name?.[0] ?? '🤖'}</span>
              </div>
            )}
            {tool.pricing_type && (
              <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full
                border backdrop-blur-sm ${pricingColors[tool.pricing_type]}`}>
                {tool.pricing_type}
              </span>
            )}
            {tool.is_featured && (
              <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full
                bg-violet-500/20 text-violet-300 border border-violet-500/30 backdrop-blur-sm">
                Featured
              </span>
            )}
          </div>

          {/* Info */}
          <div className="space-y-2">
            {tool.category && (
              <span className="text-xs text-violet-400">{tool.category.name}</span>
            )}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-white leading-tight">{tool.name}</h3>
              <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50
                transition-colors shrink-0 mt-0.5" />
            </div>
            <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">
              {tool.description}
            </p>

            {/* Tags */}
            {tool.tool_tags && tool.tool_tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tool.tool_tags.slice(0, 3).map(({ tag }) => (
                  <Badge
                    key={tag.slug}
                    variant="outline"
                    className="text-xs py-0 border-white/10 text-white/40 bg-transparent"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
