export type PricingType = 'free' | 'freemium' | 'paid'
export type ToolStatus = 'pending' | 'approved' | 'rejected'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  sort_order: number
  created_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface Tool {
  id: string
  name: string
  slug: string
  website_url: string
  description: string
  content: string | null
  thumbnail_url: string | null
  category_id: string | null
  pricing_type: PricingType | null
  status: ToolStatus
  is_featured: boolean
  view_count: number
  submitted_by: string | null
  created_at: string
  updated_at: string
  // joined fields
  category?: Pick<Category, 'name' | 'slug'> | null
  tool_tags?: { tag: Pick<Tag, 'name' | 'slug'> }[]
}

export interface Submission {
  id: string
  tool_id: string
  email: string | null
  status: string
  reject_reason: string | null
  reviewed_at: string | null
  created_at: string
}

export interface ToolWithRelations extends Tool {
  category: Pick<Category, 'name' | 'slug'> | null
  tool_tags: { tag: Pick<Tag, 'name' | 'slug'> }[]
}
