import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Tools Hub — Discover the Best AI Tools',
  description: 'Discover, compare and submit the best AI tools of 2025. Curated directory of AI applications for productivity, writing, coding, image generation and more.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'AI Tools Hub — Discover the Best AI Tools',
    description: 'Curated directory of the best AI tools, updated daily.',
    images: [{ url: '/api/og/home', width: 1200, height: 630, alt: 'AI Tools Hub' }],
  },
}
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToolCard } from '@/components/tool-card'
import { CategoryNav } from '@/components/category-nav'
import { CountUp } from '@/components/count-up'
import { HeroSearch } from '@/components/hero-search'
import { getAllCategories } from '@/lib/queries/categories'
import { getFeaturedTools, getApprovedTools, getToolsCount } from '@/lib/queries/tools'
import type { ToolWithRelations } from '@/types'

export const revalidate = 3600

export default async function HomePage() {
  const [
    { data: categories },
    { data: featured },
    { data: latest, count },
  ] = await Promise.all([
    getAllCategories(),
    getFeaturedTools(6),
    getApprovedTools({ limit: 12 }),
  ])

  const totalCount = count ?? 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-20">

      {/* Hero */}
      <section className="text-center space-y-8 pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
          bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Open source AI tools directory
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
          Discover the Best{' '}
          <span className="gradient-text">AI Tools</span>
        </h1>

        <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
          Curated collection of AI applications for productivity, writing, coding,
          design and more. Find the perfect AI tool for your needs.
        </p>

        <HeroSearch />

        {/* Stats */}
        <div className="flex items-center justify-center gap-12 pt-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              <CountUp target={totalCount} />+
            </div>
            <div className="text-sm text-white/40 mt-1">AI Tools</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              <CountUp target={categories?.length ?? 0} />
            </div>
            <div className="text-sm text-white/40 mt-1">Categories</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">Free</div>
            <div className="text-sm text-white/40 mt-1">Always</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Browse by Category</h2>
          <CategoryNav categories={categories} />
        </section>
      )}

      {/* Featured Tools */}
      {featured && featured.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Featured Tools</h2>
            <Link href="/tools" className="text-sm text-violet-400 hover:text-violet-300
              transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(featured as ToolWithRelations[]).map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Tools */}
      {latest && latest.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Latest Tools</h2>
            <Link href="/tools" className="text-sm text-violet-400 hover:text-violet-300
              transition-colors flex items-center gap-1">
              Browse all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(latest as ToolWithRelations[]).map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Submit Banner */}
      <section>
        <div className="relative rounded-3xl overflow-hidden glass-card p-10 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-blue-600/10" />
          <div className="relative space-y-4">
            <h2 className="text-2xl font-bold text-white">Know a great AI tool?</h2>
            <p className="text-white/50">
              Help the community discover it. Submit it for review and we&apos;ll add it to the directory.
            </p>
            <Button asChild
              className="bg-violet-600 hover:bg-violet-500 text-white rounded-full px-8 mt-2">
              <Link href="/submit">
                Submit a Tool <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}
