import type { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase/server'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aitoolshub.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerClient()

  const [{ data: tools }, { data: categories }] = await Promise.all([
    supabase
      .from('tools')
      .select('slug, updated_at')
      .eq('status', 'approved'),
    supabase
      .from('categories')
      .select('slug, created_at'),
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
    priority: 0.7,
  }))

  return [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'daily' },
    { url: `${BASE_URL}/tools`, priority: 0.9, changeFrequency: 'daily' },
    { url: `${BASE_URL}/submit`, priority: 0.5, changeFrequency: 'monthly' },
    ...categoryUrls,
    ...toolUrls,
  ]
}
