'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { StatCard } from '@/components/shared/StatCard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PageHeader } from '@/components/shared/PageHeader'

export default function AgentsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showTrigger, setShowTrigger] = useState(false)
  const [triggerForm, setTriggerForm] = useState({ industry: 'fitness', location: 'Mumbai', count: 5, use_mock: true })
  const [triggerLoading, setTriggerLoading] = useState(false)
  const [triggerResult, setTriggerResult] = useState(null)

  useEffect(() => {
    api.get('/api/v1/agents/stats')
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleRunAgent = async (e) => {
    e.preventDefault()
    setTriggerLoading(true)
    setTriggerResult(null)
    try {
      const res = await api.post('/api/v1/internal/lead-research', triggerForm)
      setTriggerResult(res.data)
    } catch (err) {
      setTriggerResult({ error: err.message })
    } finally {
      setTriggerLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="p-6">
      <PageHeader title="AI Agents" subtitle="Monitor and manage your AI workforce" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 mb-6">
        <StatCard title="Total Tasks" value={stats?.total ?? 0} icon="📋" />
        <StatCard title="Awaiting Approval" value={stats?.pending ?? 0} icon="⏳" color={stats?.pending ? 'warning' : 'default'} />
        <StatCard title="Approved" value={stats?.approved ?? 0} icon="✅" color="success" />
        <StatCard title="Completed" value={stats?.completed ?? 0} icon="🎉" color="success" />
        <StatCard title="Failed" value={stats?.failed ?? 0} icon="❌" color={stats?.failed ? 'danger' : 'default'} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Agent Types</h3>
          <div className="space-y-3">
            {[
              { type: 'Lead Research', icon: '🔍', desc: 'Finds and scores potential leads' },
              { type: 'Email Outreach', icon: '📧', desc: 'Drafts personalized cold emails' },
              { type: 'LinkedIn', icon: '💼', desc: 'LinkedIn connection and messaging' },
              { type: 'Meeting', icon: '📅', desc: 'Qualifies leads and books meetings' },
              { type: 'Orchestrator', icon: '🎯', desc: 'Coordinates all agent workflows' },
            ].map((agent) => (
              <div key={agent.type} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xl">{agent.icon}</span>
                <div>
                  <p className="text-sm font-medium text-slate-900">{agent.type}</p>
                  <p className="text-xs text-slate-400">{agent.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <a href="/agents/tasks" className="flex items-center gap-3 rounded-lg p-3 border border-yellow-200 bg-yellow-50 text-sm font-medium text-yellow-800 hover:bg-yellow-100 transition-colors">
              <span>⏳</span> Review pending tasks ({stats?.pending ?? 0})
              <span className="ml-auto">→</span>
            </a>
            <a href="/agents/logs" className="flex items-center gap-3 rounded-lg p-3 border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
              <span>📋</span> View agent logs
              <span className="ml-auto">→</span>
            </a>
            <button onClick={() => setShowTrigger(true)}
              className="flex items-center gap-3 rounded-lg p-3 border border-indigo-200 bg-indigo-50 text-sm font-medium text-indigo-800 hover:bg-indigo-100 transition-colors w-full text-left">
              <span>🔍</span> Run Lead Research Agent
              <span className="ml-auto">→</span>
            </button>
          </div>
        </div>
      </div>

      {showTrigger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl mx-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">🔍 Run Lead Research Agent</h2>
            <form onSubmit={handleRunAgent} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Industry</label>
                <input value={triggerForm.industry}
                  onChange={e => setTriggerForm({...triggerForm, industry: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Location</label>
                <input value={triggerForm.location}
                  onChange={e => setTriggerForm({...triggerForm, location: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Number of leads</label>
                <input type="number" min={1} max={20} value={triggerForm.count}
                  onChange={e => setTriggerForm({...triggerForm, count: parseInt(e.target.value)})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="useMock" checked={triggerForm.use_mock}
                  onChange={e => setTriggerForm({...triggerForm, use_mock: e.target.checked})} />
                <label htmlFor="useMock" className="text-sm text-slate-600">
                  Use mock data (no internet required)
                </label>
              </div>
              {triggerResult && (
                <div className={`rounded-lg p-3 text-sm ${triggerResult.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                  {triggerResult.error || triggerResult.message}
                  {triggerResult.tasks_created > 0 && (
                    <p className="mt-1 font-medium">✅ {triggerResult.tasks_created} tasks created — check Agent Tasks tab</p>
                  )}
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setShowTrigger(false); setTriggerResult(null) }}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                  Close
                </button>
                <button type="submit" disabled={triggerLoading}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">
                  {triggerLoading ? '🔍 Searching...' : 'Run Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}