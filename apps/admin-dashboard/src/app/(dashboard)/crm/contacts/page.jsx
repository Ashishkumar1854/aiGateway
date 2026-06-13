'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'

export default function ContactSubmissionsPage() {
  const [leads, setLeads] = useState([])
  const [meta, setMeta] = useState({ total: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/api/v1/crm/leads?source=website_contact&limit=50&search=${search}`)
      setLeads(res.data || [])
      setMeta(res.meta || { total: 0 })
    } catch (err) {
      console.error('Failed to load contacts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [search])

  const STATUS_BADGE = {
    COLD: 'bg-slate-100 text-slate-600',
    WARM: 'bg-orange-100 text-orange-700',
    QUALIFIED: 'bg-blue-100 text-blue-700',
    PROPOSAL: 'bg-purple-100 text-purple-700',
    WON: 'bg-green-100 text-green-700',
    LOST: 'bg-red-100 text-red-700',
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Contact Form Submissions"
        subtitle={`${meta.total} inquiries received from the public website contact form`}
      />

      <input
        type="text"
        placeholder="Search by name, company or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
      />

      {loading ? (
        <LoadingSpinner />
      ) : leads.length === 0 ? (
        <EmptyState
          title="No contact form submissions yet"
          description="When visitors fill the public site contact form, they'll appear here as CRM leads with source: website_contact."
          icon="💬"
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-500">Company / Name</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Email</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Message</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">CRM</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{lead.companyName || '—'}</p>
                    <p className="text-xs text-slate-400">{lead.contactName}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    <a href={`mailto:${lead.email}`} className="hover:underline text-indigo-600">{lead.email}</a>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 max-w-xs">
                    <p className="line-clamp-2">{lead.message || '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_BADGE[lead.status] || 'bg-slate-100 text-slate-600'}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {new Date(lead.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </td>
                  <td className="px-4 py-3">
                    <a href={`/crm/leads/${lead.id}`} className="text-xs font-bold text-slate-900 hover:underline">View Lead →</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
