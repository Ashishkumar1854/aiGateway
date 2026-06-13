'use client'

import { useState } from 'react'
import { submitContactForm } from '@/lib/api'

const industries = [
  'E-commerce', 'Fitness & Wellness', 'Food & Beverage',
  'Real Estate', 'Education', 'Healthcare',
  'Technology', 'Retail', 'Finance', 'Other'
]

const ALL_SERVICES = [
  'Lead Generation Bot',
  'Email Agent Pitches',
  'Reels Automation Bot',
  'WhatsApp Flow Automation',
  'Personal Branding / Custom Project',
  'Other / Not Sure Yet',
]

export function ContactForm({ preSelectedService = '' }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    serviceInterest: preSelectedService || '',
    message: '',
  })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await submitContactForm(form)
      setStatus('success')
      setForm({ name: '', email: '', phone: '', company: '', industry: '', serviceInterest: '', message: '' })
    } catch (err) {
      setStatus('error')
      setError('Something went wrong. Please try again or email us directly.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-8 text-center">
        <span className="text-5xl">🎉</span>
        <h3 className="mt-4 text-lg font-bold text-white">Request received!</h3>
        {form.serviceInterest || preSelectedService ? (
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Your request to deploy <strong className="text-indigo-400">{preSelectedService || form.serviceInterest}</strong> has been logged.
            We will get back to you within <strong className="text-white">24 hours</strong> to schedule setup.
          </p>
        ) : (
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            We will review your inquiry and get back to you within 24 hours.
          </p>
        )}
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 font-semibold hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  const INPUT_STYLE = "w-full rounded-xl bg-slate-950/60 border border-slate-800 px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-500"
  const LABEL_STYLE = "block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* ── Service Interest (pre-filled or selectable) ── */}
      <div>
        <label className={LABEL_STYLE}>Service Interested In *</label>
        {preSelectedService ? (
          // Pre-filled badge when coming from "Deploy service" button
          <div className="flex items-center gap-2.5 rounded-xl px-4 py-3"
            style={{ background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <span className="text-base">🎯</span>
            <span className="text-xs font-bold text-indigo-300">{preSelectedService}</span>
            <span className="ml-auto text-[9px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(79,70,229,0.2)', color: '#818cf8' }}>
              Pre-selected
            </span>
            {/* Hidden input so form value is submitted */}
            <input type="hidden" name="serviceInterest" value={preSelectedService} />
          </div>
        ) : (
          // Dropdown if user came from generic /contact
          <select
            name="serviceInterest"
            value={form.serviceInterest}
            onChange={handleChange}
            required
            className={`${INPUT_STYLE} appearance-none cursor-pointer`}
            style={{ colorScheme: 'dark' }}
          >
            <option value="">Select a service</option>
            {ALL_SERVICES.map((s) => (
              <option key={s} value={s} className="bg-slate-900 text-slate-100">{s}</option>
            ))}
          </select>
        )}
      </div>

      {/* ── Name & Email ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <label className={LABEL_STYLE}>Email Address *</label>
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

      {/* ── Phone & Company ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL_STYLE}>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className={INPUT_STYLE}
          />
        </div>
        <div>
          <label className={LABEL_STYLE}>Company Name *</label>
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
      </div>

      {/* ── Industry ── */}
      <div>
        <label className={LABEL_STYLE}>Industry</label>
        <select
          name="industry"
          value={form.industry}
          onChange={handleChange}
          className={`${INPUT_STYLE} appearance-none cursor-pointer`}
          style={{ colorScheme: 'dark' }}
        >
          <option value="" className="bg-slate-900 text-slate-500">Select Industry</option>
          {industries.map((i) => (
            <option key={i} value={i} className="bg-slate-900 text-slate-100">{i}</option>
          ))}
        </select>
      </div>

      {/* ── Message ── */}
      <div>
        <label className={LABEL_STYLE}>Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={3}
          placeholder="Tell us about your business goals and what workflows you would like to automate..."
          className={`${INPUT_STYLE} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 disabled:opacity-50"
      >
        {status === 'loading'
          ? 'Submitting...'
          : preSelectedService
            ? `Deploy ${preSelectedService} →`
            : 'Submit Inquiry →'}
      </button>

      <p className="text-center text-[10px] text-slate-500 leading-relaxed">
        By submitting you agree to receive follow-up notes. We respect your privacy.
      </p>
    </form>
  )
}
