'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { LeadForm } from '@/components/crm/LeadForm'

const STATUS_BADGE = {
  COLD: 'bg-slate-100 text-slate-600',
  WARM: 'bg-orange-100 text-orange-700',
  QUALIFIED: 'bg-blue-100 text-blue-700',
  PROPOSAL: 'bg-purple-100 text-purple-700',
  NEGOTIATION: 'bg-yellow-100 text-yellow-700',
  WON: 'bg-green-100 text-green-700',
  LOST: 'bg-red-100 text-red-700',
}

const SCORE_COLOR = (score) => {
  if (score >= 80) return 'text-green-600 font-bold'
  if (score >= 60) return 'text-yellow-600 font-bold'
  return 'text-slate-400'
}

const SOURCE_BADGES = {
  website_contact: { label: '🌐 Website Form', className: 'bg-green-50 text-green-700 border border-green-200' },
  other_services: { label: '💼 Custom Request', className: 'bg-blue-50 text-blue-700 border border-blue-200' },
  lead_research_agent: { label: '🤖 AI Scraper', className: 'bg-orange-50 text-orange-700 border border-orange-200' },
  manual: { label: '✍️ Manual', className: 'bg-slate-50 text-slate-700 border border-slate-200' },
}

export default function LeadsListPage() {
  const [leads, setLeads] = useState([])
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showForm, setShowForm] = useState(false)

  const load = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 15 })
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      const res = await api.get(`/api/v1/crm/leads?${params}`)
      setLeads(res.data)
      setMeta(res.meta)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [search, statusFilter])

  return (
    <div className="p-6">
      <PageHeader
        title="All Leads"
        subtitle={`${meta.total} leads total`}
        action={
          <button onClick={() => setShowForm(true)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            + Add Lead
          </button>
        }
      />

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="text" placeholder="Search leads..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 w-64"
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
          <option value="">All Stages</option>
          {['COLD','WARM','QUALIFIED','PROPOSAL','NEGOTIATION','WON','LOST'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? <LoadingSpinner /> : leads.length === 0 ? (
        <EmptyState title="No leads found" description="Add your first lead or adjust filters" icon="🎯" />
      ) : (
        <>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Company</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Contact</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Industry</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Stage</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Score</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Source</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500"></th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{lead.companyName}</td>
                    <td className="px-4 py-3 text-slate-500">
                      <div>{lead.contactName || '—'}</div>
                      <div className="text-xs text-slate-400">{lead.email || ''}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{lead.industry || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[lead.status] || ''}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className={`px-4 py-3 ${SCORE_COLOR(lead.score)}`}>{lead.score}</td>
                    <td className="px-4 py-3 text-xs">
                      {(() => {
                        const badge = SOURCE_BADGES[lead.source] || { label: lead.source, className: 'bg-slate-100 text-slate-600 border border-slate-200' }
                        return (
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
                            {badge.label}
                          </span>
                        )
                      })()}
                    </td>
                    <td className="px-4 py-3">
                      <a href={`/crm/leads/${lead.id}`}
                        className="text-xs font-medium text-slate-900 hover:underline">
                        View →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Page {meta.page} of {meta.totalPages} ({meta.total} leads)
              </p>
              <div className="flex gap-2">
                {meta.page > 1 && (
                  <button onClick={() => load(meta.page - 1)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">
                    ← Prev
                  </button>
                )}
                {meta.page < meta.totalPages && (
                  <button onClick={() => load(meta.page + 1)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">
                    Next →
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}

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
