'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { getUser } from '@/lib/auth'

export default function ClientDashboardOverview() {
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getUser()
    if (user?.client?.id) {
      api.get(`/api/v1/clients/${user.client.id}`)
        .then(res => setClient(res.data))
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="p-8 text-center text-slate-500">
        Workspace details could not be retrieved. Please check back later.
      </div>
    )
  }

  // Calculate fields
  const activeSubscription = client.subscriptions?.find(s => s.status === 'ACTIVE')
  const assignedServicesCount = client.serviceAssignments?.filter(s => s.isActive).length || 0

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Welcome Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 p-8">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="z-10">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
            Client Portal
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-4">
            Welcome back, {client.user?.name || 'Partner'}!
          </h1>
          <p className="text-slate-400 mt-2 text-sm max-w-xl">
            Here is your current automated workspace overview. Your virtual AI employees are active in the background, executing workflows according to your needs.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sub Card */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan & Billing</p>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-white">
              {activeSubscription ? `${activeSubscription.plan} Plan` : 'No Active Plan'}
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full ${activeSubscription?.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
            Status: <span className="uppercase font-semibold">{activeSubscription?.status || 'Inactive'}</span>
          </p>
        </div>

        {/* Services Count Card */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active AI Assistants</p>
          <h3 className="text-3xl font-extrabold text-white mt-2">{assignedServicesCount}</h3>
          <p className="text-[11px] text-slate-400 mt-2">
            Automating lead gen, outreach pitches & scheduling.
          </p>
        </div>

        {/* Renewal Date Card */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Billing Renewal</p>
          <h3 className="text-xl font-bold text-white mt-3">
            {activeSubscription?.expiresAt ? new Date(activeSubscription.expiresAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'No Expiry'}
          </h3>
          <p className="text-[11px] text-slate-400 mt-2">
            Autopay enabled via credit card profile details.
          </p>
        </div>
      </div>

      {/* Active Service Status Summary */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/20">
          <h3 className="text-sm font-bold text-white">Assigned Service Summary</h3>
        </div>
        <div className="divide-y divide-slate-800/60">
          {client.serviceAssignments?.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-8">No services assigned yet. Contact admin to assign services.</p>
          ) : (
            client.serviceAssignments.map((assignment) => (
              <div key={assignment.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="text-2xl p-2 rounded-xl bg-slate-800 border border-slate-700/50">
                    {assignment.service?.type === 'LEAD_GENERATION' ? '🎯' :
                     assignment.service?.type === 'EMAIL_AUTOMATION' ? '📧' :
                     assignment.service?.type === 'REELS_AUTOMATION' ? '🎬' :
                     assignment.service?.type === 'WHATSAPP_AUTOMATION' ? '💬' :
                     assignment.service?.type === 'LINKEDIN_OUTREACH' ? '🔗' :
                     assignment.service?.type === 'JOB_SEEKER' ? '💼' : '🤖'}
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-sm">{assignment.service?.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{assignment.service?.description}</p>
                    {assignment.config && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Object.entries(assignment.config).map(([key, val]) => (
                          <span key={key} className="text-[10px] bg-slate-800 border border-slate-700/60 text-slate-300 px-2 py-0.5 rounded-md">
                            {key}: <strong>{String(val)}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    assignment.isActive ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-slate-800 border border-slate-700 text-slate-500'
                  }`}>
                    {assignment.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
