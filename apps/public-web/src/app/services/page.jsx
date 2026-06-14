import Link from 'next/link'
import { CTASection } from '@/components/CTASection'

export const metadata = {
  title: 'Services — AiGateway',
  description: 'Explore all AI-powered automation services offered by AiGateway.',
}

const details = [
  {
    icon: '🎯',
    name: 'Lead Generation Bot',
    desc: 'Our AI research agent scans business directories, maps, and LinkedIn to find ideal prospects matching your customer profile.',
    how: [
      'Searches Google Maps, LinkedIn, and local directories',
      'Scores each lead 0-100 based on your ICP criteria',
      'Enriches contact details (email, phone, address, site) automatically',
      'Syncs to your CRM pipeline in real-time as COLD leads',
      'Funnels lead data directly to outreach workflows',
    ],
    accent: 'from-orange-500/20 to-amber-500/20 border-orange-500/10'
  },
  {
    icon: '📧',
    name: 'Email Agent Pitches',
    desc: 'Writes, schedules, and sends highly personalized cold outreach drip campaigns.',
    how: [
      'Drafts personalized emails based on scraped notes & website data',
      'Coordinates multi-step follow-up sequences to maximize conversion',
      'Detects reply signals and alerts team on lead activity',
      'Requires human manual approval inside task queues before send',
      'Logs conversations directly to the lead timeline',
    ],
    accent: 'from-blue-500/20 to-indigo-500/20 border-blue-500/10'
  },
  {
    icon: '🎬',
    name: 'Reels Automation Bot',
    desc: 'Maintains regular brand exposure across YouTube and Instagram via automated clips creation.',
    how: [
      'AI generates scripts, hooks, and video captions',
      'Schedules uploads at peak hours for higher engagement',
      'Syndicates videos to multiple channels concurrently',
      'Provides visual performance analytics in report logs',
      'Saves manual editing resources entirely',
    ],
    accent: 'from-pink-500/20 to-rose-500/20 border-pink-500/10'
  },
  {
    icon: '💬',
    name: 'WhatsApp Flow Automation',
    desc: 'Keeps leads warm and captures inquiries where prospects communicate most.',
    how: [
      'Broadcasts text/media sequences to opt-in contacts',
      'Handles common questions instantly via NLP auto-replies',
      'Builds interactive conversational branches to qualify leads',
      'Automatically logs new inbound leads to the CRM database',
      'Maintains complete compliance with WhatsApp API rules',
    ],
    accent: 'from-green-500/20 to-emerald-500/20 border-green-500/10'
  },
]

const personalBrandingServices = [
  { icon: '🌐', name: 'Personal & Business Websites', desc: 'Stunning, fast Next.js sites with SEO optimization, CMS, and custom domains.' },
  { icon: '📊', name: 'Custom CRM Management', desc: 'Purpose-built CRM dashboards integrated with your sales and ops data.' },
  { icon: '⚙️', name: 'CRM Workflow Automation', desc: 'Auto-assign leads, trigger sequences, and build rule-based automation pipelines.' },
  { icon: '💬', name: 'WhatsApp CRM Integration', desc: 'Connect WhatsApp conversations directly into your CRM for full visibility.' },
  { icon: '🤖', name: 'Custom AI Bots & Scrapers', desc: 'Booking bots, support agents, knowledge-base chatbots, and data scrapers.' },
  { icon: '🎨', name: 'Brand Identity Kits', desc: 'Logo, color palette, typography systems, and visual guidelines for your brand.' },
]

export default function ServicesPage() {
  return (
    <div className="bg-[#08080f] text-slate-100 min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden pt-24 pb-20 border-b border-[#1e1e2e]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-indigo-550/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 relative z-10">
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Workforce
          </span>
          <h1 className="text-4xl font-extrabold text-white sm:text-6xl tracking-tight mt-5 leading-tight">Automated Services</h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed font-light">
            Deploy cooperation loops between pre-trained AI employees to run your lead intake, pitch writing, and scheduling pipelines.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-24 bg-[#08080f]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-20">
          {details.map((service, i) => (
            <div key={service.name} className={`flex flex-col gap-10 lg:flex-row items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Graphic Icon box */}
              <div className={`w-full lg:flex-1 rounded-2xl border border-[#1e1e2e] bg-[#111118]/50 flex items-center justify-center p-16 hover:border-indigo-500/20 transition-all duration-300 shadow-xl relative overflow-hidden group`}>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <span className="text-8xl select-none transform group-hover:scale-110 transition-transform duration-300">{service.icon}</span>
              </div>
              
              {/* Content box */}
              <div className="w-full lg:flex-1 space-y-5">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">{service.name}</h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">{service.desc}</p>
                <ul className="space-y-2.5">
                  {service.how.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-xs text-slate-350 font-light">
                      <span className="text-indigo-400 font-bold mt-0.5 select-none">✓</span>
                      {h}
                    </li>
                  ))}
                </ul>
                
                {/* CTA Buttons — Trial + Book */}
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.name)}&type=trial`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5"
                  >
                    🎁 Start Free Trial <span className="opacity-75 font-normal">(3 days)</span>
                  </Link>
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.name)}&type=book`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#1e1e2e] hover:border-indigo-500/30 bg-[#111118]/50 hover:bg-[#111118] px-6 py-3 text-xs font-bold text-slate-200 transition-all hover:-translate-y-0.5"
                  >
                    📋 Book Service <span className="opacity-60 font-normal">₹9,999/mo</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bespoke Personal Branding / Other Custom Services */}
      <section className="py-24 bg-gradient-to-b from-[#08080f] via-[#090912] to-[#08080f] border-t border-[#1e1e2e]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1.5 text-[10px] font-bold text-purple-400 bg-purple-500/10 rounded-full border border-purple-500/20 mb-4 tracking-wider uppercase">
              Bespoke Solutions
            </span>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight leading-tight">
              We build what you need, exactly how you need it
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed font-light">
              Beyond our core AI SaaS templates, AiGateway delivers custom branding kits, workflow automation, and custom web dashboards.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {personalBrandingServices.map((item) => (
              <div
                key={item.name}
                className="group rounded-2xl border border-[#1e1e2e] bg-[#111118]/30 p-6 hover:border-purple-500/20 hover:bg-[#111118] transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="text-2xl p-3 bg-[#08080f] border border-[#1e1e2e] rounded-xl w-fit mb-5 group-hover:bg-purple-950/20 group-hover:border-purple-800/40 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{item.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Custom CTA Box */}
          <div className="rounded-2xl border border-indigo-500/10 bg-gradient-to-r from-indigo-950/20 via-[#111118]/80 to-purple-950/20 p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 ring-1 ring-white/5">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Have a custom project in mind?</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl font-light">
                Submit your project details — from personal portfolio sites to bespoke CRM integrations. Our engineering team will review within 24 hours and send a transparent, fixed-price quote.
              </p>
            </div>
            <Link
              href="/other-services"
              className="flex-shrink-0 rounded-xl bg-indigo-650 hover:bg-indigo-500 px-6 py-3.5 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-600/20 whitespace-nowrap hover:-translate-y-0.5"
            >
              Explore Custom Solutions →
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
