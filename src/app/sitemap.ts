import type { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase/server'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ai-tools-hub-xi.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerClient()

  const [
    { data: tools },
    { data: categories },
    { data: nodes },
    { data: topics },
  ] = await Promise.all([
    supabase.from('tools').select('slug, updated_at').eq('status', 'approved'),
    supabase.from('categories').select('slug, created_at'),
    supabase.from('nodes').select('slug').order('sort_order'),
    supabase.from('topics').select('id, last_reply_at').order('last_reply_at', { ascending: false }).limit(200),
  ])

  const toolUrls: MetadataRoute.Sitemap = (tools ?? []).map(t => ({
    url: `${BASE_URL}/tools/${t.slug}`,
    lastModified: t.updated_at,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const categoryUrls: MetadataRoute.Sitemap = (categories ?? []).map(c => ({
    url: `${BASE_URL}/tools?category=${c.slug}`,
    lastModified: c.created_at,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const nodeUrls: MetadataRoute.Sitemap = (nodes ?? []).map(n => ({
    url: `${BASE_URL}/community/${n.slug}`,
    changeFrequency: 'hourly' as const,
    priority: 0.6,
  }))

  const topicUrls: MetadataRoute.Sitemap = (topics ?? []).map(t => ({
    url: `${BASE_URL}/community/t/${t.id}`,
    lastModified: t.last_reply_at,
    changeFrequency: 'weekly' as const,
    priority: 0.4,
  }))

  return [
    { url: BASE_URL,                        priority: 1.0, changeFrequency: 'daily' },
    { url: `${BASE_URL}/tools`,             priority: 0.9, changeFrequency: 'daily' },
    { url: `${BASE_URL}/community`,         priority: 0.7, changeFrequency: 'hourly' },
    { url: `${BASE_URL}/submit`,            priority: 0.4, changeFrequency: 'monthly' },
    ...categoryUrls,
    ...toolUrls,
    ...nodeUrls,
    ...topicUrls,
  ]
}
