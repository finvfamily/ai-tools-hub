import Link from 'next/link'
import { Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-white">AI Tools Hub</span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-white/40">
            <Link href="/tools" className="hover:text-white/70 transition-colors">Browse</Link>
            <Link href="/submit" className="hover:text-white/70 transition-colors">Submit Tool</Link>
            <a
              href="https://github.com/finvfamily/ai-tools-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition-colors"
            >
              GitHub
            </a>
          </nav>

          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} AI Tools Hub. Open source.
          </p>
        </div>
      </div>
    </footer>
  )
}
