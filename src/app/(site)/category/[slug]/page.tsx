import { notFound } from 'next/navigation'
import { redirect } from 'next/navigation'
import { getCategoryBySlug } from '@/lib/queries/categories'

interface Props {
  params: Promise<{ slug: string }>
}

// /category/writing → /tools?category=writing
export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const { data: category } = await getCategoryBySlug(slug)

  if (!category) notFound()

  redirect(`/tools?category=${slug}`)
}
