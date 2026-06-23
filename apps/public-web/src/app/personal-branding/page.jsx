'use client'

import { useState } from 'react'
import Link from 'next/link'
import { submitCustomRequest } from '@/lib/api'

const CAPABILITY_CARDS = [
  {
    icon: '🌐',
    title: 'Personal & Business Websites',
    desc: 'Stunning Next.js sites with SEO, CMS, and custom domains. Fully responsive, blazing fast, and built to convert.',
    examples: ['Portfolio sites', 'SaaS landing pages', 'E-commerce stores', 'Startup microsites'],
    badge: 'Most Popular',
    badgeColor: '#4f46e5',
  },
  {
    icon: '📊',
    title: 'Custom CRM Management',
    desc: 'Purpose-built CRM dashboards integrated with your sales data — leads, pipelines, tasks, and reporting in one view.',
    examples: ['HubSpot / Salesforce integrations', 'Custom DB CRM', 'Sales pipeline boards', 'Client management'],
    badge: 'High Demand',
    badgeColor: '#059669',
  },
  {
    icon: '⚙️',
    title: 'CRM Workflow Automation',
    desc: 'Auto-assign leads, trigger follow-up sequences, and build intelligent rule-based pipelines without code.',
    examples: ['Lead auto-assignment', 'Drip follow-ups', 'Notification triggers', 'Stage-based automation'],
    badge: null,
    badgeColor: null,
  },
  {
    icon: '💬',
    title: 'WhatsApp CRM Integration',
    desc: 'Connect WhatsApp Cloud API to your CRM. Every chat becomes a trackable, managed lead in your pipeline.',
    examples: ['Team inbox', 'Auto-replies', 'Broadcast campaigns', 'Inbound lead capture'],
    badge: null,
    badgeColor: null,
  },
  {
    icon: '👑',
    title: 'Custom AI Bots & Scrapers',
    desc: 'From booking bots to knowledge-base agents and data scrapers — deployed to your specs with full documentation.',
    examples: ['LLM knowledge bots', 'Appointment bots', 'Data enrichment scrapers', 'Support agents'],
    badge: 'AI-Powered',
    badgeColor: '#7c3aed',
  },
  {
    icon: '🎨',
    title: 'Brand Identity & Design',
    desc: 'Complete visual brand systems — logo design, color palettes, typography guides, and UI component libraries.',
    examples: ['Logo design', 'Brand guidelines', 'UI design systems', 'Social media kits'],
    badge: null,
    badgeColor: null,
  },
]

const PROCESS = [
  { step: '01', icon: '📝', title: 'Submit Scope', desc: 'Fill the form below with your project name, requirements, and budget.' },
  { step: '02', icon: '📞', title: 'Scoping Call', desc: 'Our team books a free 30-min call to clarify details and agree on deliverables.' },
  { step: '03', icon: '💰', title: 'Fixed Quote', desc: 'We send a fixed-price, no-surprises quote with a clear timeline and milestones.' },
  { step: '04', icon: '🚀', title: 'Build & Deliver', desc: 'We build, test, and deploy to your infrastructure. Full handover with documentation.' },
]

const PRICING_RANGES = [
  { type: 'Simple Website / Landing Page', range: '₹15,000 – ₹30,000', timeline: '3-5 days' },
  { type: 'Custom CRM / Dashboard', range: '₹30,000 – ₹75,000', timeline: '1-2 weeks' },
  { type: 'CRM + Automation Pipelines', range: '₹50,000 – ₹1,50,000', timeline: '2-3 weeks' },
  { type: 'WhatsApp CRM Integration', range: '₹30,000 – ₹1,50,000', timeline: '1-3 weeks' },
  { type: 'Custom AI Bot / Scraper', range: '₹75,000 – ₹2,00,000+', timeline: '2-4 weeks' },
  { type: 'Enterprise / Full Platform', range: 'Custom Quote', timeline: 'Custom Timeline' },
]

