import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0a0a0f 0%, #0f0a1e 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Glow */}
        <div style={{
          position: 'absolute', top: -80, left: '25%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'rgba(139,92,246,0.18)', filter: 'blur(100px)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, right: '15%',
          width: 350, height: 350, borderRadius: '50%',
          background: 'rgba(59,130,246,0.12)', filter: 'blur(80px)',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: '#7c3aed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontSize: 26 }}>⚡</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 24 }}>AI Tools Hub</span>
        </div>

        {/* Headline */}
        <div style={{
          fontSize: 64, fontWeight: 800, color: 'white',
          textAlign: 'center', lineHeight: 1.1, letterSpacing: -2,
          maxWidth: 900,
        }}>
          Discover the Best{' '}
          <span style={{ color: '#a78bfa' }}>AI Tools</span>
        </div>

        {/* Sub */}
        <div style={{
          marginTop: 24, fontSize: 24,
          color: 'rgba(255,255,255,0.45)',
          textAlign: 'center', maxWidth: 700, lineHeight: 1.4,
        }}>
          Curated directory of AI apps for productivity, writing, coding &amp; design
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
