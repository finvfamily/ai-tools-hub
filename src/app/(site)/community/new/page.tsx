import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getNodes, getCommunityUser } from '@/lib/queries/community'
import { NewTopicForm } from '@/components/new-topic-form'
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

  if (!user) {
    redirect('/api/community/auth')
  }

  const { data: communityUser } = await getCommunityUser(user.id)
  if (!communityUser) {
    redirect('/api/community/auth')
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
