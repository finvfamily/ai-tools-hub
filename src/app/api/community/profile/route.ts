import { NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase/server'

export async function PUT(req: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { bio } = await req.json()

  if (typeof bio !== 'string') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const admin = await createAdminClient()
  const { data, error } = await admin
    .from('community_users')
    .update({ bio: bio.trim() || null })
    .eq('auth_id', user.id)
    .select('id, username, bio, avatar_url')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  return NextResponse.json({ user: data })
}
