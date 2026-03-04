'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-white">Admin Login</h1>
            <p className="text-sm text-white/40 mt-1">AI Tools Hub</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}
          className="glass-card rounded-2xl p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-white/60">Email</label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20
                focus:border-violet-500/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/60">Password</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20
                focus:border-violet-500/50"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <Button type="submit" disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white rounded-xl h-10">
            {loading
              ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</span>
              : 'Sign In'
            }
          </Button>
        </form>
      </div>
    </div>
  )
}
