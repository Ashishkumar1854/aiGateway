'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState([])
  const [meta, setMeta] = useState({ total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/v1/subscriptions?limit=20')
      .then((res) => { setSubs(res.data); setMeta(res.meta) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const PLAN_COLOR = {
    STARTER: 'bg-slate-100 text-slate-700',
    PRO: 'bg-blue-100 text-blue-700',
    ENTERPRISE: 'bg-purple-100 text-purple-700',
  }
  const STATUS_COLOR = {
    ACTIVE: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    EXPIRED: 'bg-slate-100 text-slate-500',
    TRIAL: 'bg-yellow-100 text-yellow-700',
  }

  return (
    <div className="p-6">
      <PageHeader title="Subscriptions" subtitle={`${meta.total} total subscriptions`} />
      {loading ? <LoadingSpinner /> : subs.length === 0 ? (
        <EmptyState title="No subscriptions" description="No subscriptions found" icon="💳" />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-500">Client</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Plan</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Expires</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((sub) => (
                <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{sub.client?.companyName || sub.clientId}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PLAN_COLOR[sub.plan] || ''}`}>{sub.plan}</span></td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[sub.status] || ''}`}>{sub.status}</span></td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString() : 'No expiry'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}