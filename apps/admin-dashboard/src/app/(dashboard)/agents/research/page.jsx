'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'

export default function ResearchAgentPage() {
  const [tasks, setTasks] = useState([])
  const [meta, setMeta] = useState({ total: 0 })
  const [loading, setLoading] = useState(true)
  const [triggerForm, setTriggerForm] = useState({ industry: 'fitness', location: 'Mumbai', count: 5, use_mock: true })
  const [triggerLoading, setTriggerLoading] = useState(false)
  const [triggerResult, setTriggerResult] = useState(null)

  const load = () => {
    api.get('/api/v1/agents/tasks?type=LEAD_RESEARCH&limit=30')
      .then(res => { setTasks(res.data || []); setMeta(res.meta || { total: 0 }) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleRun = async (e) => {
    e.preventDefault()
    setTriggerLoading(true)
    setTriggerResult(null)
    try {
      const res = await api.post('/api/v1/internal/lead-research', triggerForm)
      setTriggerResult(res.data)
      load()
    } catch (err) {
      setTriggerResult({ error: err.message })
    } finally {
      setTriggerLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Lead Research Agent"
        subtitle="AI agent that auto-discovers and scores potential leads. Runs SERP scraping + company enrichment."
      />

      {/* Trigger Panel */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">🔍 Run Lead Research Job</h3>
        <form onSubmit={handleRun} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Industry</label>
            <input type="text" value={triggerForm.industry}
              onChange={e => setTriggerForm(p => ({ ...p, industry: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Location</label>
            <input type="text" value={triggerForm.location}
              onChange={e => setTriggerForm(p => ({ ...p, location: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Count</label>
            <input type="number" min="1" max="20" value={triggerForm.count}
              onChange={e => setTriggerForm(p => ({ ...p, count: parseInt(e.target.value) }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={triggerLoading}
              className="w-full rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-2 text-sm transition-colors">
              {triggerLoading ? 'Running...' : '▶ Run Agent'}
            </button>
          </div>
        </form>
        {triggerResult && !triggerResult.error && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-xs text-green-800">
            ✅ Research job started. Leads will appear in the task queue for approval.
          </div>
        )}
        {triggerResult?.error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
            ❌ {triggerResult.error}
          </div>
        )}
      </div>

      {/* Recent Research Tasks */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-4">Recent Research Tasks ({meta.total})</h3>
        {loading ? <LoadingSpinner /> : tasks.length === 0 ? (
          <EmptyState title="No research tasks yet" description="Run a research job above to start discovering leads." icon="🔍" />
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{task.lead?.companyName || 'Research Task'}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{new Date(task.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                  task.status === 'AWAITING_APPROVAL' ? 'bg-yellow-100 text-yellow-700' :
                  task.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                }`}>{task.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
