'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { getUser } from '@/lib/auth'

export default function ClientServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getUser()
    if (user?.client?.id) {
      api.get(`/api/v1/clients/${user.client.id}/services`)
        .then(res => setServices(res.data))
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

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Active AI Workforces</h1>
        <p className="text-xs text-slate-400 mt-1">Manage, check features, and configure active AI assistants running for your business.</p>
      </div>

      {services.length === 0 ? (
        <div className="text-center rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-slate-500">
          <span className="text-4xl block mb-3">🤖</span>
          <p className="text-sm font-semibold">No services assigned yet</p>
          <p className="text-xs text-slate-500 mt-1">Get in touch with our support team to get your first service assigned!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((assignment) => (
            <div key={assignment.id} className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                    {assignment.service?.type === 'LEAD_GENERATION' ? '🎯' :
                     assignment.service?.type === 'EMAIL_AUTOMATION' ? '📧' :
                     assignment.service?.type === 'REELS_AUTOMATION' ? '🎬' :
                     assignment.service?.type === 'WHATSAPP_AUTOMATION' ? '💬' :
                     assignment.service?.type === 'LINKEDIN_OUTREACH' ? '🔗' :
                     assignment.service?.type === 'JOB_SEEKER' ? '💼' : '🤖'}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    assignment.isActive ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-slate-800 border border-slate-700 text-slate-400'
                  }`}>
                    {assignment.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{assignment.service?.name}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{assignment.service?.description}</p>

                {/* Features Checklist */}
                {assignment.service?.features?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-800/60">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">FEATURES INCLUDED</p>
                    <ul className="space-y-1.5">
                      {assignment.service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-xs text-slate-300">
                          <span className="text-green-500">✓</span> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Config JSON Summary */}
                {assignment.config && (
                  <div className="mt-4 pt-4 border-t border-slate-800/60">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">ACTIVE CONFIGURATION</p>
                    <div className="rounded-xl bg-slate-950/40 border border-slate-800/80 p-3 font-mono text-[10px] text-indigo-400">
                      <pre className="whitespace-pre-wrap">{JSON.stringify(assignment.config, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}</span>
                <button className="rounded-xl bg-slate-800 hover:bg-slate-700/80 text-xs font-medium text-white px-3 py-1.5 border border-slate-700/60 transition-all">
                  Request Changes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Configuration change banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 flex items-start gap-4">
        <span className="text-2xl p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">ℹ️</span>
        <div>
          <h4 className="text-sm font-bold text-white">Need customization or extra services?</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Our AI Agents support customized workflows tailored specifically to your company (e.g. customized scraper parameters, personalized cold pitches, and custom scheduling rules). Get in touch with our admin team to modify configurations.
          </p>
        </div>
      </div>
    </div>
  )
}
