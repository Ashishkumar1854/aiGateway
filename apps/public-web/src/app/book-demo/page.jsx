'use client'

import { useState } from 'react'

export default function BookDemoPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    meetingDate: '',
    meetingTime: '',
    requirements: '',
  })
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      const res = await fetch(`${BASE_URL}/api/v1/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: form.company,
          contactName: form.name,
          email: form.email,
          source: 'website_demo_booking',
          notes: `[DEMO BOOKING]\nPreferred Date: ${form.meetingDate}\nPreferred Time: ${form.meetingTime}\n\nRequirements: ${form.requirements}`,
          status: 'COLD',
          score: 25,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
      setForm({ name: '', email: '', company: '', meetingDate: '', meetingTime: '', requirements: '' })
    } catch {
      setStatus('error')
    }
  }

  const INPUT_STYLE = "w-full rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500/40 transition-colors focus:ring-2 focus:ring-indigo-100 placeholder-slate-400"
  const LABEL_STYLE = "block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5"

  return (
    <div className="bg-white text-slate-800 min-h-screen">
      <section className="relative overflow-hidden pt-24 pb-20 border-b border-slate-100 bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-indigo-100/60 rounded-full blur-[120px] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 relative z-10">
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Book Demo
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight mt-5 leading-tight">
            See AiGateway in Action
          </h1>
          <p className="mt-4 text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Book a free 30-minute demo with our team. We&apos;ll walk you through the platform and show you how AI automation can transform your business.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Benefits */}
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold text-slate-900">What you&apos;ll see in the demo</h2>
              <div className="space-y-5">
                {[
                  { icon: '🎯', title: 'Live Lead Generation', desc: 'Watch our AI scrape and enrich leads from Google Maps in real-time.' },
                  { icon: '📧', title: 'Email Outreach Flow', desc: 'See how AI drafts personalized emails and the human approval queue works.' },
                  { icon: '📊', title: 'CRM Dashboard Tour', desc: 'Explore the full CRM pipeline, lead scoring, and analytics dashboard.' },
                  { icon: '💬', title: 'WhatsApp Integration', desc: 'See automated WhatsApp flows, broadcasts, and lead qualification in action.' },
                  { icon: '🛡️', title: 'Human-in-Loop Controls', desc: 'Understand how every automated action requires your explicit approval.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <span className="text-xl p-2.5 bg-white border border-slate-200 rounded-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{item.title}</p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 mt-6">
                <p className="text-xs text-indigo-700 font-semibold">✨ Free · 30 minutes · No commitment required</p>
              </div>
            </div>

            {/* Right: Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 shadow-xl">
              {status === 'success' ? (
                <div className="text-center py-8 animate-in fade-in zoom-in-95 duration-200">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Demo Booked!</h3>
                  <p className="text-sm text-slate-550 max-w-sm mx-auto leading-relaxed">
                    Our team will confirm your demo slot and send a calendar invite to your email within <strong className="text-slate-800">24 hours</strong>.
                  </p>
                  <button onClick={() => setStatus('idle')} className="mt-6 px-5 py-2.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-all">
                    Book Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Schedule Your Demo</h3>

                  {status === 'error' && (
                    <div className="rounded-xl px-4 py-3 text-xs bg-red-50 border border-red-200 text-red-600">
                      Failed to submit. Please try again or email hello@aigateway.com
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL_STYLE}>Name *</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Your name"
                        className={INPUT_STYLE} />
                    </div>
                    <div>
                      <label className={LABEL_STYLE}>Email *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@company.com"
                        className={INPUT_STYLE} />
                    </div>
                  </div>

                  <div>
                    <label className={LABEL_STYLE}>Company *</label>
                    <input type="text" name="company" value={form.company} onChange={handleChange} required placeholder="Company name"
                      className={INPUT_STYLE} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL_STYLE}>Preferred Date *</label>
                      <input type="date" name="meetingDate" value={form.meetingDate} onChange={handleChange} required
                        className={INPUT_STYLE} />
                    </div>
                    <div>
                      <label className={LABEL_STYLE}>Preferred Time *</label>
                      <input type="time" name="meetingTime" value={form.meetingTime} onChange={handleChange} required
                        className={INPUT_STYLE} />
                    </div>
                  </div>

                  <div>
                    <label className={LABEL_STYLE}>Requirements</label>
                    <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={3}
                      placeholder="Tell us what you'd like to see in the demo..."
                      className={`${INPUT_STYLE} resize-none`} />
                  </div>

                  <button type="submit" disabled={status === 'loading'}
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 py-3.5 text-sm font-bold text-white transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 hover:-translate-y-0.5">
                    {status === 'loading' ? '⏳ Booking...' : '🎯 Book Free Demo →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
