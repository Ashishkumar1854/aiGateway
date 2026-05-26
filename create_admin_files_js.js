const fs = require('fs');
const path = require('path');

const files = {
  'apps/admin-dashboard/src/lib/api.js': `const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('aigw_token')
}

async function apiFetch(endpoint, options = {}) {
  const { auth = true, ...fetchOptions } = options

  const headers = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  }

  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = \`Bearer \${token}\`
  }

  const res = await fetch(\`\${BASE_URL}\${endpoint}\`, {
    ...fetchOptions,
    headers,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.error?.message || 'API Error')
  }

  return data
}

export const api = {
  get: (endpoint) => apiFetch(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiFetch(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => apiFetch(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => apiFetch(endpoint, { method: 'DELETE' }),
}`,

  'apps/admin-dashboard/src/lib/auth.js': `export const AUTH_TOKEN_KEY = 'aigw_token'
export const AUTH_REFRESH_KEY = 'aigw_refresh'
export const AUTH_USER_KEY = 'aigw_user'

export function saveAuth(accessToken, refreshToken, user) {
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken)
  localStorage.setItem(AUTH_REFRESH_KEY, refreshToken)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function getUser() {
  if (typeof window === 'undefined') return null
  const u = localStorage.getItem(AUTH_USER_KEY)
  return u ? JSON.parse(u) : null
}

export function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_REFRESH_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

export function isAuthenticated() {
  return !!getToken()
}`,

  'apps/admin-dashboard/src/components/shared/StatCard.jsx': `export function StatCard({ title, value, subtitle, icon, color = 'default' }) {
  const colors = {
    default: 'bg-white border-slate-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    danger: 'bg-red-50 border-red-200',
  }

  return (
    <div className={\`rounded-xl border p-5 \${colors[color]}\`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
    </div>
  )
}`,

  'apps/admin-dashboard/src/components/shared/LoadingSpinner.jsx': `export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
    </div>
  )
}`,

  'apps/admin-dashboard/src/components/shared/EmptyState.jsx': `export function EmptyState({ title, description, icon = '📭' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl">{icon}</span>
      <h3 className="mt-4 text-lg font-semibold text-slate-700">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
    </div>
  )
}`,

  'apps/admin-dashboard/src/components/shared/PageHeader.jsx': `export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}`,

  'apps/admin-dashboard/src/components/layout/Sidebar.jsx': `'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clearAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/clients', label: 'Clients', icon: '🏢' },
  { href: '/crm', label: 'CRM Pipeline', icon: '🎯' },
  { href: '/agents', label: 'AI Agents', icon: '🤖' },
  { href: '/subscriptions', label: 'Subscriptions', icon: '💳' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-100">
        <span className="text-xl font-bold text-slate-900">⚡ AiGateway</span>
      </div>
      <div className="px-3 py-1 mt-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Admin Office</span>
      </div>
      <nav className="flex-1 space-y-0.5 px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={\`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors \${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }\`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  )
}`,

  'apps/admin-dashboard/src/app/layout.js': `import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AiGateway Admin',
  description: 'AiGateway Admin Office',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`,

  'apps/admin-dashboard/src/app/page.js': `import { redirect } from 'next/navigation'
export default function Home() {
  redirect('/dashboard')
}`,

  'apps/admin-dashboard/src/app/login/page.jsx': `'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { saveAuth } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@aigateway.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/api/v1/auth/login', { email, password })
      saveAuth(res.data.accessToken, res.data.refreshToken, res.data.user)
      router.push('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">⚡ AiGateway</h1>
          <p className="text-slate-500 mt-2">Admin Office</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Sign in</h2>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}`,

  'apps/admin-dashboard/src/app/(dashboard)/layout.jsx': `'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }) {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}`,

  'apps/admin-dashboard/src/app/(dashboard)/dashboard/page.jsx': `'use client'

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
                <span className={\`text-sm font-bold \${item.color}\`}>{item.value}</span>
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
}`,

  'apps/admin-dashboard/src/app/(dashboard)/clients/page.jsx': `'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = async (page = 1) => {
    setLoading(true)
    try {
      const res = await api.get(\`/api/v1/clients?page=\${page}&limit=10&search=\${search}\`)
      setClients(res.data)
      setMeta(res.meta)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [search])

  const statusColor = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-slate-100 text-slate-500',
    suspended: 'bg-red-100 text-red-700',
  }

  return (
    <div className="p-6">
      <PageHeader title="Clients" subtitle={\`\${meta.total} total clients\`} />
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>
      {loading ? <LoadingSpinner /> : clients.length === 0 ? (
        <EmptyState title="No clients found" description="Add your first client to get started" icon="🏢" />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-500">Company</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Contact</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Industry</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">{client.companyName}</td>
                  <td className="px-4 py-3 text-slate-500">{client.user?.name}<br /><span className="text-xs">{client.user?.email}</span></td>
                  <td className="px-4 py-3 text-slate-500">{client.industry || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={\`inline-flex rounded-full px-2 py-0.5 text-xs font-medium \${statusColor[client.status] || 'bg-slate-100 text-slate-500'}\`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a href={\`/clients/\${client.id}\`} className="text-xs font-medium text-slate-900 hover:underline">View →</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}`,

  'apps/admin-dashboard/src/app/(dashboard)/crm/page.jsx': `'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PageHeader } from '@/components/shared/PageHeader'

const STATUS_COLORS = {
  COLD: 'bg-slate-100 border-slate-200',
  WARM: 'bg-orange-50 border-orange-200',
  QUALIFIED: 'bg-blue-50 border-blue-200',
  PROPOSAL: 'bg-purple-50 border-purple-200',
  NEGOTIATION: 'bg-yellow-50 border-yellow-200',
  WON: 'bg-green-50 border-green-200',
  LOST: 'bg-red-50 border-red-200',
}

const scoreColor = (score) => {
  if (score >= 80) return 'text-green-600 bg-green-50'
  if (score >= 60) return 'text-yellow-600 bg-yellow-50'
  return 'text-slate-500 bg-slate-100'
}

export default function CRMPage() {
  const [pipeline, setPipeline] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/v1/crm/pipeline')
      .then((res) => setPipeline(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="p-6">
      <PageHeader title="CRM Pipeline" subtitle="Lead management kanban board" />
      <div className="flex gap-3 overflow-x-auto pb-4">
        {pipeline.map((col) => (
          <div key={col.status} className="flex-shrink-0 w-64">
            <div className={\`rounded-xl border p-3 \${STATUS_COLORS[col.status] || 'bg-white border-slate-200'}\`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-600">{col.status}</h3>
                <span className="text-xs font-semibold text-slate-400">{col.count}</span>
              </div>
              <div className="space-y-2">
                {col.leads.length === 0 ? (
                  <p className="text-center text-xs text-slate-300 py-4">No leads</p>
                ) : col.leads.map((lead) => (
                  <a key={lead.id} href={\`/crm/leads/\${lead.id}\`} className="block rounded-lg bg-white border border-slate-200 p-3 hover:border-slate-400 transition-colors shadow-sm">
                    <p className="text-sm font-medium text-slate-900 truncate">{lead.companyName}</p>
                    {lead.contactName && <p className="text-xs text-slate-400 mt-0.5">{lead.contactName}</p>}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{lead.industry || 'Unknown'}</span>
                      <span className={\`text-xs font-bold px-1.5 py-0.5 rounded \${scoreColor(lead.score)}\`}>{lead.score}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}`,

  'apps/admin-dashboard/src/app/(dashboard)/agents/page.jsx': `'use client'

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
}`,

  'apps/admin-dashboard/src/app/(dashboard)/agents/tasks/page.jsx': `'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'

export default function AgentTasksPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('AWAITING_APPROVAL')
  const [actionLoading, setActionLoading] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get(\`/api/v1/agents/tasks?status=\${filter}&limit=20\`)
      setTasks(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filter])

  const handleApprove = async (id) => {
    setActionLoading(id)
    try {
      await api.put(\`/api/v1/agents/tasks/\${id}/approve\`, {})
      await load()
    } catch (err) { console.error(err) }
    finally { setActionLoading(null) }
  }

  const handleReject = async (id) => {
    setActionLoading(id)
    try {
      await api.put(\`/api/v1/agents/tasks/\${id}/reject\`, { reason: 'Rejected by admin' })
      await load()
    } catch (err) { console.error(err) }
    finally { setActionLoading(null) }
  }

  const STATUS_BADGE = {
    AWAITING_APPROVAL: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
    FAILED: 'bg-red-100 text-red-700',
  }

  return (
    <div className="p-6">
      <PageHeader title="Agent Tasks" subtitle="Review and approve AI agent actions" />
      <div className="mb-4 flex gap-2 flex-wrap">
        {['AWAITING_APPROVAL', 'APPROVED', 'COMPLETED', 'REJECTED', 'FAILED'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={\`rounded-full px-3 py-1 text-xs font-medium transition-colors \${filter === s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}>
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>
      {loading ? <LoadingSpinner /> : tasks.length === 0 ? (
        <EmptyState title="No tasks found" description="No agent tasks with this status" icon="🤖" />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-900">{task.agentType.replace('_', ' ')}</span>
                    <span className={\`text-xs px-2 py-0.5 rounded-full font-medium \${STATUS_BADGE[task.status] || 'bg-slate-100 text-slate-500'}\`}>{task.status.replace('_', ' ')}</span>
                  </div>
                  {task.lead && <p className="text-sm text-slate-500">Lead: <strong>{task.lead.companyName}</strong></p>}
                  <p className="text-xs text-slate-400 mt-1">{new Date(task.createdAt).toLocaleString()}</p>
                </div>
                {task.status === 'AWAITING_APPROVAL' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleApprove(task.id)} disabled={actionLoading === task.id} className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50">
                      {actionLoading === task.id ? '...' : 'Approve'}
                    </button>
                    <button onClick={() => handleReject(task.id)} disabled={actionLoading === task.id} className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 disabled:opacity-50">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}`,

  'apps/admin-dashboard/src/app/(dashboard)/subscriptions/page.jsx': `'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState([])
  const [meta, setMeta] = useState({ total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/v1/subscriptions?limit=20')
      .then((res) => { setSubs(res.data); setMeta(res.meta) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const PLAN_COLOR = {
    STARTER: 'bg-slate-100 text-slate-700',
    PRO: 'bg-blue-100 text-blue-700',
    ENTERPRISE: 'bg-purple-100 text-purple-700',
  }
  const STATUS_COLOR = {
    ACTIVE: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    EXPIRED: 'bg-slate-100 text-slate-500',
    TRIAL: 'bg-yellow-100 text-yellow-700',
  }

  return (
    <div className="p-6">
      <PageHeader title="Subscriptions" subtitle={\`\${meta.total} total subscriptions\`} />
      {loading ? <LoadingSpinner /> : subs.length === 0 ? (
        <EmptyState title="No subscriptions" description="No subscriptions found" icon="💳" />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-500">Client</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Plan</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Expires</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((sub) => (
                <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{sub.client?.companyName || sub.clientId}</td>
                  <td className="px-4 py-3"><span className={\`rounded-full px-2 py-0.5 text-xs font-medium \${PLAN_COLOR[sub.plan] || ''}\`}>{sub.plan}</span></td>
                  <td className="px-4 py-3"><span className={\`rounded-full px-2 py-0.5 text-xs font-medium \${STATUS_COLOR[sub.status] || ''}\`}>{sub.status}</span></td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString() : 'No expiry'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created:', filePath);
}
