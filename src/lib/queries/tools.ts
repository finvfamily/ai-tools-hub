import { createServerClient } from '@/lib/supabase/server'

const TOOL_SELECT = `
  *,
  category:categories(name, slug),
  tool_tags(tag:tags(name, slug))
`

export async function getApprovedTools({
  category,
  pricing,
  search,
  page = 1,
  limit = 24,
}: {
  category?: string
  pricing?: string
  search?: string
  page?: number
  limit?: number
} = {}) {
  const supabase = await createServerClient()
  const offset = (page - 1) * limit

  let query = supabase
    .from('tools')
    .select(TOOL_SELECT, { count: 'exact' })
    .eq('status', 'approved')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (pricing) query = query.eq('pricing_type', pricing)
  if (search)  query = query.ilike('name', `%${search}%`)

  return query
}

export async function getFeaturedTools(limit = 6) {
  const supabase = await createServerClient()

  return supabase
    .from('tools')
    .select(TOOL_SELECT)
    .eq('status', 'approved')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)
}

export async function getToolBySlug(slug: string) {
  const supabase = await createServerClient()

  await supabase.rpc('increment_view_count', { tool_slug: slug }).maybeSingle()

  return supabase
    .from('tools')
    .select(TOOL_SELECT)
    .eq('slug', slug)
    .eq('status', 'approved')
    .single()
}

export async function getRelatedTools(categoryId: string, excludeSlug: string, limit = 6) {
  const supabase = await createServerClient()

  return supabase
    .from('tools')
    .select(TOOL_SELECT)
    .eq('status', 'approved')
    .eq('category_id', categoryId)
    .neq('slug', excludeSlug)
    .limit(limit)
}

export async function getToolsCount() {
  const supabase = await createServerClient()
  const { count } = await supabase
    .from('tools')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')
  return count ?? 0
}
