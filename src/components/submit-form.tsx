'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2, Link2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Category } from '@/types'

interface SubmitFormProps {
  categories: Category[]
}

type FormData = {
  name: string
  websiteUrl: string
  description: string
  categoryId: string
  pricingType: string
  email: string
}

type Step = 1 | 2 | 3

export function SubmitForm({ categories }: SubmitFormProps) {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<FormData>({
    name: '', websiteUrl: '', description: '',
    categoryId: '', pricingType: '', email: '',
  })

  function update(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  async function fetchPreview(url: string) {
    if (!url.startsWith('http')) return
    setPreviewLoading(true)
    try {
      const res = await fetch(
        `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false`
      )
      const json = await res.json()
      setPreviewUrl(json.data?.screenshot?.url ?? null)
    } catch {
      setPreviewUrl(null)
    } finally {
      setPreviewLoading(false)
    }
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, thumbnailUrl: previewUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 space-y-4"
      >
        <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto" />
        <h2 className="text-xl font-semibold text-white">Submitted Successfully!</h2>
        <p className="text-white/50 text-sm">
          We&apos;ll review your submission and notify you at <strong>{form.email}</strong>
        </p>
        <Button onClick={() => router.push('/')}
          variant="outline" className="border-white/10 text-white/70 hover:text-white mt-2">
          Back to Home
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {([1, 2, 3] as Step[]).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium
              transition-colors ${step >= s
                ? 'bg-violet-600 text-white'
                : 'bg-white/10 text-white/30'}`}>
              {s}
            </div>
            {s < 3 && <div className={`h-px w-8 transition-colors ${step > s ? 'bg-violet-600' : 'bg-white/10'}`} />}
          </div>
        ))}
        <span className="text-xs text-white/30 ml-2">
          {step === 1 && 'Basic Info'}
          {step === 2 && 'Details'}
          {step === 3 && 'Contact'}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div key="step1"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-white/60">Tool Name *</label>
              <Input
                value={form.name}
                onChange={e => update('name', e.target.value)}
                placeholder="e.g. ChatGPT, Midjourney"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20
                  focus:border-violet-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/60">Website URL *</label>
              <div className="relative">
                <Link2 className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                <Input
                  value={form.websiteUrl}
                  onChange={e => update('websiteUrl', e.target.value)}
                  onBlur={() => fetchPreview(form.websiteUrl)}
                  placeholder="https://example.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20
                    focus:border-violet-500/50 pl-10"
                />
              </div>

              {/* Screenshot preview */}
              {previewLoading && (
                <div className="flex items-center gap-2 text-xs text-white/30 mt-2">
                  <Loader2 className="w-3 h-3 animate-spin" /> Fetching screenshot...
                </div>
              )}
              {previewUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl overflow-hidden border border-white/10 aspect-video mt-2">
                  <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/60">
                Description * <span className="text-white/30">({form.description.length}/100)</span>
              </label>
              <textarea
                value={form.description}
                onChange={e => update('description', e.target.value.slice(0, 100))}
                placeholder="One sentence describing what this tool does..."
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10
                  text-white placeholder:text-white/20 text-sm outline-none resize-none
                  focus:border-violet-500/50 transition-colors"
              />
            </div>

            <Button
              onClick={() => {
                if (!form.name || !form.websiteUrl || !form.description) {
                  setError('Please fill in all required fields')
                  return
                }
                setStep(2)
              }}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white rounded-xl">
              Next →
            </Button>
          </motion.div>
        )}

        {/* Step 2: Category + Pricing */}
        {step === 2 && (
          <motion.div key="step2"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-white/60">Category *</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => update('categoryId', cat.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm
                      border transition-colors text-left
                      ${form.categoryId === cat.id
                        ? 'border-violet-500 bg-violet-500/10 text-white'
                        : 'border-white/10 bg-white/5 text-white/50 hover:text-white/70'
                      }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/60">Pricing *</label>
              <div className="flex gap-2">
                {(['free', 'freemium', 'paid'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => update('pricingType', p)}
                    className={`flex-1 py-2.5 rounded-xl text-sm border capitalize transition-colors
                      ${form.pricingType === p
                        ? 'border-violet-500 bg-violet-500/10 text-white'
                        : 'border-white/10 bg-white/5 text-white/50 hover:text-white/70'
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep(1)} variant="outline"
                className="flex-1 border-white/10 text-white/60 hover:text-white">
                ← Back
              </Button>
              <Button
                onClick={() => {
                  if (!form.categoryId || !form.pricingType) {
                    setError('Please select category and pricing')
                    return
                  }
                  setStep(3)
                }}
                className="flex-1 bg-violet-600 hover:bg-violet-500 text-white rounded-xl">
                Next →
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Contact + Submit */}
        {step === 3 && (
          <motion.div key="step3"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-white/60">Your Email *</label>
              <Input
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                placeholder="you@example.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20
                  focus:border-violet-500/50"
              />
              <p className="text-xs text-white/30">
                We&apos;ll notify you when your submission is reviewed.
              </p>
            </div>

            {/* Summary */}
            <div className="glass-card rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-white/40">
                <span>Tool</span><span className="text-white">{form.name}</span>
              </div>
              <div className="flex justify-between text-white/40">
                <span>URL</span>
                <span className="text-white truncate max-w-[180px]">{form.websiteUrl}</span>
              </div>
              <div className="flex justify-between text-white/40">
                <span>Pricing</span>
                <span className="text-white capitalize">{form.pricingType}</span>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <div className="flex gap-3">
              <Button onClick={() => setStep(2)} variant="outline"
                className="flex-1 border-white/10 text-white/60 hover:text-white">
                ← Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !form.email}
                className="flex-1 bg-violet-600 hover:bg-violet-500 text-white rounded-xl">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </span>
                ) : 'Submit Tool'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && step !== 3 && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}
    </div>
  )
}
