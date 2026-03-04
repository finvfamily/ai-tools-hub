import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Please login first' }, { status: 401 })
  }

  const { title, content, nodeId } = await req.json()

  if (!title?.trim() || !content?.trim() || !nodeId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (title.length > 100) {
    return NextResponse.json({ error: 'Title too long (max 100 chars)' }, { status: 400 })
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

  const { data: topic, error } = await admin
    .from('topics')
    .insert({
      title: title.trim(),
      content: content.trim(),
      node_id: nodeId,
      user_id: communityUser.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 })
  }

  return NextResponse.json({ topic })
}
