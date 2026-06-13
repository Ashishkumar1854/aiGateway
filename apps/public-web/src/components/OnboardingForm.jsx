'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitOnboardingRequest } from '@/lib/api'

// ─── Service-specific requirement fields ─────────────────────────────────────
const SERVICE_REQUIREMENTS = {
  'Lead Generation Bot': [
    { field: 'target_industry', label: 'Target Industry', type: 'text', placeholder: 'e.g. Fitness & Wellness, Real Estate, SaaS', required: true },
    { field: 'target_location', label: 'Target Location', type: 'text', placeholder: 'e.g. Mumbai, Delhi, Pan India', required: true },
    { field: 'icp_description', label: 'Ideal Customer Profile (ICP)', type: 'textarea', placeholder: 'Describe your ideal prospect — size, role, revenue, pain points...', required: true },
  ],
  'Email Agent Pitches': [
    { field: 'sender_email', label: 'Your Sending Email Address', type: 'email', placeholder: 'you@yourcompany.com', required: true },
    { field: 'email_domain', label: 'Email Domain', type: 'text', placeholder: 'yourcompany.com', required: true },
    { field: 'target_audience', label: 'Who Are You Emailing?', type: 'text', placeholder: 'e.g. Gym owners in Tier-2 cities', required: true },
    { field: 'email_goal', label: 'Goal of Outreach', type: 'text', placeholder: 'e.g. Book a demo call, Get a WhatsApp reply', required: false },
  ],
  'Reels Automation Bot': [
    { field: 'instagram_handle', label: 'Instagram Handle', type: 'text', placeholder: '@yourbrand', required: true },
    { field: 'content_niche', label: 'Content Niche / Topic', type: 'text', placeholder: 'e.g. Fitness tips, Business motivation', required: true },
    { field: 'posting_frequency', label: 'Posts Per Week', type: 'select', options: ['3', '5', '7', '10+'], required: true },
    { field: 'brand_tone', label: 'Brand Tone', type: 'text', placeholder: 'e.g. Professional, Energetic, Humorous', required: false },
  ],
  'WhatsApp Flow Automation': [
    { field: 'whatsapp_number', label: 'WhatsApp Business Number', type: 'tel', placeholder: '+91 98765 43210', required: true },
    { field: 'response_type', label: 'What Should the AI Handle?', type: 'textarea', placeholder: 'e.g. FAQ replies, Lead qualification, Appointment booking...', required: true },
    { field: 'business_hours', label: 'Business Hours (for escalation)', type: 'text', placeholder: 'e.g. Mon-Sat 9am-7pm IST', required: false },
  ],
}

const industries = [
  'E-commerce', 'Fitness & Wellness', 'Food & Beverage',
  'Real Estate', 'Education', 'Healthcare',
  'Technology', 'Retail', 'Finance', 'Other',
]

const STEP_LABELS = ['Your Details', 'Service Requirements']

