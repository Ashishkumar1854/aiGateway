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
      <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        <span className="text-5xl">🎉</span>
        <h3 className="mt-5 text-lg font-bold text-white">Request received!</h3>
        {form.serviceInterest || preSelectedService ? (
          <p className="mt-3 text-xs text-slate-400 leading-relaxed font-light">
            Your request to deploy <strong className="text-indigo-400">{preSelectedService || form.serviceInterest}</strong> has been logged.
            We will get back to you within <strong className="text-white">24 hours</strong> to schedule setup.
          </p>
        ) : (
          <p className="mt-3 text-xs text-slate-400 leading-relaxed font-light">
            We will review your inquiry and get back to you within 24 hours.
          </p>
        )}
        <button
          onClick={() => setStatus('idle')}
          className="mt-5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  const INPUT_STYLE = "w-full rounded-xl bg-[#08080f] border border-[#1e1e2e] px-4 py-3.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-600 focus:bg-[#08080f]/90"
  const LABEL_STYLE = "block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Service Interest */}
      <div>
        <label className={LABEL_STYLE}>Service Interested In *</label>
        {preSelectedService ? (
          <div className="flex items-center gap-3 rounded-xl px-4 py-3.5 bg-indigo-500/5 border border-indigo-500/25">
            <span className="text-base">🎯</span>
            <span className="text-xs font-bold text-indigo-300">{preSelectedService}</span>
            <span className="ml-auto text-[9px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Pre-selected
            </span>
            <input type="hidden" name="serviceInterest" value={preSelectedService} />
          </div>
        ) : (
          <select
            name="serviceInterest"
            value={form.serviceInterest}
            onChange={handleChange}
            required
            className={`${INPUT_STYLE} appearance-none cursor-pointer`}
            style={{ colorScheme: 'dark' }}
          >
            <option value="" className="bg-[#08080f] text-slate-500">Select a service</option>
            {ALL_SERVICES.map((s) => (
              <option key={s} value={s} className="bg-[#111118] text-slate-100">{s}</option>
            ))}
          </select>
        )}
      </div>

      {/* Name & Email */}
      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
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

      {/* Phone & Company */}
      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
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

      {/* Industry */}
      <div>
        <label className={LABEL_STYLE}>Industry</label>
        <select
          name="industry"
          value={form.industry}
          onChange={handleChange}
          className={`${INPUT_STYLE} appearance-none cursor-pointer`}
          style={{ colorScheme: 'dark' }}
        >
          <option value="" className="bg-[#08080f] text-slate-500">Select Industry</option>
          {industries.map((i) => (
            <option key={i} value={i} className="bg-[#111118] text-slate-100">{i}</option>
          ))}
        </select>
      </div>

      {/* Message */}
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
        className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-4 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 disabled:opacity-50 hover:-translate-y-0.5"
      >
        {status === 'loading'
          ? 'Submitting...'
          : preSelectedService
            ? `Deploy ${preSelectedService} →`
            : 'Submit Inquiry →'}
      </button>

      <p className="text-center text-[10px] text-slate-500 leading-relaxed font-light">
        By submitting you agree to receive follow-up notes. We respect your privacy.
      </p>
    </form>
  )
}
