import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

function makeSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, websiteUrl, description, categoryId, pricingType, email, thumbnailUrl } = body

    if (!name || !websiteUrl || !description || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!websiteUrl.startsWith('http')) {
      return NextResponse.json({ error: 'Invalid website URL' }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // Check duplicate URL
    const { data: existing } = await supabase
      .from('tools')
      .select('id')
      .eq('website_url', websiteUrl)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'This tool has already been submitted' }, { status: 409 })
    }

    // Ensure unique slug
    let slug = makeSlug(name)
    const { data: slugConflict } = await supabase
      .from('tools')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (slugConflict) {
      slug = `${slug}-${Date.now().toString(36)}`
    }

    const { data: tool, error } = await supabase
      .from('tools')
      .insert({
        name: name.trim(),
        slug,
        website_url: websiteUrl.trim(),
        description: description.trim(),
        category_id: categoryId || null,
        pricing_type: pricingType || null,
        thumbnail_url: thumbnailUrl || null,
        submitted_by: email.trim(),
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
    }

    await supabase.from('submissions').insert({
      tool_id: tool.id,
      email: email.trim(),
      status: 'pending',
    })

    return NextResponse.json({ success: true, id: tool.id })
  } catch (err) {
    console.error('Submit error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
