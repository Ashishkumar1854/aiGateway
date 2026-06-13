'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clearAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

const navSections = [
  {
    id: 'crm',
    heading: '🌐 Public & CRM',
    items: [
      { href: '/crm',           label: 'Pipeline',   icon: '🎯' },
      { href: '/crm/leads',     label: 'All Leads',  icon: '📋' },
      { href: '/crm/meetings',  label: 'Meetings',   icon: '📅' },
      { href: '/crm/contacts',  label: 'Contacts',   icon: '💬' },
    ],
  },
  {
    id: 'agents',
    heading: '🤖 AI Workforce',
    badge: 'pendingTasks',
    items: [
      { href: '/agents',                 label: 'Overview',       icon: '🤖' },
      { href: '/agents/tasks',           label: 'Tasks',          icon: '⏳', badge: 'pendingTasks' },
      { href: '/agents/logs',            label: 'Logs',           icon: '📜' },
      { href: '/agents/research',        label: 'Research Agent', icon: '🔍' },
      { href: '/agents/outreach',        label: 'Outreach Agent', icon: '📧' },
      { href: '/agents/meeting',         label: 'Meeting Agent',  icon: '🗓️' },
      { href: '/agents/orchestrator',    label: 'Orchestrator',   icon: '⚙️' },
    ],
  },
  {
    id: 'clients',
    heading: '💼 SaaS Clients',
    items: [
      { href: '/clients',               label: 'All Clients',    icon: '🏢' },
      { href: '/clients/onboarding',    label: 'Onboarding',     icon: '📥' },
      { href: '/clients/subscriptions', label: 'Subscriptions',  icon: '💳' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [pendingTasks, setPendingTasks] = useState(null)

  useEffect(() => {
    api.get('/api/v1/agents/stats')
      .then(res => { if (res.data?.pending > 0) setPendingTasks(res.data.pending) })
      .catch(() => {})
  }, [])

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  // Active logic: exact match for section roots, startsWith for sub-items
  const isActive = (href) => {
    if (href === '/crm') return pathname === '/crm'
    if (href === '/agents') return pathname === '/agents'
    if (href === '/clients') return pathname === '/clients'
    return pathname.startsWith(href)
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white overflow-y-auto">
      {/* Brand */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 flex-shrink-0">
        <span className="text-lg font-extrabold text-slate-900 tracking-tight">⚡ AiGateway</span>
        <span className="ml-auto text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase">Admin</span>
      </div>

      {/* Dashboard link */}
      <div className="px-3 pt-3">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
            pathname === '/dashboard'
              ? 'bg-slate-900 text-white'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span>📊</span> Dashboard
        </Link>
      </div>

      {/* Sections */}
      <nav className="flex-1 px-3 pb-4 space-y-1 mt-2">
        {navSections.map((section) => (
          <div key={section.id}>
            {/* Section divider label */}
            <div className="flex items-center gap-2 mt-4 mb-1 px-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
                {section.heading}
              </span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Nav items */}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href)
                const badgeCount = item.badge === 'pendingTasks' ? pendingTasks : null
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="text-base leading-none flex-shrink-0">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {badgeCount && (
                      <span className="text-[10px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {badgeCount}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-100 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  )
}