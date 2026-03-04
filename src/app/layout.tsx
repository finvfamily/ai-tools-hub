import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'AI Tools Hub — Discover the Best AI Tools',
    template: '%s | AI Tools Hub',
  },
  description:
    'Discover, explore and submit the best AI tools. Curated directory of AI applications for productivity, writing, coding, design and more.',
  keywords: ['AI tools', 'artificial intelligence', 'AI apps', 'AI directory'],
  openGraph: {
    type: 'website',
    siteName: 'AI Tools Hub',
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
