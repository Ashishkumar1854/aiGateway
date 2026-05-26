'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PageHeader } from '@/components/shared/PageHeader'

const STATUS_COLORS = {
  COLD: 'bg-slate-100 border-slate-200',
  WARM: 'bg-orange-50 border-orange-200',
  QUALIFIED: 'bg-blue-50 border-blue-200',
  PROPOSAL: 'bg-purple-50 border-purple-200',
  NEGOTIATION: 'bg-yellow-50 border-yellow-200',
  WON: 'bg-green-50 border-green-200',
  LOST: 'bg-red-50 border-red-200',
}

const scoreColor = (score) => {
  if (score >= 80) return 'text-green-600 bg-green-50'
  if (score >= 60) return 'text-yellow-600 bg-yellow-50'
  return 'text-slate-500 bg-slate-100'
}

export default function CRMPage() {
  const [pipeline, setPipeline] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/v1/crm/pipeline')
      .then((res) => setPipeline(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="p-6">
      <PageHeader title="CRM Pipeline" subtitle="Lead management kanban board" />
      <div className="flex gap-3 overflow-x-auto pb-4">
        {pipeline.map((col) => (
          <div key={col.status} className="flex-shrink-0 w-64">
            <div className={`rounded-xl border p-3 ${STATUS_COLORS[col.status] || 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-600">{col.status}</h3>
                <span className="text-xs font-semibold text-slate-400">{col.count}</span>
              </div>
              <div className="space-y-2">
                {col.leads.length === 0 ? (
                  <p className="text-center text-xs text-slate-300 py-4">No leads</p>
                ) : col.leads.map((lead) => (
                  <a key={lead.id} href={`/crm/leads/${lead.id}`} className="block rounded-lg bg-white border border-slate-200 p-3 hover:border-slate-400 transition-colors shadow-sm">
                    <p className="text-sm font-medium text-slate-900 truncate">{lead.companyName}</p>
                    {lead.contactName && <p className="text-xs text-slate-400 mt-0.5">{lead.contactName}</p>}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{lead.industry || 'Unknown'}</span>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${scoreColor(lead.score)}`}>{lead.score}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}