import { createAdminClient } from '@/lib/supabase/server'
import { AdminToolList } from '@/components/admin-tool-list'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createAdminClient()

  const { data: pending } = await supabase
    .from('tools')
    .select(`*, category:categories(name, slug)`)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  const { count: approvedCount } = await supabase
    .from('tools')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')

  const { count: totalCount } = await supabase
    .from('tools')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Manage tool submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Review', value: pending?.length ?? 0, color: 'text-amber-400' },
          { label: 'Approved', value: approvedCount ?? 0, color: 'text-emerald-400' },
          { label: 'Total Tools', value: totalCount ?? 0, color: 'text-white' },
        ].map(stat => (
          <div key={stat.label} className="glass-card rounded-2xl p-5">
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-white/40 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Pending submissions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Pending Submissions ({pending?.length ?? 0})
        </h2>
        <AdminToolList tools={pending ?? []} />
      </div>
    </div>
  )
}
