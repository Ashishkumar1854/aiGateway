import Link from 'next/link'
import { CTASection } from '@/components/CTASection'

export const metadata = {
  title: 'About — AiGateway',
  description: 'Learn about AiGateway — AI-powered business automation platform serving India, UK, USA, Canada, and Dubai.',
}

const values = [
  {
    icon: '🛡️',
    title: 'Human-First Automation',
    desc: 'Every automated action requires explicit human approval. We believe in AI that empowers people, not replaces them.',
  },
  {
    icon: '🎯',
    title: 'Results-Driven',
    desc: 'We measure success by leads generated, meetings booked, and revenue earned — not vanity metrics.',
  },
  {
    icon: '🔒',
    title: 'Transparent & Secure',
    desc: 'No hidden fees, no surprise billing, no data selling. Your business data stays yours, always.',
  },
  {
    icon: '🌍',
    title: 'Global, Local Focus',
    desc: 'Serving businesses across India, UK, USA, Canada, and Dubai with localized pricing and support.',
  },
]

const stats = [
  { value: '500+', label: 'Businesses Served' },
  { value: '5', label: 'Countries' },
  { value: '24h', label: 'Setup Time' },
  { value: '99.9%', label: 'Uptime' },
]

export default function AboutPage() {
  return (
    <div className="bg-white text-slate-800 min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden pt-24 pb-20 border-b border-slate-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-indigo-100/60 rounded-full blur-[120px] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 relative z-10">
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            About Us
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-6xl tracking-tight mt-5 leading-tight">About AiGateway</h1>
          <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Empowering modern businesses with AI-powered automation that works around the clock, across the globe.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stat.value}</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
                Our Mission
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
                Making AI automation accessible to every business
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                AiGateway was built with one goal: give small and medium businesses access to enterprise-grade AI automation without the enterprise price tag. We believe every business deserves intelligent tools that work for them 24/7.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Our platform deploys specialized AI employees — not just simple scripts — that research leads, draft outreach sequences, automate WhatsApp conversations, and manage your entire sales pipeline. All under complete human oversight.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 space-y-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">What we believe</h3>
              {[
                'AI should augment humans, not replace them',
                'Automation should be transparent and controllable',
                'Enterprise tools should be affordable for SMBs',
                'Every business deserves a 24/7 sales team',
              ].map((belief) => (
                <div key={belief} className="flex items-start gap-3">
                  <span className="text-indigo-600 font-bold mt-0.5">✓</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{belief}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-indigo-250 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-50/20">
                <div className="text-2xl mb-3">{v.icon}</div>
                <h3 className="text-sm font-bold text-slate-800 mb-2">{v.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-24 border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight mb-4">Serving Businesses Globally</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed mb-12">
            AiGateway operates across five countries, providing localized pricing, timezone-optimized support, and region-specific integrations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { flag: '🇮🇳', country: 'India' },
              { flag: '🇬🇧', country: 'United Kingdom' },
              { flag: '🇺🇸', country: 'United States' },
              { flag: '🇨🇦', country: 'Canada' },
              { flag: '🇦🇪', country: 'Dubai / UAE' },
            ].map((loc) => (
              <div key={loc.country} className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-4 flex items-center gap-3 hover:border-indigo-500/20 transition-all hover:shadow-md">
                <span className="text-2xl">{loc.flag}</span>
                <span className="text-xs font-semibold text-slate-800">{loc.country}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
