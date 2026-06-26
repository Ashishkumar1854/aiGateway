'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { getUser } from '@/lib/auth'
import Link from 'next/link'

const SERVICE_ICONS = {
  LEAD_GENERATION: '🎯',
  EMAIL_AUTOMATION: '📧',
  REELS_AUTOMATION: '🎬',
  WHATSAPP_AUTOMATION: '💬',
  LINKEDIN_OUTREACH: '🔗',
  JOB_SEEKER: '💼',
  CUSTOM: '🤖',
}

const SERVICE_COLORS = {
  LEAD_GENERATION: 'from-indigo-50 to-indigo-50/20 border-indigo-100',
  EMAIL_AUTOMATION: 'from-purple-50 to-purple-50/20 border-purple-100',
  REELS_AUTOMATION: 'from-pink-50 to-pink-50/20 border-pink-100',
  WHATSAPP_AUTOMATION: 'from-green-50 to-green-50/20 border-green-100',
  LINKEDIN_OUTREACH: 'from-blue-50 to-blue-50/20 border-blue-100',
  JOB_SEEKER: 'from-teal-50 to-teal-50/20 border-teal-100',
  CUSTOM: 'from-slate-100 to-slate-50/20 border-slate-200',
}

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
function KpiCard({ label, value, sub, color = 'indigo', icon }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-350/80 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 shadow-sm">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/5 rounded-full blur-2xl pointer-events-none`} />
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <span className="text-lg">{icon}</span>
      </div>
      <p className={`text-2xl font-extrabold text-slate-900`}>{value}</p>
      {sub && <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{sub}</p>}
    </div>
  )
}

