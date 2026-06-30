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

const SERVICE_ACCENT = {
  LEAD_GENERATION: 'indigo',
  EMAIL_AUTOMATION: 'purple',
  REELS_AUTOMATION: 'pink',
  WHATSAPP_AUTOMATION: 'green',
  LINKEDIN_OUTREACH: 'blue',
  JOB_SEEKER: 'teal',
  CUSTOM: 'slate',
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

const CONFIG_LABELS = {
  target_industry: 'Target Industry',
  target_location: 'Target Location',
  icp_description: 'ICP',
  sender_email: 'Sender Email',
  email_domain: 'Email Domain',
  target_audience: 'Target Audience',
  email_goal: 'Email Goal',
  instagram_handle: 'Instagram Handle',
  content_niche: 'Content Niche',
  posting_frequency: 'Posts/Week',
  brand_tone: 'Brand Tone',
  whatsapp_number: 'WhatsApp Number',
  response_type: 'AI Handles',
  business_hours: 'Business Hours',
  linkedin_profile: 'LinkedIn Profile',
  target_title: 'Target Titles',
  connection_message: 'Connection Note',
  resume_link: 'Resume Link',
  target_roles: 'Target Roles',
  target_locations: 'Locations',
  experience_level: 'Experience',
  linkedin_url: 'LinkedIn URL',
}

function ChangeRequestModal({ service, onClose }) {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const user = getUser()
      await api.post('/api/v1/public/contact', {
        companyName: user?.client?.companyName || 'Client',
        contactName: user?.name || 'Client',
        email: user?.email || '',
        notes: `[Change Request — ${service?.name}]\n\n${message}`,
        source: 'client_dashboard',
        status: 'COLD',
        score: 5,
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Request Configuration Change</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{service?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all"
          >
            ✕
          </button>
        </div>

        {status === 'success' ? (
          <div className="text-center py-6 space-y-3">
            <span className="text-4xl block">✅</span>
            <p className="text-sm font-bold text-slate-900">Request Sent!</p>
            <p className="text-xs text-slate-500">Our team will review your change request and get back to you.</p>
            <button onClick={onClose} className="text-xs text-indigo-650 hover:text-indigo-755 font-semibold">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Describe your requested changes *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={`e.g. Please change my target industry to Healthcare, update the ICP to include SMBs...`}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none placeholder-slate-450 focus:bg-white"
              />
            </div>
            {status === 'error' && (
              <p className="text-xs text-red-500">Failed to send. Please try again.</p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-200 hover:border-slate-350 bg-transparent py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 text-xs transition-all disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Send Request →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ClientServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [changeModal, setChangeModal] = useState(null) // service object or null

  useEffect(() => {
    const user = getUser()
    if (user?.client?.id) {
      api.get(`/api/v1/clients/${user.client.id}/services`)
        .then(res => setServices(res.data || []))
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-indigo-650" />
      </div>
    )
  }

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My AI Services</h1>
          <p className="text-xs text-slate-500 mt-1">Manage and monitor your active AI workforce automations.</p>
        </div>
        <Link
          href="http://localhost:3000/services"
          target="_blank"
          rel="noopener noreferrer"
          id="browse-services-link"
          className="flex-shrink-0 inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100/60 transition-all"
        >
          🌐 Browse More Services →
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="text-center rounded-2xl border border-slate-200 bg-white p-14 shadow-sm">
          <span className="text-5xl block mb-4">🤖</span>
          <p className="text-sm font-bold text-slate-800">No services assigned yet</p>
          <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
            Get in touch with our support team or explore our services to get started.
          </p>
          <Link
            href="http://localhost:3000/services"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block text-xs font-bold text-indigo-600 hover:text-indigo-700 border border-indigo-200 px-4 py-2 rounded-xl transition-all hover:border-indigo-300"
          >
            Explore Services →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {services.map((assignment) => {
            const type = assignment.service?.type || 'CUSTOM'
            const accent = SERVICE_ACCENT[type] || 'slate'
            const isActive = assignment.isActive
            const config = assignment.config && typeof assignment.config === 'object' ? assignment.config : {}
            const hasConfig = Object.keys(config).length > 0
            const features = assignment.service?.features || []

            return (
              <div
                key={assignment.id}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 hover:border-${accent}-300 hover:shadow-md hover:shadow-slate-100 ${
                  isActive ? `border-slate-200/80` : 'border-slate-200/40 opacity-70'
                }`}
              >
                {/* Card Header */}
                <div className={`px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-${accent}-50/50 to-transparent`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-${accent}-50 border border-${accent}-100`}>
                      <span className="text-2xl">{SERVICE_ICONS[type]}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-bold text-slate-900">{assignment.service?.name}</h3>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                          isActive
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{assignment.service?.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[10px] text-slate-400">
                      Assigned {new Date(assignment.assignedAt || assignment.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </span>
                    <button
                      id={`change-request-${assignment.id}`}
                      onClick={() => setChangeModal(assignment.service)}
                      className="rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 px-3.5 py-2 border border-slate-200 hover:border-slate-350 transition-all"
                    >
                      Request Change
                    </button>
                    {isActive && (
                      <Link
                        href={`/services/${getSlugForType(type)}`}
                        className={`rounded-xl bg-${accent}-600 hover:bg-${accent}-500 text-xs font-semibold text-white px-3.5 py-2 transition-all shadow-md shadow-${accent}-500/10`}
                      >
                        Open Workspace →
                      </Link>
                    )}
                  </div>
                </div>

                {/* Card Body — Features + Config */}
                <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Features */}
                  {features.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                        Included Features
                      </p>
                      <ul className="space-y-2">
                        {features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2.5 text-xs text-slate-750">
                            <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Configuration */}
                  {hasConfig && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                        Active Configuration
                      </p>
                      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2.5">
                        {Object.entries(config).map(([key, val]) => {
                          if (!val || (typeof val === 'object' && Object.keys(val).length === 0)) return null
                          const label = CONFIG_LABELS[key] || key.replace(/_/g, ' ')
                          const displayVal = typeof val === 'object' ? JSON.stringify(val) : String(val)
                          return (
                            <div key={key} className="flex items-start gap-2.5">
                              <span className="text-[10px] font-semibold text-slate-400 min-w-[90px] mt-0.5 flex-shrink-0">
                                {label}
                              </span>
                              <span className="text-[11px] text-slate-700 break-all">{displayVal}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* If no features AND no config */}
                  {features.length === 0 && !hasConfig && (
                    <div className="md:col-span-2 text-center py-4">
                      <p className="text-xs text-slate-500">No feature details or configuration data available.</p>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                {assignment.expiresAt && (
                  <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
                    <p className="text-[10px] text-slate-400">
                      {isActive ? 'Service expires' : 'Expired'} on{' '}
                      <strong className="text-slate-700">
                        {new Date(assignment.expiresAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </strong>
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Help Banner */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 flex items-start gap-4 shadow-sm">
        <span className="text-xl p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-650 rounded-xl flex-shrink-0">ℹ️</span>
        <div>
          <h4 className="text-sm font-bold text-slate-900">Need customization or want to add more services?</h4>
          <p className="text-[11px] text-slate-550 mt-1 leading-relaxed">
            Our AI Agents support custom workflows tailored to your company. Use the &quot;Request Change&quot; button on any service card to request modifications, or{' '}
            <Link
              href="http://localhost:3000/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-650 hover:text-indigo-755 underline underline-offset-2"
            >
              contact our team
            </Link>
            {' '}to add new services to your plan.
          </p>
        </div>
      </div>

      {/* Change Request Modal */}
      {changeModal && (
        <ChangeRequestModal
          service={changeModal}
          onClose={() => setChangeModal(null)}
        />
      )}
    </div>
  )
}
