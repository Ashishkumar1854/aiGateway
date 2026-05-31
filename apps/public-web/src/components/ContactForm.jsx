'use client'

import { useState } from 'react'
import { submitContactForm } from '@/lib/api'

const industries = [
  'E-commerce', 'Fitness & Wellness', 'Food & Beverage',
  'Real Estate', 'Education', 'Healthcare',
  'Technology', 'Retail', 'Finance', 'Other'
]

export function ContactForm() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', industry: '', message: ''
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
      setForm({ name: '', email: '', phone: '', company: '', industry: '', message: '' })
    } catch (err) {
      setStatus('error')
      setError('Something went wrong. Please try again or email us directly.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <span className="text-5xl">🎉</span>
        <h3 className="mt-4 text-xl font-bold text-slate-900">Message received!</h3>
        <p className="mt-2 text-slate-500">We'll get back to you within 24 hours.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-indigo-600 hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Rahul Sharma"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="rahul@company.com"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            required
            placeholder="Your Company"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
        <select
          name="industry"
          value={form.industry}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select industry</option>
          {industries.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          placeholder="Tell us about your business and what you want to automate..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message →'}
      </button>

      <p className="text-center text-xs text-slate-400">
        We reply within 24 hours. No spam, ever.
      </p>
    </form>
  )
}