function StatusBadge({ status }) {
  const config = {
    ACTIVE: { label: 'Active', classes: 'bg-green-50 border-green-200 text-green-700' },
    TRIAL: { label: 'Trial', classes: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    INACTIVE: { label: 'Inactive', classes: 'bg-slate-100 border-slate-250 text-slate-500' },
    EXPIRED: { label: 'Expired', classes: 'bg-red-50 border-red-200 text-red-700' },
  }
  const c = config[status] || config.INACTIVE
  return (
    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${c.classes}`}>
      {c.label}
    </span>
  )
}

export default function ClientDashboardOverview() {
  const [client, setClient] = useState(null)
  const [myServices, setMyServices] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getUser()
    Promise.all([
      user?.client?.id ? api.get(`/api/v1/clients/${user.client.id}`) : Promise.resolve(null),
      api.get('/api/v1/onboarding/my-services'),
    ])
      .then(([clientRes, servicesRes]) => {
        if (clientRes?.data) setClient(clientRes.data)
        if (servicesRes?.data) setMyServices(servicesRes.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-800 border-t-indigo-500" />
      </div>
    )
  }

  const subscription = myServices?.subscription || null
  const activeServices = myServices?.services?.filter(s => s.isActive) || []
  const allAssignments = client?.serviceAssignments || []
  const onboardingHistory = myServices?.onboardingRequests || []
  const isTrial = subscription?.status === 'TRIAL'
  const isExpired = subscription?.status === 'EXPIRED'
  const daysRemaining = subscription?.daysRemaining ?? 0
  const memberSince = client?.createdAt || null

  // Primary service (first active)
  const primaryService = activeServices[0]
  const primaryType = primaryService?.service?.type || null

  const heroGradient = primaryType
    ? `bg-gradient-to-br ${SERVICE_COLORS[primaryType] || SERVICE_COLORS.CUSTOM}`
    : 'bg-gradient-to-br from-indigo-50/50 to-slate-50 border-indigo-100'

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-6">

      {/* Welcome Hero */}
      <div className={`relative overflow-hidden rounded-2xl border ${heroGradient} p-7`}>
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-purple-500/3 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full uppercase tracking-widest">
                Client Portal
              </span>
              {primaryType && (
                <span className="text-[10px] text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                  {SERVICE_ICONS[primaryType]} {primaryService?.service?.name || primaryType}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
              Welcome back, {client?.user?.name?.split(' ')[0] || 'Partner'}! 👋
            </h1>
            <p className="text-slate-600 mt-2 text-sm max-w-lg leading-relaxed">
              {activeServices.length > 0
                ? `Your AI workforce is running. ${activeServices.length} service${activeServices.length > 1 ? 's are' : ' is'} active and executing workflows.`
                : 'Your workspace is set up. Get in touch with admin to activate your services.'
              }
            </p>
          </div>
          {/* Plan badge */}
          <div className="flex-shrink-0 bg-white/80 border border-slate-250 rounded-2xl p-4 text-center min-w-[130px]">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Plan</p>
            <p className="text-lg font-extrabold text-slate-900">{subscription?.plan || 'Starter'}</p>
            <div className={`text-[9px] font-bold px-2 py-0.5 rounded-full border mt-1.5 inline-block ${
              isExpired ? 'bg-red-50 border-red-200 text-red-700' :
              isTrial ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
              'bg-indigo-50 border-indigo-200 text-indigo-755'
            }`}>
              {subscription?.status || 'INACTIVE'}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          icon="🤖"
          label="Active Services"
          value={activeServices.length}
          sub={activeServices.length === 0 ? 'No services active' : `${allAssignments.length} total assigned`}
          color="indigo"
        />
        <KpiCard
          icon="📋"
          label="Plan Status"
          value={subscription?.plan || '—'}
          sub={
            isExpired ? 'Trial expired · upgrade now' :
            isTrial ? `${daysRemaining}d remaining in trial` :
            subscription ? 'Paid subscription active' : 'No active plan'
          }
          color={isExpired ? 'red' : isTrial ? 'emerald' : 'indigo'}
        />
        <KpiCard
          icon="📅"
          label={isTrial ? 'Trial Expires' : 'Renewal Date'}
          value={
            subscription?.expiresAt
              ? new Date(subscription.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
              : '—'
          }
          sub={
            subscription?.expiresAt
              ? new Date(subscription.expiresAt).toLocaleDateString('en-IN', { year: 'numeric' })
              : isTrial ? 'Auto-expires in 3 days' : 'No expiry set'
          }
          color="slate"
        />
        <KpiCard
          icon="📦"
          label="Requests Sent"
          value={onboardingHistory.length}
          sub="Total onboarding requests submitted"
          color="purple"
        />
      </div>

      {/* Active Services */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active AI Services</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Services assigned and running for your business</p>
          </div>
          <Link
            href="/services"
            id="view-services-link"
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            View all →
          </Link>
        </div>

        {activeServices.length === 0 ? (
          <div className="p-10 text-center">
            <span className="text-4xl block mb-3">🤖</span>
            <p className="text-sm font-semibold text-slate-500">No active services yet</p>
            <p className="text-[11px] text-slate-400 mt-1.5 max-w-xs mx-auto">
              Contact our admin team to activate your first AI service after signing up.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {allAssignments.map((assignment) => {
              const type = assignment.service?.type || 'CUSTOM'
              const isActive = assignment.isActive
              return (
                <div key={assignment.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 flex-shrink-0">
                      <span className="text-xl">{SERVICE_ICONS[type]}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 text-sm">{assignment.service?.name}</h4>
                        <StatusBadge status={isActive ? (isTrial ? 'TRIAL' : 'ACTIVE') : 'INACTIVE'} />
                      </div>
                      <p className="text-[11px] text-slate-500">{assignment.service?.description}</p>
                      {assignment.config && Object.keys(assignment.config).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {Object.entries(assignment.config).slice(0, 3).map(([key, val]) => (
                            <span key={key} className="text-[10px] bg-slate-50 border border-slate-150 text-slate-500 px-2 py-0.5 rounded-md">
                              {key}: <strong className="text-slate-800">{String(val).substring(0, 30)}</strong>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[10px] text-slate-400">
                      Since {new Date(assignment.assignedAt || assignment.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </span>
                    <Link
                      href={`/services/${getSlugForType(type)}`}
                      className="text-[11px] font-medium text-indigo-650 hover:text-indigo-755 border border-indigo-100 hover:border-indigo-200 px-2.5 py-1 rounded-lg transition-all"
                    >
                      Manage →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Actions + Onboarding History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Quick Actions */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-2.5">
            {[
              { icon: '💳', label: 'Manage Billing & Plans', sub: 'Upgrade or view invoices', href: '/billing', id: 'qa-billing' },
              { icon: '🤖', label: 'View My Services', sub: 'Check active service configs', href: '/services', id: 'qa-services' },
              {
                icon: '🌐', label: 'Browse More Services', sub: 'Explore other AI automations',
                href: 'http://localhost:3000/services', external: true, id: 'qa-explore'
              },
              {
                icon: '📩', label: 'Contact Support', sub: 'Reach our team for help',
                href: 'http://localhost:3000/contact', external: true, id: 'qa-support'
              },
            ].map(action => (
              <Link
                key={action.label}
                id={action.id}
                href={action.href}
                target={action.external ? '_blank' : undefined}
                rel={action.external ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
              >
                <span className="text-xl p-2 bg-slate-50 border border-slate-150 rounded-xl group-hover:border-indigo-200 transition-colors">{action.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800">{action.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{action.sub}</p>
                </div>
                <span className="ml-auto text-slate-400 group-hover:text-indigo-650 transition-colors text-sm">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Request History */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Request History</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Your onboarding & service requests</p>
          </div>
          {onboardingHistory.length === 0 ? (
            <div className="p-8 text-center">
              <span className="text-3xl block mb-2">📋</span>
              <p className="text-xs text-slate-400">No request history yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[280px] overflow-y-auto">
              {onboardingHistory.map(req => {
                const statusColors = {
                  PENDING: 'text-amber-600',
                  ACTIVATED: 'text-emerald-600',
                  CONVERTED: 'text-indigo-600',
                  REJECTED: 'text-red-650',
                  EXPIRED: 'text-slate-400',
                }
                return (
                  <div key={req.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-850 truncate">{req.serviceName}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {req.requestType} · {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase flex-shrink-0 ${statusColors[req.status] || 'text-slate-400'}`}>
                      {req.status}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
