import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // Must redirect first, then set cookies on the response object
  const response = NextResponse.redirect(new URL('/community', origin))

  if (!code) return response

  // Use request/response cookie pattern — required in Route Handlers
  // (cookies() from next/headers silently fails here)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)

  if (!session?.user) return response

  // Create community_users record directly here (internal fetch won't have cookies)
  const user = session.user
  const admin = await createAdminClient()

  const { data: existing } = await admin
    .from('community_users')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (!existing) {
    const githubUsername =
      user.user_metadata?.user_name ??
      user.user_metadata?.preferred_username ??
      `user_${user.id.slice(0, 8)}`

    const { data: conflict } = await admin
      .from('community_users')
      .select('id')
      .eq('username', githubUsername)
      .single()

    const username = conflict ? `${githubUsername}_${user.id.slice(0, 4)}` : githubUsername

    await admin.from('community_users').insert({
      auth_id: user.id,
      username,
      avatar_url: user.user_metadata?.avatar_url ?? null,
      github_url: user.user_metadata?.html_url ?? null,
    })
  }

  return response
}
