'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { KanbanColumn } from '@/components/crm/KanbanColumn'
import { LeadForm } from '@/components/crm/LeadForm'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PageHeader } from '@/components/shared/PageHeader'

export default function CRMPage() {
  const [pipeline, setPipeline] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    try {
      const res = await api.get('/api/v1/crm/pipeline')
      setPipeline(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleLeadClick = (lead) => {
    window.location.href = `/crm/leads/${lead.id}`
  }

  const totalLeads = pipeline.reduce((sum, col) => sum + col.count, 0)
  const wonLeads = pipeline.find(c => c.status === 'WON')?.count || 0
  const qualifiedLeads = pipeline.find(c => c.status === 'QUALIFIED')?.count || 0

  return (
    <div className="p-6">
      <PageHeader
        title="CRM Pipeline"
        subtitle={`${totalLeads} total leads`}
        action={
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
          >
            + Add Lead
          </button>
        }
      />

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Leads', value: totalLeads, icon: '🎯' },
          { label: 'Qualified', value: qualifiedLeads, icon: '✅' },
          { label: 'Won', value: wonLeads, icon: '🎉' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban board */}
      {loading ? <LoadingSpinner /> : (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {pipeline.map((col) => (
            <KanbanColumn
              key={col.status}
              status={col.status}
              count={col.count}
              leads={col.leads}
              onLeadClick={handleLeadClick}
            />
          ))}
        </div>
      )}

      {/* Add Lead Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl mx-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Add New Lead</h2>
            <LeadForm
              onSuccess={() => { setShowForm(false); load() }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}