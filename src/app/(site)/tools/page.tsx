import { Suspense, Fragment } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ToolCard } from '@/components/tool-card'
import { CategoryNav } from '@/components/category-nav'
import { PricingFilter } from '@/components/pricing-filter'
import { AdUnit } from '@/components/ad-unit'
import { getAllCategories } from '@/lib/queries/categories'
import { getApprovedTools } from '@/lib/queries/tools'
import type { ToolWithRelations } from '@/types'

export const revalidate = 3600

const PAGE_SIZE = 24

interface Props {
  searchParams: Promise<{ category?: string; pricing?: string; q?: string; page?: string }>
}

export async function generateMetadata({ searchParams }: Props) {
  const params = await searchParams
  const title = params.q
    ? `Search: "${params.q}"`
    : params.category
    ? `${params.category} AI Tools`
    : 'Browse AI Tools'
  const description = 'Browse and filter hundreds of AI tools by category, pricing and use case. Find the best AI apps for writing, coding, design, productivity and more.'
  return {
    title,
    description,
    alternates: { canonical: '/tools' },
    openGraph: {
      title: `${title} — AI Tools Hub`,
      description,
      images: [{ url: '/api/og/home', width: 1200, height: 630 }],
    },
  }
}

export default async function ToolsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)

  const [{ data: categories }, { data: tools, count }] = await Promise.all([
    getAllCategories(),
    getApprovedTools({
      category: params.category,
      pricing: params.pricing,
      search: params.q,
      page,
      limit: PAGE_SIZE,
    }),
  ])

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  function buildPageUrl(p: number) {
    const sp = new URLSearchParams()
    if (params.category) sp.set('category', params.category)
    if (params.pricing)  sp.set('pricing', params.pricing)
    if (params.q)        sp.set('q', params.q)
    if (p > 1)           sp.set('page', String(p))
    const qs = sp.toString()
    return `/tools${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-white">
          {params.q ? `Results for "${params.q}"` : 'Browse AI Tools'}
        </h1>
        <p className="text-white/40 text-sm">
          {count ?? 0} tools found
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Suspense>
          <CategoryNav categories={categories ?? []} />
        </Suspense>
        <Suspense>
          <PricingFilter />
        </Suspense>
      </div>

      {/* Grid */}
      {tools && tools.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(tools as ToolWithRelations[]).map((tool, i) => (
              <Fragment key={tool.id}>
                <ToolCard tool={tool} index={i} />
                {(i + 1) % 12 === 0 && (
                  <div className="col-span-full">
                    <AdUnit slot="tools-list" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              {page > 1 && (
                <Link href={buildPageUrl(page - 1)}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl glass-card
                    text-white/60 hover:text-white text-sm transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Prev
                </Link>
              )}
              <span className="text-sm text-white/40">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link href={buildPageUrl(page + 1)}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl glass-card
                    text-white/60 hover:text-white text-sm transition-colors">
                  Next <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-24 text-white/30">
          <p className="text-lg">No tools found</p>
          <p className="text-sm mt-1">Try a different search or category</p>
        </div>
      )}
    </div>
  )
}
