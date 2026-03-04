import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, PenSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TopicCard } from '@/components/topic-card'
import { getNodeBySlug, getTopicsByNode, getNodes } from '@/lib/queries/community'

export const revalidate = 60

interface Props {
  params: Promise<{ node: string }>
}

export async function generateMetadata({ params }: Props) {
  const { node } = await params
  const { data } = await getNodeBySlug(node)
  if (!data) return {}
  return {
    title: `${data.name} — Community`,
    description: data.description,
    alternates: { canonical: `/community/${node}` },
    openGraph: {
      title: `${data.name} — AI Tools Hub Community`,
      description: data.description,
      images: [{ url: '/api/og/home', width: 1200, height: 630 }],
    },
  }
}

export default async function NodePage({ params }: Props) {
  const { node: nodeSlug } = await params
  const [{ data: node }, { data: topics }, { data: nodes }] = await Promise.all([
    getNodeBySlug(nodeSlug),
    getTopicsByNode(nodeSlug),
    getNodes(),
  ])

  if (!node) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid lg:grid-cols-[1fr_280px] gap-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/community" className="text-white/40 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{node.icon}</span>
                  <h1 className="text-2xl font-bold text-white">{node.name}</h1>
                </div>
                <p className="text-sm text-white/40 mt-0.5">{node.description}</p>
              </div>
            </div>
            <Button asChild
              className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl gap-2">
              <Link href={`/community/new?node=${nodeSlug}`}>
                <PenSquare className="w-4 h-4" /> New Topic
              </Link>
            </Button>
          </div>

          {/* Node tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            <Link href="/community"
              className="shrink-0 px-4 py-1.5 rounded-full text-sm glass-card
                text-white/50 hover:text-white transition-colors">
              All
            </Link>
            {nodes?.map(n => (
              <Link key={n.id} href={`/community/${n.slug}`}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm whitespace-nowrap
                  transition-colors ${n.slug === nodeSlug
                    ? 'bg-violet-600 text-white'
                    : 'glass-card text-white/50 hover:text-white'
                  }`}>
                {n.icon} {n.name}
              </Link>
            ))}
          </div>

          {/* Topics */}
          <div className="glass-card rounded-2xl px-4 py-2">
            {topics && topics.length > 0 ? (
              topics.map(topic => <TopicCard key={topic.id} topic={topic as any} />)
            ) : (
              <div className="text-center py-16 text-white/30">
                <p>No topics in this node yet</p>
                <Link href={`/community/new?node=${nodeSlug}`}
                  className="text-violet-400 hover:text-violet-300 text-sm mt-2 inline-block">
                  Start the first discussion →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
              All Nodes
            </h2>
            {nodes?.map(n => (
              <Link key={n.id} href={`/community/${n.slug}`}
                className={`flex items-center justify-between group ${
                  n.slug === nodeSlug ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                } transition-opacity`}>
                <div className="flex items-center gap-2">
                  <span>{n.icon}</span>
                  <span className={`text-sm ${n.slug === nodeSlug ? 'text-violet-400 font-medium' : 'text-white/70'}`}>
                    {n.name}
                  </span>
                </div>
                <span className="text-xs text-white/30">{n.topic_count}</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
