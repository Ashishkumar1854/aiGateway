'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import Link from 'next/link'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [agentsRes, clientsRes, leadsRes, meetingsRes, onboardingRes, subsRes] = await Promise.all([
          api.get('/api/v1/agents/stats'),
          api.get('/api/v1/clients?limit=1'),
          api.get('/api/v1/crm/leads?limit=1'),
          api.get('/api/v1/crm/meetings?limit=1'),
          api.get('/api/v1/onboarding?status=PENDING&limit=1'),
          api.get('/api/v1/subscriptions?limit=1'),
        ])
        setData({
          agentStats: agentsRes.data,
          clients: clientsRes.meta?.total ?? 0,
          leads: leadsRes.meta?.total ?? 0,
          meetings: meetingsRes.meta?.total ?? 0,
          pendingOnboarding: onboardingRes.meta?.total ?? 0,
          subscriptions: subsRes.meta?.total ?? 0,
        })
      } catch (err) {
        console.error(err)
        setData({})
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner />

  const sections = [
    {
      id: 'crm',
      icon: '🌐',
      title: 'Public & CRM',
      color: 'border-blue-200 bg-gradient-to-br from-blue-50 to-white',
      accentColor: 'text-blue-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      stats: [
        { label: 'Total Leads', value: data.leads ?? 0 },
        { label: 'Scheduled Meetings', value: data.meetings ?? 0 },
      ],
      cta: { label: 'Open CRM Pipeline →', href: '/crm' },
      links: [
        { label: 'All Leads', href: '/crm/leads' },
        { label: 'Meetings', href: '/crm/meetings' },
        { label: 'Contact Submissions', href: '/crm/contacts' },
      ],
    },
    {
      id: 'agents',
      icon: '🤖',
      title: 'AI Workforce',
      color: 'border-orange-200 bg-gradient-to-br from-orange-50 to-white',
      accentColor: 'text-orange-600',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      stats: [
        { label: 'Pending Approvals', value: data.agentStats?.pending ?? 0, urgent: true },
        { label: 'Completed Tasks', value: data.agentStats?.completed ?? 0 },
      ],
      cta: { label: 'Open Agents Overview →', href: '/agents' },
      links: [
        { label: 'Task Queue', href: '/agents/tasks', badge: data.agentStats?.pending > 0 ? data.agentStats.pending : null },
        { label: 'Logs', href: '/agents/logs' },
        { label: 'Orchestrator', href: '/agents/orchestrator' },
      ],
    },
    {
      id: 'clients',
      icon: '💼',
      title: 'SaaS Clients',
      color: 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-white',
      accentColor: 'text-indigo-600',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      stats: [
        { label: 'Active Clients', value: data.clients ?? 0 },
        { label: 'Pending Onboarding', value: data.pendingOnboarding ?? 0, urgent: true },
      ],
      cta: { label: 'Open Clients Directory →', href: '/clients' },
      links: [
        { label: 'All Clients', href: '/clients' },
        { label: 'Onboarding', href: '/clients/onboarding', badge: data.pendingOnboarding > 0 ? data.pendingOnboarding : null },
        { label: 'Subscriptions', href: '/clients/subscriptions' },
      ],
    },
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Office</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">AiGateway Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* 3 Section Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`rounded-2xl border ${section.color} p-6 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow`}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">{section.title}</h2>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3">
              {section.stats.map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white border border-slate-100 px-4 py-3 text-center shadow-sm">
                  <p className={`text-2xl font-black ${stat.urgent && stat.value > 0 ? 'text-red-600' : section.accentColor}`}>
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Sub-links */}
            <div className="space-y-1 border-t border-slate-200/60 pt-3">
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 hover:bg-white/70 py-1.5 px-2 rounded-lg transition-colors"
                >
                  <span>{link.label}</span>
                  <div className="flex items-center gap-2">
                    {link.badge && (
                      <span className="text-[9px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                        {link.badge}
                      </span>
                    )}
                    <span className="text-slate-300">→</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA */}
            <Link
              href={section.cta.href}
              className={`mt-auto block text-center text-xs font-bold py-2.5 rounded-xl border ${section.badgeColor} border hover:opacity-80 transition-opacity`}
            >
              {section.cta.label}
            </Link>
          </div>
        ))}
      </div>

      {/* Recent Activity Row */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: '⏳', label: 'Review Pending Tasks', href: '/agents/tasks', urgent: data.agentStats?.pending > 0 },
            { icon: '📥', label: 'Review Onboarding Requests', href: '/clients/onboarding', urgent: data.pendingOnboarding > 0 },
            { icon: '🚀', label: 'Launch Bulk Outreach', href: '/agents/orchestrator' },
            { icon: '📋', label: 'View All Leads', href: '/crm/leads' },
            { icon: '🏢', label: 'Manage Clients', href: '/clients' },
            { icon: '💳', label: 'Subscriptions', href: '/clients/subscriptions' },
            { icon: '💬', label: 'Contact Submissions', href: '/crm/contacts' },
            { icon: '📜', label: 'Agent Activity Logs', href: '/agents/logs' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`flex items-center gap-3 rounded-xl p-3.5 text-sm font-medium transition-all border ${
                action.urgent
                  ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span className="text-base">{action.icon}</span>
              <span className="text-xs leading-tight">{action.label}</span>
              <span className="ml-auto text-slate-300 text-xs">→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Workforce Detail */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold text-slate-900 mb-4 text-sm">🤖 AI Agent Pipeline Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Awaiting Approval', value: data.agentStats?.pending ?? 0, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Approved', value: data.agentStats?.approved ?? 0, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Completed', value: data.agentStats?.completed ?? 0, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Failed', value: data.agentStats?.failed ?? 0, color: 'text-red-600', bg: 'bg-red-50' },
          ].map((item) => (
            <div key={item.label} className={`${item.bg} rounded-xl p-4 text-center`}>
              <p className={`text-3xl font-black ${item.color}`}>{item.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}