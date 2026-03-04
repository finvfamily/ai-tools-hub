import { createServerClient } from '@/lib/supabase/server'
import { getNodes, getCommunityUser } from '@/lib/queries/community'
import { NewTopicForm } from '@/components/new-topic-form'
import { Github } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Topic — Community',
}

interface Props {
  searchParams: Promise<{ node?: string }>
}

export default async function NewTopicPage({ searchParams }: Props) {
  const { node: nodeSlug } = await searchParams

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Show login required UI — never force-redirect (that looks like an error)
  if (!user) {
    const next = nodeSlug ? `/community/new?node=${nodeSlug}` : '/community/new'
    return <LoginRequired next={next} />
  }

  const { data: communityUser } = await getCommunityUser(user.id)

  // Logged in via GitHub but community_users record missing — show login again
  if (!communityUser) {
    const next = nodeSlug ? `/community/new?node=${nodeSlug}` : '/community/new'
    return <LoginRequired next={next} />
  }

  const { data: nodes } = await getNodes()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <NewTopicForm
        nodes={nodes ?? []}
        defaultNode={nodeSlug}
        communityUser={communityUser}
      />
    </div>
  )
}

function LoginRequired({ next }: { next: string }) {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="glass-card rounded-2xl p-8 space-y-5">
        <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center mx-auto">
          <Github className="w-6 h-6 text-violet-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white">Sign in to post</h1>
          <p className="text-sm text-white/50">
            Login with your GitHub account to join the discussion.
          </p>
        </div>
        <Button asChild className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl gap-2 w-full">
          <a href={`/api/community/auth?next=${encodeURIComponent(next)}`}>
            <Github className="w-4 h-4" />
            Continue with GitHub
          </a>
        </Button>
        <Button asChild variant="ghost" className="text-white/40 hover:text-white w-full">
          <Link href="/community">Back to Community</Link>
        </Button>
      </div>
    </div>
  )
}
