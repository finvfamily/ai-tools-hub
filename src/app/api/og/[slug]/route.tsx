import { ImageResponse } from 'next/og'
import { createServerClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerClient()

  const { data: tool } = await supabase
    .from('tools')
    .select('name, description, pricing_type')
    .eq('slug', slug)
    .eq('status', 'approved')
    .single()

  const name = tool?.name ?? 'AI Tool'
  const description = tool?.description ?? 'Discover this AI tool on AI Tools Hub'
  const pricing = tool?.pricing_type ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0a0a0f 0%, #0f0a1e 100%)',
          padding: 60,
          fontFamily: 'sans-serif',
        }}
      >
        {/* Glow */}
        <div style={{
          position: 'absolute', top: -100, left: '30%',
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'rgba(139,92,246,0.15)',
          filter: 'blur(80px)',
        }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: '#7c3aed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontSize: 18 }}>⚡</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18 }}>AI Tools Hub</span>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {pricing && (
            <span style={{
              color: '#a78bfa', fontSize: 16,
              background: 'rgba(167,139,250,0.1)',
              padding: '4px 12px', borderRadius: 999,
              width: 'fit-content', border: '1px solid rgba(167,139,250,0.3)',
              textTransform: 'capitalize',
            }}>{pricing}</span>
          )}
          <div style={{
            fontSize: 56, fontWeight: 700, color: 'white',
            lineHeight: 1.1, letterSpacing: -1,
          }}>{name}</div>
          <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
            {description.slice(0, 80)}{description.length > 80 ? '...' : ''}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
