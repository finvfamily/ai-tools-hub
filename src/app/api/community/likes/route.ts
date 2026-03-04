import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Please login first' }, { status: 401 })
  }

  const { targetId, targetType } = await req.json()

  const admin = await createAdminClient()
  const { data: communityUser } = await admin
    .from('community_users')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (!communityUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Toggle like
  const { data: existing } = await admin
    .from('likes')
    .select('user_id')
    .eq('user_id', communityUser.id)
    .eq('target_id', targetId)
    .single()

  const table = targetType === 'topic' ? 'topics' : 'replies'

  if (existing) {
    await admin.from('likes').delete()
      .eq('user_id', communityUser.id).eq('target_id', targetId)
    await admin.rpc('decrement_like_count', { row_id: targetId, row_table: table })
    return NextResponse.json({ liked: false })
  } else {
    await admin.from('likes').insert({
      user_id: communityUser.id, target_id: targetId, target_type: targetType
    })
    await admin.rpc('increment_like_count', { row_id: targetId, row_table: table })
    return NextResponse.json({ liked: true })
  }
}
