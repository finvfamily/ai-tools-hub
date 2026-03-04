import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ai-tools-hub-xi.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'AI Tools Hub — Discover the Best AI Tools',
    template: '%s | AI Tools Hub',
  },
  description:
    'Discover, explore and submit the best AI tools. Curated directory of AI applications for productivity, writing, coding, design and more.',
  keywords: ['AI tools', 'artificial intelligence', 'AI apps', 'AI directory', 'best AI tools 2025'],
  openGraph: {
    type: 'website',
    siteName: 'AI Tools Hub',
    url: BASE_URL,
    images: [{ url: '/api/og/home', width: 1200, height: 630, alt: 'AI Tools Hub' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/api/og/home'],
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.variable} font-sans antialiased bg-[#0a0a0f] text-white overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}
