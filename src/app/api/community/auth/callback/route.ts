import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // Read the post-login destination from the cookie set in the auth route
  const rawNext = request.cookies.get('community_next')?.value ?? '/community'
  const destination = decodeURIComponent(rawNext)
  const response = NextResponse.redirect(new URL(destination, origin))

  // Clear the cookie
  response.cookies.set('community_next', '', { maxAge: 0, path: '/' })

  if (!code) return response

  // Use request/response cookie pattern — required in Route Handlers
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
