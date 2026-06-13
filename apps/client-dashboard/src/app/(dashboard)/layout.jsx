'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { getUser, isAuthenticated, clearAuth } from '@/lib/auth'
import { api } from '@/lib/api'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
    } else {
      setUser(getUser())
      // Fetch subscription & trial details from consolidated onboarding endpoint
      api.get('/api/v1/onboarding/my-services')
        .then(res => {
          if (res.success && res.data) {
            setSubscription(res.data.subscription)
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
          <p className="text-sm text-slate-400">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  const menuItems = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/services', label: 'My Services', icon: '🤖' },
    { href: '/billing', label: 'Billing & Plans', icon: '💳' },
  ]

  const isExpired = subscription?.status === 'EXPIRED'
  const isTrial = subscription?.status === 'TRIAL'
  const daysRemaining = subscription?.daysRemaining || 0

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800/80 bg-slate-950/20">
            <Link href="/dashboard" className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-500">⚡</span> AiGateway
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const active = pathname === item.href
              // Disable clicking navigation links except billing if expired
              const isDisabled = isExpired && item.href !== '/billing'
              
              return (
                <Link
                  key={item.href}
                  href={isDisabled ? '#' : item.href}
                  onClick={(e) => {
                    if (isDisabled) {
                      e.preventDefault()
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                      : isDisabled
                      ? 'text-slate-650 cursor-not-allowed opacity-40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/30 mb-3 border border-slate-800/40">
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-sm font-bold text-indigo-400">
              {user?.name?.substring(0, 2).toUpperCase() || 'CL'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.client?.companyName || 'SaaS Client'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition-all"
          >
            <span>🚪</span> Log Out
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur px-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Active Workspace</span>
            <h2 className="text-sm font-bold text-white mt-0.5">{user?.client?.companyName || 'SaaS Client'}</h2>
          </div>
          <div className="flex items-center gap-3">
            {isTrial && (
              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                🎁 Free Trial Mode
              </span>
            )}
            {isExpired && (
              <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                🔒 Trial Expired
              </span>
            )}
            {!isTrial && !isExpired && (
              <span className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                PRO HOSTING ACTIVE
              </span>
            )}
          </div>
        </header>

        {/* Global Trial Warning Banner */}
        {isTrial && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-3 flex items-center justify-between text-xs text-emerald-400 font-medium">
            <div className="flex items-center gap-2">
              <span className="text-base">🎁</span>
              <span>
                <strong>3-Day Free Trial Active</strong>: You have <strong>{daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining</strong> on your trial. Upgrade to full paid subscription to keep your node live permanent.
              </span>
            </div>
            {pathname !== '/billing' && (
              <Link
                href="/billing"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-lg transition-colors text-[10px] uppercase shadow-lg shadow-emerald-600/10"
              >
                Upgrade Plan →
              </Link>
            )}
          </div>
        )}

        {/* Content Router Outlet */}
        <main className="flex-1 overflow-y-auto bg-slate-950 relative">
          {isExpired && pathname !== '/billing' ? (
            <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-3xl text-red-500 shadow-xl shadow-red-500/5">
                🔒
              </div>
              <div className="space-y-2 max-w-md">
                <h1 className="text-2xl font-black text-white">Your Trial Has Expired</h1>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your 3-day free trial deployment of <strong>AiGateway automation services</strong> has finished. Your AI workspace and agent nodes have been paused and locked.
                </p>
              </div>
              <Link
                href="/billing"
                className="bg-indigo-650 hover:bg-indigo-500 text-white font-extrabold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 text-xs uppercase"
              >
                Upgrade to Paid Plan
              </Link>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  )
}
