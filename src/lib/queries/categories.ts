import { createServerClient } from '@/lib/supabase/server'

export async function getAllCategories() {
  const supabase = await createServerClient()

  return supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createServerClient()

  return supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
}