export function OnboardingForm({ serviceName, requestType }) {
  const router = useRouter()
  const isTrial = requestType === 'TRIAL'
  const requirements = SERVICE_REQUIREMENTS[serviceName] || []
  const hasRequirements = requirements.length > 0

  const [step, setStep] = useState(1) // 1 = details, 2 = requirements
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState('')
  const [submittedData, setSubmittedData] = useState(null)

  const [details, setDetails] = useState({
    name: '', email: '', phone: '', company: '', industry: '', message: '',
  })

  // Build requirements state dynamically from service config
  const initialReqs = Object.fromEntries(requirements.map(r => [r.field, '']))
  const [reqs, setReqs] = useState(initialReqs)

  const handleDetailsChange = (e) => {
    setDetails(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleReqChange = (e) => {
    setReqs(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const goNext = (e) => {
    e.preventDefault()
    if (hasRequirements) {
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleSubmit(e, true)
    }
  }

  const handleSubmit = async (e, directSubmit = false) => {
    if (!directSubmit) e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      const res = await submitOnboardingRequest({
        ...details,
        serviceName,
        requestType,
        requirements: hasRequirements ? reqs : null,
      })
      setSubmittedData(res.data)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError('Something went wrong. Please try again.')
      setStep(1)
    }
  }

  // ── SUCCESS STATE ──────────────────────────────────────────────────────────
  if (status === 'success' && submittedData) {
    return (
      <div className="space-y-6">
        {/* Hero success */}
        <div className="text-center py-4">
          <div className="text-5xl mb-4">
            {isTrial ? '🎉' : '✅'}
          </div>
          <h3 className="text-lg font-bold text-white">Request Received!</h3>
          <p className="text-xs text-slate-400 mt-1">
            {isTrial ? 'Your trial will be activated within 1 hour.' : 'We\'ll contact you to confirm payment and activate.'}
          </p>
        </div>

        {/* Service badge */}
        <div className={`rounded-xl border p-4 flex items-center gap-3 ${
          isTrial
            ? 'border-emerald-500/20 bg-emerald-500/5'
            : 'border-indigo-500/20 bg-indigo-500/5'
        }`}>
          <div className="text-2xl">{isTrial ? '🎁' : '📋'}</div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
              {isTrial ? '3-Day Free Trial' : 'Book Request'}
            </p>
            <p className="text-sm font-bold text-white mt-0.5">{serviceName}</p>
          </div>
          <span className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full ${
            isTrial
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
          }`}>
            PENDING ACTIVATION
          </span>
        </div>

        {/* What happens next */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">What Happens Next</p>
          <ol className="space-y-2">
            {(isTrial ? [
              'Our team reviews your service requirements',
              'We configure your AI agent for your niche',
              `You receive login credentials at ${details.email}`,
              'Your 3-day trial begins immediately on activation',
              'After 3 days — upgrade for ₹9,999/mo to continue',
            ] : [
              'Our team reviews your booking request',
              'We contact you to confirm payment',
              `Service activated within 48 hours — credentials to ${details.email}`,
              'Full dashboard access to track all activity',
            ]).map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-xs text-slate-300">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Request ID */}
        <p className="text-center text-[10px] text-slate-500">
          Request ID: <span className="font-mono text-slate-400">{submittedData.id}</span>
        </p>

        <button
          onClick={() => { setStatus('idle'); setStep(1); setDetails({ name:'', email:'', phone:'', company:'', industry:'', message:'' }); setReqs(initialReqs) }}
          className="w-full text-xs text-indigo-400 hover:text-indigo-300 font-semibold hover:underline"
        >
          Submit another request
        </button>
      </div>
    )
  }

  // ── STYLES ─────────────────────────────────────────────────────────────────
  const INPUT = "w-full rounded-xl bg-slate-950/60 border border-slate-800 px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-500"
  const LABEL = "block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5"

  // ── STEP INDICATOR ─────────────────────────────────────────────────────────
  const StepIndicator = () => hasRequirements ? (
    <div className="flex items-center gap-2 mb-6">
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1
        const active = step === stepNum
        const done = step > stepNum
        return (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center border transition-all ${
                done ? 'bg-emerald-500 border-emerald-500 text-white' :
                active ? 'bg-indigo-600 border-indigo-500 text-white' :
                'bg-transparent border-slate-700 text-slate-500'
              }`}>
                {done ? '✓' : stepNum}
              </div>
              <span className={`text-[10px] font-semibold ${active ? 'text-white' : done ? 'text-emerald-400' : 'text-slate-500'}`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`flex-1 h-px mx-1 ${done ? 'bg-emerald-500/40' : 'bg-slate-800'}`} />
            )}
          </div>
        )
      })}
    </div>
  ) : null

  // ── STEP 1: DETAILS ───────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <form onSubmit={goNext} className="space-y-4">
        <StepIndicator />

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Full Name *</label>
            <input type="text" name="name" value={details.name} onChange={handleDetailsChange}
              required placeholder="Rahul Sharma" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Email Address *</label>
            <input type="email" name="email" value={details.email} onChange={handleDetailsChange}
              required placeholder="rahul@company.com" className={INPUT} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Phone Number</label>
            <input type="tel" name="phone" value={details.phone} onChange={handleDetailsChange}
              placeholder="+91 98765 43210" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Company Name *</label>
            <input type="text" name="company" value={details.company} onChange={handleDetailsChange}
              required placeholder="Your Company" className={INPUT} />
          </div>
        </div>

        <div>
          <label className={LABEL}>Industry</label>
          <select name="industry" value={details.industry} onChange={handleDetailsChange}
            className={`${INPUT} appearance-none cursor-pointer`} style={{ colorScheme: 'dark' }}>
            <option value="">Select Industry</option>
            {industries.map(i => (
              <option key={i} value={i} className="bg-slate-900 text-slate-100">{i}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL}>Additional Message</label>
          <textarea name="message" value={details.message} onChange={handleDetailsChange}
            rows={2} placeholder="Anything specific you'd like us to know..."
            className={`${INPUT} resize-none`} />
        </div>

        <button type="submit"
          className={`w-full rounded-xl py-3 text-xs font-bold text-white transition-all shadow-lg ${
            isTrial
              ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
              : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
          }`}>
          {hasRequirements ? 'Next: Service Requirements →' : (
            isTrial ? 'Start My Free Trial →' : 'Book Service →'
          )}
        </button>

        <p className="text-center text-[10px] text-slate-500">
          By submitting you agree to receive follow-up notes. We respect your privacy.
        </p>
      </form>
    )
  }

  // ── STEP 2: SERVICE REQUIREMENTS ─────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StepIndicator />

      <div className={`rounded-xl border p-3 mb-4 ${
        isTrial ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-indigo-500/20 bg-indigo-500/5'
      }`}>
        <p className="text-[11px] text-slate-400">
          <span className={`font-bold ${isTrial ? 'text-emerald-400' : 'text-indigo-400'}`}>
            {serviceName}
          </span>
          {' '}— Tell us how to configure your AI agent.
        </p>
      </div>

      {requirements.map(field => (
        <div key={field.field}>
          <label className={LABEL}>
            {field.label} {field.required && '*'}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              name={field.field}
              value={reqs[field.field]}
              onChange={handleReqChange}
              required={field.required}
              placeholder={field.placeholder}
              rows={3}
              className={`${INPUT} resize-none`}
            />
          ) : field.type === 'select' ? (
            <select
              name={field.field}
              value={reqs[field.field]}
              onChange={handleReqChange}
              required={field.required}
              className={`${INPUT} appearance-none cursor-pointer`}
              style={{ colorScheme: 'dark' }}
            >
              <option value="">Select...</option>
              {field.options.map(opt => (
                <option key={opt} value={opt} className="bg-slate-900 text-slate-100">{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              name={field.field}
              value={reqs[field.field]}
              onChange={handleReqChange}
              required={field.required}
              placeholder={field.placeholder}
              className={INPUT}
            />
          )}
        </div>
      ))}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex-1 rounded-xl border border-slate-700 hover:border-slate-600 bg-transparent py-3 text-xs font-semibold text-slate-400 hover:text-white transition-all"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`flex-1 rounded-xl py-3 text-xs font-bold text-white transition-all shadow-lg disabled:opacity-50 ${
            isTrial
              ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
              : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
          }`}
        >
          {status === 'loading'
            ? 'Submitting...'
            : isTrial ? '🎁 Start My Free Trial →' : '📋 Book Service →'
          }
        </button>
      </div>

      <p className="text-center text-[10px] text-slate-500">
        By submitting you agree to receive follow-up notes. We respect your privacy.
      </p>
    </form>
  )
}
