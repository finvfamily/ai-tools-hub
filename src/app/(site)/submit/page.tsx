import type { Metadata } from 'next'
import { SubmitForm } from '@/components/submit-form'
import { getAllCategories } from '@/lib/queries/categories'

export const metadata: Metadata = {
  title: 'Submit a Tool',
  description: 'Submit your AI tool to be featured in our curated directory.',
}

export default async function SubmitPage() {
  const { data: categories } = await getAllCategories()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Submit an AI Tool</h1>
        <p className="text-white/50">
          Know a great AI tool? Submit it for review. We&apos;ll verify and add it to the directory.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <SubmitForm categories={categories ?? []} />
      </div>

      <div className="text-sm text-white/30 space-y-1">
        <p>• Tools are manually reviewed before being published</p>
        <p>• We&apos;ll notify you by email once approved or rejected</p>
        <p>• Spam, duplicates, or low-quality submissions will be rejected</p>
      </div>
    </div>
  )
}
