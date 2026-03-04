'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'motion/react'
import type { Category } from '@/types'

interface CategoryNavProps {
  categories: Category[]
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category')

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none w-full">
        {/* All */}
        <Link href="/tools" scroll={false}>
          <motion.div
            className={`relative shrink-0 px-4 py-2 rounded-full text-sm cursor-pointer
              transition-colors whitespace-nowrap
              ${!activeCategory
                ? 'text-white'
                : 'text-white/50 hover:text-white/80 glass-card'
              }`}
            whileTap={{ scale: 0.95 }}
          >
            {!activeCategory && (
              <motion.div
                layoutId="category-pill"
                className="absolute inset-0 bg-violet-600 rounded-full -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            All Tools
          </motion.div>
        </Link>

        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug
          return (
            <Link
              key={cat.id}
              href={`/tools?category=${cat.slug}`}
              scroll={false}
            >
              <motion.div
                className={`relative shrink-0 flex items-center gap-1.5 px-4 py-2
                  rounded-full text-sm cursor-pointer transition-colors whitespace-nowrap
                  ${isActive
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/80 glass-card'
                  }`}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="category-pill"
                    className="absolute inset-0 bg-violet-600 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {cat.icon && <span>{cat.icon}</span>}
                {cat.name}
              </motion.div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
