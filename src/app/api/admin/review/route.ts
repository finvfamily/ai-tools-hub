import { NextResponse } from 'next/server'
import { createAdminClient, createServerClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  // Verify admin session
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, status } = await req.json()
  if (!id || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const admin = await createAdminClient()

  const { error } = await admin
    .from('tools')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  // Update submission record
  await admin
    .from('submissions')
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq('tool_id', id)

  return NextResponse.json({ success: true })
}
