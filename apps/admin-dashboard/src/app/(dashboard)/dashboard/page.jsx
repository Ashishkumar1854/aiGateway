'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { StatCard } from '@/components/shared/StatCard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PageHeader } from '@/components/shared/PageHeader'

export default function DashboardPage() {
  const [agentStats, setAgentStats] = useState(null)
  const [clientCount, setClientCount] = useState(0)
  const [leadCount, setLeadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [agentsRes, clientsRes, leadsRes] = await Promise.all([
          api.get('/api/v1/agents/stats'),
          api.get('/api/v1/clients'),
          api.get('/api/v1/crm/leads'),
        ])
        setAgentStats(agentsRes.data)
        setClientCount(clientsRes.meta.total)
        setLeadCount(leadsRes.meta.total)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="p-6">
      <PageHeader title="Dashboard" subtitle="AiGateway operations overview" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Clients" value={clientCount} icon="🏢" />
        <StatCard title="Total Leads" value={leadCount} icon="🎯" />
        <StatCard title="Pending AI Tasks" value={agentStats?.pending ?? 0} icon="⏳" color={agentStats?.pending ? 'warning' : 'default'} />
        <StatCard title="Completed AI Tasks" value={agentStats?.completed ?? 0} icon="✅" color="success" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900 mb-4">AI Agent Summary</h3>
          <div className="space-y-3">
            {[
              { label: 'Awaiting Approval', value: agentStats?.pending ?? 0, color: 'text-yellow-600' },
              { label: 'Approved', value: agentStats?.approved ?? 0, color: 'text-blue-600' },
              { label: 'Completed', value: agentStats?.completed ?? 0, color: 'text-green-600' },
              { label: 'Failed', value: agentStats?.failed ?? 0, color: 'text-red-600' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                <span className="text-sm text-slate-600">{item.label}</span>
                <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'View pending agent tasks', href: '/agents/tasks', icon: '🤖' },
              { label: 'View CRM pipeline', href: '/crm', icon: '🎯' },
              { label: 'Manage clients', href: '/clients', icon: '🏢' },
              { label: 'View subscriptions', href: '/subscriptions', icon: '💳' },
            ].map((item) => (
              <a key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg p-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors border border-slate-100">
                <span>{item.icon}</span>
                {item.label}
                <span className="ml-auto text-slate-300">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}