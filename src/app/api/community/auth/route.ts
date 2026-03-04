import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

// Called after GitHub OAuth callback to ensure community_users record exists
export async function POST() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // community_users is now created directly in the callback route
  return NextResponse.json({ ok: true })
}

// GitHub OAuth login — accepts ?next= to redirect back after login
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url)
  const next = searchParams.get('next') ?? '/community'

  const supabase = await createServerClient()

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

  // Store the post-login destination in a short-lived cookie
  const response = NextResponse.redirect(data.url)
  response.cookies.set('community_next', next, {
    httpOnly: true,
    maxAge: 300, // 5 minutes
    path: '/',
    sameSite: 'lax',
  })
  return response
}
