import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ToolCard } from '@/components/tool-card'
import { AdUnit } from '@/components/ad-unit'
import { getToolBySlug, getRelatedTools } from '@/lib/queries/tools'
import type { ToolWithRelations } from '@/types'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const { data: tool } = await getToolBySlug(slug)
  if (!tool) return {}

  const t = tool as ToolWithRelations
  const title = `${t.name} — AI Tool`
  const description = t.description.length > 155
    ? t.description.slice(0, 152) + '...'
    : t.description

  return {
    title,
    description,
    keywords: [t.name, 'AI tool', t.category?.name, 'artificial intelligence'].filter(Boolean),
    alternates: {
      canonical: `/tools/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: `/api/og/${slug}`, width: 1200, height: 630, alt: t.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og/${slug}`],
    },
  }
}

const pricingLabels: Record<string, string> = {
  free:     '🟢 Free',
  freemium: '🔵 Freemium',
  paid:     '🟡 Paid',
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params
  const { data: tool } = await getToolBySlug(slug)
  if (!tool) notFound()

  const t = tool as ToolWithRelations

  const { data: related } = t.category_id
    ? await getRelatedTools(t.category_id, slug, 3)
    : { data: [] }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: t.name,
    description: t.description,
    url: t.website_url,
    applicationCategory: 'AIApplication',
    ...(t.category && { applicationSubCategory: t.category.name }),
    offers: {
      '@type': 'Offer',
      price: t.pricing_type === 'free' ? '0' : undefined,
      priceCurrency: 'USD',
      availability: 'https://schema.org/OnlineOnly',
    },
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back */}
      <Link href="/tools"
        className="inline-flex items-center gap-1.5 text-sm text-white/40
          hover:text-white/70 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Tools
      </Link>

      <div className="grid lg:grid-cols-[1fr_300px] gap-10">

        {/* Main */}
        <div className="space-y-8">
          {/* Screenshot */}
          {t.thumbnail_url && (
            <div className="rounded-2xl overflow-hidden border border-white/8 aspect-video">
              <img
                src={t.thumbnail_url}
                alt={t.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title + meta */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              {t.category && (
                <Badge variant="outline"
                  className="border-violet-500/30 text-violet-400 bg-violet-500/10">
                  {t.category.name}
                </Badge>
              )}
              {t.pricing_type && (
                <Badge variant="outline" className="border-white/10 text-white/50">
                  {pricingLabels[t.pricing_type]}
                </Badge>
              )}
              {t.is_featured && (
                <Badge variant="outline"
                  className="border-violet-500/30 text-violet-300 bg-violet-500/10">
                  ⭐ Featured
                </Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold text-white">{t.name}</h1>
            <p className="text-lg text-white/60 leading-relaxed">{t.description}</p>

            {t.tool_tags && t.tool_tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {t.tool_tags.map(({ tag }) => (
                  <Badge key={tag.slug} variant="outline"
                    className="border-white/10 text-white/40 bg-white/5">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}

            {t.content && (
              <div className="prose prose-invert prose-sm max-w-none pt-2
                text-white/60 leading-relaxed">
                <p>{t.content}</p>
              </div>
            )}
          </div>

          {/* Bottom ad */}
          <AdUnit slot="tool-detail-bottom" />
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Visit button */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <Button asChild className="w-full bg-violet-600 hover:bg-violet-500
              text-white rounded-xl h-11 gap-2">
              <a href={t.website_url} target="_blank" rel="noopener noreferrer">
                Visit {t.name} <ExternalLink className="w-4 h-4" />
              </a>
            </Button>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-white/40">
                <span>Pricing</span>
                <span className="text-white/70 capitalize">{t.pricing_type ?? '—'}</span>
              </div>
              <div className="flex justify-between text-white/40">
                <span>Views</span>
                <span className="text-white/70">{t.view_count.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/40">
                <span>Added</span>
                <span className="text-white/70">
                  {new Date(t.created_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar ad */}
          <AdUnit slot="tool-detail-sidebar" />

          {/* Related tools */}
          {related && related.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white/60">Related Tools</h3>
              {(related as ToolWithRelations[]).map((rt) => (
                <Link key={rt.id} href={`/tools/${rt.slug}`}
                  className="block glass-card rounded-xl p-3 hover:border-violet-500/30
                    transition-colors group">
                  <div className="font-medium text-sm text-white group-hover:text-violet-300
                    transition-colors">{rt.name}</div>
                  <div className="text-xs text-white/40 mt-0.5 line-clamp-1">
                    {rt.description}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
