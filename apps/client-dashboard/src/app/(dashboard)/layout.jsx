'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { getUser, isAuthenticated, clearAuth } from '@/lib/auth'
import { api } from '@/lib/api'

const SERVICE_ICONS = {
  LEAD_GENERATION: '🎯',
  EMAIL_AUTOMATION: '📧',
  REELS_AUTOMATION: '🎬',
  WHATSAPP_AUTOMATION: '💬',
  LINKEDIN_OUTREACH: '🔗',
  JOB_SEEKER: '💼',
  CUSTOM: '🤖',
}

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [services, setServices] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
    } else {
      setUser(getUser())
      api.get('/api/v1/onboarding/my-services')
        .then(res => {
          if (res.success && res.data) {
            setSubscription(res.data.subscription)
            setServices(res.data.services || [])
          }
        })
        .catch(err => {
          console.error('[Client Layout] Failed to fetch onboarding status:', err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [router])

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-indigo-600" />
            <div className="absolute inset-0 rounded-full animate-ping h-10 w-10 border border-indigo-500/10" />
          </div>
          <p className="text-sm text-slate-500 animate-pulse">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  const isJobSeeker = services.some(s => s.service?.type === 'JOB_SEEKER')

  const getSlugForType = (type) => {
    switch (type) {
      case 'LEAD_GENERATION': return 'lead-generation'
      case 'EMAIL_AUTOMATION': return 'email-automation'
      case 'REELS_AUTOMATION': return 'reels-automation'
      case 'WHATSAPP_AUTOMATION': return 'whatsapp-automation'
      case 'LINKEDIN_OUTREACH': return 'linkedin-automation'
      case 'JOB_SEEKER': return 'job-seeker'
      default: return 'custom'
    }
  }

  const baseMenuItems = [
    { href: '/dashboard', label: 'Overview', icon: '📊', id: 'nav-overview' },
  ]

  const serviceMenuItems = services.filter(s => s.isActive).map(s => ({
    href: `/services/${getSlugForType(s.service?.type)}`,
    label: s.service?.name,
    icon: SERVICE_ICONS[s.service?.type] || '🤖',
    id: `nav-service-${s.id}`
  }))

  const footerMenuItems = [
    { href: '/services', label: 'My Services', icon: '🤖', id: 'nav-services' },
    { href: '/billing', label: 'Billing & Plans', icon: '💳', id: 'nav-billing' },
  ]

  const isExpired = subscription?.status === 'EXPIRED'
  const isTrial = subscription?.status === 'TRIAL'
  const daysRemaining = subscription?.daysRemaining ?? 0
  const primaryServiceType = services?.[0]?.service?.type || null

  // Days remaining color logic
  const trialColor =
    daysRemaining > 1 ? 'text-emerald-700 border-emerald-200 bg-emerald-50'
    : daysRemaining === 1 ? 'text-amber-700 border-amber-200 bg-amber-50'
    : 'text-red-750 border-red-200 bg-red-50'

  const SidebarContent = () => (
    <>
      <div className="flex flex-col h-full">
        {/* Brand Logo */}
        <div className="h-16 flex items-center px-5 border-b border-slate-100 flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <span className="text-sm">⚡</span>
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">AiGateway</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pt-2 pb-1">
            {isJobSeeker ? 'Candidate Portal' : 'Workspace'}
          </p>
          {baseMenuItems.map((item) => {
            const active = pathname === item.href
            const isDisabled = isExpired && item.href !== '/billing'

            return (
              <Link
                key={item.href}
                id={item.id}
                href={isDisabled ? '#' : item.href}
                onClick={(e) => {
                  if (isDisabled) e.preventDefault()
                  else setSidebarOpen(false)
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-650/15'
                    : isDisabled
                    ? 'text-slate-300 cursor-not-allowed opacity-40'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}

          {/* Active Automations section */}
          {serviceMenuItems.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-1.5">
                {isJobSeeker ? 'My AI Agents' : 'Active Automations'}
              </p>
              {serviceMenuItems.map((item) => {
                const active = pathname === item.href
                const isDisabled = isExpired

                return (
                  <Link
                    key={item.href}
                    id={item.id}
                    href={isDisabled ? '#' : item.href}
                    onClick={(e) => {
                      if (isDisabled) e.preventDefault()
                      else setSidebarOpen(false)
                    }}
                    className={`flex items-center gap-3 px-3 py-2.2 rounded-xl text-xs font-medium transition-all duration-200 ${
                      active
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-150'
                        : isDisabled
                        ? 'text-slate-300 cursor-not-allowed opacity-40'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                    }`}
                  >
                    <span className="text-sm w-5 text-center">{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )}

          {/* Management section */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-1.5">
              Account
            </p>
            {footerMenuItems.map((item) => {
              const active = pathname === item.href
              const isDisabled = isExpired && item.href !== '/billing'

              return (
                <Link
                  key={item.href}
                  id={item.id}
                  href={isDisabled ? '#' : item.href}
                  onClick={(e) => {
                    if (isDisabled) e.preventDefault()
                    else setSidebarOpen(false)
                  }}
                  className={`flex items-center gap-3 px-3 py-2.2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-650/15'
                      : isDisabled
                      ? 'text-slate-300 cursor-not-allowed opacity-40'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <span className="text-sm w-5 text-center">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Subscription Info Block */}
          {subscription && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-1">
                Subscription
              </p>
              <div className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold text-slate-600 uppercase">
                    {subscription.plan} Plan
                  </span>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                    isExpired ? 'bg-red-50 border-red-200 text-red-750' :
                    isTrial ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                    'bg-indigo-50 border-indigo-200 text-indigo-700'
                  }`}>
                    {subscription.status}
                  </span>
                </div>
                {isTrial && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    {daysRemaining}d remaining · expires {subscription.expiresAt
                      ? new Date(subscription.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                      : 'N/A'
                    }
                  </p>
                )}
                {!isTrial && !isExpired && subscription.expiresAt && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    Renews {new Date(subscription.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/85 mb-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-650 flex-shrink-0">
              {user?.name?.substring(0, 2).toUpperCase() || 'CL'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{user?.name || 'Client'}</p>
              <p className="text-[10px] text-slate-500 truncate">
                {isJobSeeker ? 'Candidate Portal' : (user?.client?.companyName || 'AiGateway Client')}
              </p>
            </div>
          </div>
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-650 hover:text-red-550 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — Desktop */}
      <aside className="hidden lg:flex w-60 bg-white border-r border-slate-200/80 flex-col flex-shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Sidebar — Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-200/80 flex flex-col flex-shrink-0 transform transition-transform duration-300 ease-in-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-slate-200/80 bg-white/80 backdrop-blur-sm px-4 lg:px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-btn"
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest hidden sm:block">
                {isJobSeeker ? 'Active Candidate' : 'Active Workspace'}
              </span>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                {isJobSeeker ? (user?.name || 'Candidate Workspace') : (user?.client?.companyName || 'Client Workspace')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isTrial && (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider hidden sm:inline-block ${trialColor}`}>
                🎁 Trial · {daysRemaining}d left
              </span>
            )}
            {isExpired && (
              <span className="text-[10px] bg-red-50 border border-red-200 text-red-750 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                🔒 Expired
              </span>
            )}
            {!isTrial && !isExpired && subscription && (
              <span className="text-[10px] bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider hidden sm:inline-block">
                ✅ Active
              </span>
            )}

            {/* Service type indicator */}
            {primaryServiceType && !isExpired && (
              <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-650 font-medium px-2.5 py-1 rounded-full hidden md:inline-block">
                {SERVICE_ICONS[primaryServiceType]} {services.length} service{services.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </header>

        {/* Trial Warning Banner */}
        {isTrial && (
          <div className={`border-b px-4 lg:px-6 py-2.5 flex items-center justify-between text-xs font-medium ${
            daysRemaining <= 1
              ? 'bg-red-50 border-red-200/60 text-red-700'
              : 'bg-emerald-50 border-emerald-200/60 text-emerald-700'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-base">{daysRemaining <= 1 ? '⚠️' : '🎁'}</span>
              <span>
                <strong>3-Day Free Trial Active</strong> — You have{' '}
                <strong className={daysRemaining <= 1 ? 'text-red-700' : 'text-emerald-700'}>
                  {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
                </strong>
                {'. '}
                {daysRemaining <= 1 ? 'Upgrade now to keep your service live.' : 'Upgrade before it expires to keep your AI running.'}
              </span>
            </div>
            {pathname !== '/billing' && (
              <Link
                href="/billing"
                id="trial-upgrade-link"
                className={`flex-shrink-0 font-bold px-3 py-1.5 rounded-lg transition-colors text-[10px] uppercase shadow-sm ml-4 ${
                  daysRemaining <= 1
                    ? 'bg-red-650 hover:bg-red-550 text-white'
                    : 'bg-emerald-650 hover:bg-emerald-550 text-white'
                }`}
              >
                Upgrade →
              </Link>
            )}
          </div>
        )}

        {/* Content Router Outlet */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          {isExpired && pathname !== '/billing' ? (
            <div className="absolute inset-0 z-50 bg-slate-100/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-4xl shadow-xl shadow-red-100">
                  🔒
                </div>
                <div className="absolute -inset-3 rounded-3xl border border-red-200/30 animate-pulse" />
              </div>
              <div className="space-y-2 max-w-sm">
                <h1 className="text-2xl font-black text-slate-900">Trial Expired</h1>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Your 3-day free trial of{' '}
                  <strong className="text-slate-700">AiGateway automation services</strong> has ended.
                  Your AI workspace has been paused.
                </p>
              </div>
              <div className="space-y-3 w-full max-w-xs">
                <Link
                  href="/billing"
                  id="expired-upgrade-btn"
                  className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-650/15 text-sm uppercase tracking-wide text-center"
                >
                  Upgrade to Continue →
                </Link>
                <p className="text-[10px] text-slate-400">All your data is preserved. Just upgrade to resume.</p>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  )
}