export default function PersonalBrandingPage() {
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    projectName: '',
    requirements: '',
    budget: '',
  })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await submitCustomRequest(form)
      setStatus('success')
      setForm({ companyName: '', contactName: '', email: '', phone: '', projectName: '', requirements: '', budget: '' })
    } catch (err) {
      setStatus('error')
      setError('Failed to submit. Please check your network or email us directly at hello@aigateway.com')
    }
  }

  return (
    <div className="bg-white text-slate-800 min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-24 border-b border-slate-100 bg-white">
        {/* Background glows */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(79,70,229,0.04) 0%, transparent 70%)' }} />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)', color: '#6d28d9' }}>
              <span className="text-base">✨</span> Personal Branding & Custom Development
            </div>
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl leading-tight tracking-tight">
              <span className="text-slate-900">
                We Build What<br />You Envision
              </span>
            </h1>
            <p className="mt-5 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Beyond our SaaS plans, AiGateway delivers fully bespoke digital solutions — personal websites, CRM systems,
              WhatsApp automation, brand identity, and custom AI tools tailored precisely to your business.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#scope-form"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg shadow-indigo-100"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
              >
                Submit Your Project <span>→</span>
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all border border-slate-200 bg-white hover:bg-slate-55 text-slate-600 hover:-translate-y-0.5"
              >
                View Pricing Guide
              </a>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: '48h', label: 'First Delivery Target' },
              { value: '6+', label: 'Service Categories' },
              { value: '₹15K', label: 'Starting Budget' },
              { value: '100%', label: 'Fixed Price Quotes' },
            ].map(stat => (
              <div key={stat.label} className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-200/60 shadow-sm">
                <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {stat.value}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capability Cards ── */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">What We Build For You</h2>
            <p className="mt-3 text-sm text-slate-500">Pick one or combine multiple — we scope, quote, and deliver.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITY_CARDS.map((cap) => (
              <div
                key={cap.title}
                className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 bg-white border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/50"
              >
                {/* Badge */}
                {cap.badge && (
                  <span className="absolute top-4 right-4 text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${cap.badgeColor}12`, color: cap.badgeColor, border: `1px solid ${cap.badgeColor}30` }}>
                    {cap.badge}
                  </span>
                )}

                <div className="text-3xl p-3 w-fit rounded-xl mb-4 bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                  {cap.icon}
                </div>

                <h3 className="text-sm font-bold text-slate-800 mb-2">{cap.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{cap.desc}</p>

                <div className="flex flex-wrap gap-1.5">
                  {cap.examples.map(ex => (
                    <span key={ex} className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50/50 text-indigo-650 border border-indigo-100/50 font-medium">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">How It Works</h2>
            <p className="mt-2 text-xs text-slate-500">From idea to delivery in a structured, transparent process.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROCESS.map((p, i) => (
              <div key={p.step} className="relative">
                {i < PROCESS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px z-0 bg-gradient-to-r from-slate-200 to-transparent" />
                )}
                <div className="relative z-10 p-5 rounded-2xl text-center bg-slate-50 border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
                  <div className="text-3xl mb-3">{p.icon}</div>
                  <div className="text-[10px] font-black mb-1 text-indigo-600">{p.step}</div>
                  <h3 className="text-sm font-bold text-slate-800 mb-2">{p.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Guide ── */}
      <section id="pricing" className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Pricing Guide</h2>
            <p className="mt-2 text-xs text-slate-550">All prices are indicative. Exact quote given after scoping call. No surprise billing.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="text-left px-5 py-3.5 font-bold text-slate-600">Project Type</th>
                  <th className="text-right px-5 py-3.5 font-bold text-slate-600">Budget Range</th>
                  <th className="text-right px-5 py-3.5 font-bold text-slate-600 hidden sm:table-cell">Timeline</th>
                </tr>
              </thead>
              <tbody>
                {PRICING_RANGES.map((item, i) => (
                  <tr
                    key={item.type}
                    className={`border-b last:border-0 border-slate-150 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                  >
                    <td className="px-5 py-3.5 text-slate-700 font-medium">{item.type}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-indigo-600">{item.range}</td>
                    <td className="px-5 py-3.5 text-right text-slate-500 hidden sm:table-cell">{item.timeline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-4">
            * Enterprise projects with multiple modules get volume pricing. Submit your scope for a custom quote.
          </p>
        </div>
      </section>

      {/* ── Project Scope Form ── */}
      <section id="scope-form" className="py-20 bg-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Submit Your Project</h2>
            <p className="mt-2 text-sm text-slate-500">Tell us what you need. We&apos;ll review and respond within 24 hours.</p>
          </div>

          <div className="rounded-2xl p-7 sm:p-9 relative overflow-hidden bg-slate-50 border border-slate-200 shadow-xl">
            {/* Gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-px pointer-events-none bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />

            {status === 'success' ? (
              <div className="text-center py-8" id="custom-success-container">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Project Scope Submitted!</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Your request has been sent to our engineering team. We&apos;ll review your scope and reach out within <strong className="text-slate-800">24 hours</strong> with a timeline and quote.
                </p>
                <div className="mt-6 p-4 rounded-xl text-xs text-slate-500 text-left max-w-xs mx-auto bg-white border border-slate-200">
                  <p className="font-semibold text-slate-800 mb-2">What happens next:</p>
                  <ul className="space-y-1">
                    <li>✓ Admin reviews your scope</li>
                    <li>✓ We email you a scoping call invite</li>
                    <li>✓ Fixed-price quote within 24 hours</li>
                  </ul>
                </div>
                <button
                  id="reset-form-btn"
                  onClick={() => setStatus('idle')}
                  className="mt-6 px-5 py-2.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                >
                  Submit Another Project
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10" id="other-services-form">
                {error && (
                  <div className="rounded-xl px-4 py-3 text-xs bg-red-50 border border-red-200 text-red-650" id="form-error-msg">
                    {error}
                  </div>
                )}

                {/* Row 1 */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-500" htmlFor="contactName">
                      Your Name *
                    </label>
                    <input
                      id="contactName" type="text" name="contactName"
                      value={form.contactName} onChange={handleChange} required
                      placeholder="Vikram Singh"
                      className="w-full rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-500" htmlFor="companyName">
                      Company Name *
                    </label>
                    <input
                      id="companyName" type="text" name="companyName"
                      value={form.companyName} onChange={handleChange} required
                      placeholder="Acme Automations"
                      className="w-full rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-500" htmlFor="email">
                      Email Address *
                    </label>
                    <input
                      id="email" type="email" name="email"
                      value={form.email} onChange={handleChange} required
                      placeholder="vikram@acme.com"
                      className="w-full rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-500" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      id="phone" type="tel" name="phone"
                      value={form.phone} onChange={handleChange}
                      placeholder="+91 99999 88888"
                      className="w-full rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Project Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-500" htmlFor="projectName">
                    Project Name *
                  </label>
                  <input
                    id="projectName" type="text" name="projectName"
                    value={form.projectName} onChange={handleChange} required
                    placeholder="E.g. WhatsApp Bot for Appointment Booking"
                    className="w-full rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all placeholder-slate-400"
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-500" htmlFor="budget">
                    Estimated Budget *
                  </label>
                  <select
                    id="budget" name="budget"
                    value={form.budget} onChange={handleChange} required
                    className="w-full rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all cursor-pointer"
                  >
                    <option value="" className="text-slate-400">Select budget range</option>
                    <option value="₹15,000 - ₹30,000">₹15,000 – ₹30,000</option>
                    <option value="₹30,000 - ₹75,000">₹30,000 – ₹75,000</option>
                    <option value="₹75,000 - ₹2,00,000">₹75,000 – ₹2,00,000</option>
                    <option value="₹2,00,000+">₹2,00,000+ (Enterprise)</option>
                  </select>
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-500" htmlFor="requirements">
                    Project Requirements *
                  </label>
                  <textarea
                    id="requirements" name="requirements"
                    value={form.requirements} onChange={handleChange} required rows={5}
                    placeholder="Describe what you need — workflows to automate, tools you use, specific integrations, or features you want built..."
                    className="w-full rounded-xl px-4 py-2.5 text-xs text-slate-850 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all resize-none leading-relaxed placeholder-slate-400"
                  />
                </div>

                <button
                  id="submit-project-btn"
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all mt-2 disabled:opacity-50 hover:-translate-y-0.5 shadow-lg shadow-indigo-100"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  }}
                >
                  {status === 'loading' ? '⏳ Submitting...' : '🚀 Submit Custom Project →'}
                </button>

                <p className="text-center text-[10px] text-slate-400 mt-3">
                  By submitting, you agree to allow our team to contact you via the provided details.
                  No spam — just your project update.
                </p>
              </form>
            )}
          </div>

          {/* Alternate Contact */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">Prefer to chat directly?</p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <a href="mailto:hello@aigateway.com" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                📧 hello@aigateway.com
              </a>
              <span className="text-slate-350">·</span>
              <Link href="/contact" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                Contact Page →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
