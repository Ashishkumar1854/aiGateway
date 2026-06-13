'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PageHeader } from '@/components/shared/PageHeader'

export default function OrchestratorPage() {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [form, setForm] = useState({ industry: 'fitness', location: 'Mumbai', count: 3 })
  const [result, setResult] = useState(null)
  const [recentLeads, setRecentLeads] = useState([])
  const [leadsLoading, setLeadsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/api/v1/agents/stats'),
      api.get('/api/v1/crm/leads?limit=10'),
    ])
      .then(([statsRes, leadsRes]) => {
        setStats(statsRes.data)
        setRecentLeads(leadsRes.data || [])
      })
      .catch(console.error)
      .finally(() => setLeadsLoading(false))
  }, [])

  const handleBulkOrchestration = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await api.post('/api/v1/internal/orchestrator/bulk', form)
      setResult(res.data?.data || res.data)
    } catch (err) {
      setResult({ error: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleSingleWorkflow = async (leadId) => {
    try {
      await api.post(`/api/v1/workflows/lead/${leadId}`)
      alert('Workflow triggered for lead.')
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Orchestrator — Bulk Workflow Trigger"
        subtitle="Trigger the full AI pipeline: Research → Email Draft → Meeting Invite. All outputs require approval."
      />

      {/* Stats bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Pending Approval', value: stats.pending ?? 0, color: 'text-yellow-600' },
            { label: 'Approved', value: stats.approved ?? 0, color: 'text-blue-600' },
            { label: 'Completed', value: stats.completed ?? 0, color: 'text-green-600' },
            { label: 'Failed', value: stats.failed ?? 0, color: 'text-red-600' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center">
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Bulk trigger */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">⚙️ Bulk Research + Outreach Job</h3>
        <p className="text-xs text-slate-500">Searches for companies in a niche, enriches their profiles, and drafts personalised email pitches — all waiting for your approval.</p>

        <form onSubmit={handleBulkOrchestration} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Industry</label>
            <input type="text" value={form.industry}
              onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Location</label>
            <input type="text" value={form.location}
              onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Lead Count</label>
            <input type="number" min="1" max="10" value={form.count}
              onChange={e => setForm(p => ({ ...p, count: parseInt(e.target.value) }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-2 text-sm transition-colors">
              {loading ? '🔄 Running...' : '🚀 Launch Bulk Job'}
            </button>
          </div>
        </form>

        {result && !result.error && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-xs text-green-800">
            ✅ Bulk orchestration started — {result.tasksCreated || 'multiple'} tasks created and awaiting your approval in the Tasks Queue.
          </div>
        )}
        {result?.error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
            ❌ {result.error}
          </div>
        )}
      </div>

      {/* Single-lead workflow table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Run Workflow on Existing Lead</h3>
        {leadsLoading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-3 py-2 text-left font-medium text-slate-500">Company</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-500">Contact</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-500">Status</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map(lead => (
                  <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium text-slate-800">{lead.companyName}</td>
                    <td className="px-3 py-2 text-slate-500">{lead.contactName}</td>
                    <td className="px-3 py-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">{lead.status}</span>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleSingleWorkflow(lead.id)}
                        className="text-[10px] font-bold text-indigo-600 hover:underline"
                      >
                        Run Workflow →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
