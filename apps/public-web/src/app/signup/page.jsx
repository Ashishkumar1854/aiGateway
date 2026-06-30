'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const services = [
  { id: 'lead-generation',     label: 'Lead Generation',    icon: '🎯' },
  { id: 'email-automation',    label: 'Email Automation',   icon: '📧' },
  { id: 'whatsapp-automation', label: 'WhatsApp Automation',icon: '💬' },
  { id: 'linkedin-automation', label: 'LinkedIn Automation',icon: '🔗' },
  { id: 'reels-automation',    label: 'Reels Automation',   icon: '🎬' },
  { id: 'job-seeker',          label: 'Smart Apply',         icon: '💼' },
]

function SignupForm() {
  const searchParams = useSearchParams()
  const preService = searchParams.get('service') || ''

  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', serviceInterest: preService, notes: '' })
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (preService) {
      setForm((f) => ({ ...f, serviceInterest: preService }))
    }
  }, [preService])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      const selectedServiceObj = services.find((s) => s.id === form.serviceInterest)
      const serviceLabel = selectedServiceObj ? selectedServiceObj.label : form.serviceInterest || 'Not Specified'

      const res = await fetch(`${BASE_URL}/api/v1/public/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          companyName: form.company,
          phone: form.phone || null,
          serviceName: serviceLabel,
          requestType: 'TRIAL',
          requirements: form.notes || null,
          message: `Onboarding Request from Signup Page for service: ${serviceLabel}`,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    const selectedServiceObj = services.find((s) => s.id === form.serviceInterest)
    const serviceLabel = selectedServiceObj ? selectedServiceObj.label : 'Our Service'

    return (
      <div className="rounded-2xl border border-emerald-200 bg-white p-10 text-center shadow-xl shadow-emerald-50">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-slate-900 mb-3">Request Submitted!</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          Our team will review your requirements and activate your trial for <strong className="text-slate-800">{serviceLabel}</strong> within <strong className="text-slate-800">24 hours</strong>. Check your email for login credentials.
        </p>
        <Link href="/" className="inline-block mt-8 px-6 py-2.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-all">
          Back to Home
        </Link>
      </div>
    )
  }

  const INPUT_STYLE = "w-full rounded-xl bg-white border border-slate-200 px-4 py-3.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-400 focus:bg-white"
  const LABEL_STYLE = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Details */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Your Details</h3>

        {status === 'error' && (
          <div className="rounded-xl px-4 py-3 text-xs bg-red-50 border border-red-200 text-red-600">
            Failed to submit. Please try again or email hello@aigateway.com
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_STYLE}>Full Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Rahul Sharma"
              className={INPUT_STYLE}
            />
          </div>
          <div>
            <label className={LABEL_STYLE}>Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="rahul@company.com"
              className={INPUT_STYLE}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_STYLE}>Company *</label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
              placeholder="Sharma Fitness Studio"
              className={INPUT_STYLE}
            />
          </div>
          <div>
            <label className={LABEL_STYLE}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 99999 88888"
              className={INPUT_STYLE}
            />
          </div>
        </div>

        <div>
          <label className={LABEL_STYLE}>Service Interested In *</label>
          <select
            name="serviceInterest"
            value={form.serviceInterest}
            onChange={handleChange}
            required
            className={`${INPUT_STYLE} appearance-none cursor-pointer`}
          >
            <option value="" className="text-slate-400">Select a service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id} className="text-slate-800">
                {s.icon} {s.label}
              </option>
            ))}
            <option value="custom" className="text-slate-800">Custom Automation Project</option>
          </select>
        </div>

        <div>
          <label className={LABEL_STYLE}>Notes / Requirements</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Any specific requirements or questions..."
            className={`${INPUT_STYLE} resize-none`}
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 py-4 text-sm font-bold text-white transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 hover:-translate-y-0.5"
      >
        {status === 'loading' ? '⏳ Submitting...' : '🚀 Start Free Trial →'}
      </button>

      <p className="text-center text-[10px] text-slate-400">
        No credit card required · Cancel anytime ·{' '}
        <Link href="/login" className="text-indigo-600 font-medium hover:underline">Already have an account?</Link>
      </p>
    </form>
  )
}

export default function SignupPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-white border-b border-slate-100 pt-24 pb-12">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Get Started Free
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-5xl tracking-tight mt-5 leading-tight">
            Start Your Free Trial
          </h1>
          <p className="mt-4 text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            Fill in your details to begin your 3-day free trial. Our team will verify and activate your account.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <Suspense fallback={<div className="text-center text-slate-400 py-10">Loading...</div>}>
            <SignupForm />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
