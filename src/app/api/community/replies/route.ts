import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Please login first' }, { status: 401 })
  }

  const { topicId, content } = await req.json()

  if (!topicId || !content?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const admin = await createAdminClient()

  const { data: communityUser } = await admin
    .from('community_users')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (!communityUser) {
    return NextResponse.json({ error: 'Community profile not found' }, { status: 404 })
  }

  const { data: reply, error } = await admin
    .from('replies')
    .insert({ topic_id: topicId, user_id: communityUser.id, content: content.trim() })
    .select(`*, user:community_users(id, username, avatar_url)`)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to post reply' }, { status: 500 })
  }

  return NextResponse.json({ reply })
}
