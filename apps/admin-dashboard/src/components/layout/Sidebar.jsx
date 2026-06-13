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
      { href: '/clients/onboarding',    label: 'Onboarding',     icon: '📥', badge: 'pendingOnboarding' },
      { href: '/clients/subscriptions', label: 'Subscriptions',  icon: '💳' },
    ],
  },
]

const SECTION_THEMES = {
  crm: {
    accent: 'text-blue-600',
    activeBg: 'bg-blue-600 text-white shadow-sm',
    hover: 'hover:bg-blue-50/50 hover:text-blue-600 text-slate-600',
    border: 'border-blue-100',
    bg: 'bg-gradient-to-b from-blue-50/10 via-white to-white',
  },
  agents: {
    accent: 'text-orange-600',
    activeBg: 'bg-orange-600 text-white shadow-sm',
    hover: 'hover:bg-orange-50/50 hover:text-orange-600 text-slate-600',
    border: 'border-orange-100',
    bg: 'bg-gradient-to-b from-orange-50/10 via-white to-white',
  },
  clients: {
    accent: 'text-indigo-600',
    activeBg: 'bg-indigo-600 text-white shadow-sm',
    hover: 'hover:bg-indigo-50/50 hover:text-indigo-600 text-slate-600',
    border: 'border-indigo-100',
    bg: 'bg-gradient-to-b from-indigo-50/10 via-white to-white',
  },
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [pendingTasks, setPendingTasks] = useState(null)
  const [pendingOnboarding, setPendingOnboarding] = useState(null)

  useEffect(() => {
    api.get('/api/v1/agents/stats')
      .then(res => { if (res.data?.pending > 0) setPendingTasks(res.data.pending) })
      .catch(() => {})

    api.get('/api/v1/onboarding?status=PENDING&limit=1')
      .then(res => { if (res.meta?.total > 0) setPendingOnboarding(res.meta.total) })
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

  // Determine active section based on URL pathname
  let activeSectionId = null
  if (pathname.startsWith('/crm') || pathname.startsWith('/other-services')) {
    activeSectionId = 'crm'
  } else if (pathname.startsWith('/agents')) {
    activeSectionId = 'agents'
  } else if (pathname.startsWith('/clients') || pathname.startsWith('/onboarding') || pathname.startsWith('/subscriptions')) {
    activeSectionId = 'clients'
  }

  // Fallback to clients theme if no active section matched
  const theme = SECTION_THEMES[activeSectionId] || SECTION_THEMES.clients
  const activeSection = navSections.find(sec => sec.id === activeSectionId)

  return (
    <aside className={`flex h-screen w-64 flex-col border-r border-slate-200 ${theme.bg} overflow-y-auto transition-colors duration-300`}>
      {/* Brand & Back Button */}
      <div className="flex flex-col gap-3 px-5 py-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg font-extrabold text-slate-900 tracking-tight">⚡ AiGateway</span>
          <span className="ml-auto text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase">Admin</span>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-650 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
        >
          <span>←</span> Back to Dashboard
        </Link>
      </div>

      {/* Dynamic Nav Items */}
      {activeSection ? (
        <nav className="flex-1 px-3 pb-4 space-y-1 mt-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accent} whitespace-nowrap`}>
              {activeSection.heading}
            </span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <div className="space-y-0.5">
            {activeSection.items.map((item) => {
              const active = isActive(item.href)
              
              let badgeCount = null
              if (item.badge === 'pendingTasks') {
                badgeCount = pendingTasks
              } else if (item.badge === 'pendingOnboarding') {
                badgeCount = pendingOnboarding
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    active
                      ? theme.activeBg
                      : theme.hover
                  }`}
                >
                  <span className="text-base leading-none flex-shrink-0">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {badgeCount > 0 && (
                    <span className="text-[10px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {badgeCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
      ) : (
        <div className="flex-1" />
      )}

      {/* Logout */}
      <div className="p-3 border-t border-slate-100 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-650 transition-colors"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  )
}