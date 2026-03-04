import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

// Called after GitHub OAuth callback to ensure community_users record exists
export async function POST() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = await createAdminClient()

  // Check if community user already exists
  const { data: existing } = await admin
    .from('community_users')
    .select('id, username')
    .eq('auth_id', user.id)
    .single()

  if (existing) {
    return NextResponse.json({ user: existing })
  }

  // Create community user from GitHub OAuth data
  const githubUsername = user.user_metadata?.user_name
    || user.user_metadata?.preferred_username
    || `user_${user.id.slice(0, 8)}`

  const avatarUrl = user.user_metadata?.avatar_url ?? null
  const githubUrl = user.user_metadata?.html_url ?? null

  // Ensure unique username
  let username = githubUsername
  const { data: conflict } = await admin
    .from('community_users')
    .select('id')
    .eq('username', username)
    .single()

  if (conflict) {
    username = `${username}_${user.id.slice(0, 4)}`
  }

  const { data: newUser, error } = await admin
    .from('community_users')
    .insert({ auth_id: user.id, username, avatar_url: avatarUrl, github_url: githubUrl })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }

  return NextResponse.json({ user: newUser })
}

// GitHub OAuth login
export async function GET(req: Request) {
  const supabase = await createServerClient()
  const origin = new URL(req.url).origin

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${origin}/api/community/auth/callback`,
      scopes: 'read:user',
    },
  })

  if (error || !data.url) {
    return NextResponse.redirect(new URL('/community', origin))
  }

  return NextResponse.redirect(data.url)
}
