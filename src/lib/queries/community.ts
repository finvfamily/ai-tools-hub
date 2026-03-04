import { createServerClient } from '@/lib/supabase/server'

const USER_SELECT = 'id, username, avatar_url'

export async function getNodes() {
  const supabase = await createServerClient()
  return supabase
    .from('nodes')
    .select('*')
    .order('sort_order')
}

export async function getNodeBySlug(slug: string) {
  const supabase = await createServerClient()
  return supabase
    .from('nodes')
    .select('*')
    .eq('slug', slug)
    .single()
}

export async function getHotTopics(limit = 20) {
  const supabase = await createServerClient()
  return supabase
    .from('topics')
    .select(`*, node:nodes(name, slug), user:community_users(${USER_SELECT})`)
    .order('like_count', { ascending: false })
    .order('reply_count', { ascending: false })
    .limit(limit)
}

export async function getLatestTopics(limit = 30) {
  const supabase = await createServerClient()
  return supabase
    .from('topics')
    .select(`*, node:nodes(name, slug), user:community_users(${USER_SELECT})`)
    .order('last_reply_at', { ascending: false })
    .limit(limit)
}

export async function getTopicsByNode(nodeSlug: string, limit = 30) {
  const supabase = await createServerClient()
  return supabase
    .from('topics')
    .select(`*, node:nodes!inner(name, slug), user:community_users(${USER_SELECT})`)
    .eq('nodes.slug', nodeSlug)
    .order('last_reply_at', { ascending: false })
    .limit(limit)
}

export async function getTopicById(id: string) {
  const supabase = await createServerClient()

  await supabase.rpc('increment_topic_views', { topic_id: id }).maybeSingle()

  return supabase
    .from('topics')
    .select(`*, node:nodes(name, slug), user:community_users(${USER_SELECT})`)
    .eq('id', id)
    .single()
}

export async function getRepliesByTopic(topicId: string) {
  const supabase = await createServerClient()
  return supabase
    .from('replies')
    .select(`*, user:community_users(${USER_SELECT})`)
    .eq('topic_id', topicId)
    .order('floor', { ascending: true })
}

export async function getCommunityUser(authId: string) {
  const supabase = await createServerClient()
  return supabase
    .from('community_users')
    .select('*')
    .eq('auth_id', authId)
    .single()
}

export async function getUserByUsername(username: string) {
  const supabase = await createServerClient()
  return supabase
    .from('community_users')
    .select(`*, topics(id, title, created_at, reply_count, like_count, node:nodes(name, slug))`)
    .eq('username', username)
    .single()
}
