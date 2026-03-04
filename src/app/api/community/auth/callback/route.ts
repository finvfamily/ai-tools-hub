import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createServerClient()
    await supabase.auth.exchangeCodeForSession(code)

    // Create community_users record if not exists
    await fetch(`${origin}/api/community/auth`, { method: 'POST' })
  }

  return NextResponse.redirect(new URL('/community', origin))
}
