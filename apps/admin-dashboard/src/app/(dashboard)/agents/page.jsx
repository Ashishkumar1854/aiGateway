'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { StatCard } from '@/components/shared/StatCard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PageHeader } from '@/components/shared/PageHeader'

export default function AgentsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/v1/agents/stats')
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

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
          </div>
        </div>
      </div>
    </div>
  )
}