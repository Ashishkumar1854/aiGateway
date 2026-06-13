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
      'Searches Google Maps, LinkedIn, and Indian directories',
      'Scores each lead 0-100 based on your ICP criteria',
      'Enriches contact details (email, phone, address, site) automatically',
      'Syncs to your CRM pipeline in real-time as COLD leads',
      'Funnels lead data directly to outreach workflows',
    ],
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
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pb-20 border-b border-slate-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 relative z-10">
          <h1 className="text-3xl font-extrabold text-white sm:text-5xl">Automated Services</h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Deploy cooperation loops between pre-trained AI employees to run your lead intake, pitch writing, and scheduling pipelines.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 bg-slate-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-16">
          {details.map((service, i) => (
            <div key={service.name} className={`flex flex-col gap-8 lg:flex-row items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="w-full lg:flex-1 rounded-2xl border border-slate-800 bg-slate-900/30 flex items-center justify-center p-12 hover:border-indigo-500/20 transition-all duration-300 shadow-xl">
                <span className="text-7xl animate-pulse">{service.icon}</span>
              </div>
              <div className="w-full lg:flex-1 space-y-4">
                <h2 className="text-2xl font-extrabold text-white">{service.name}</h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{service.desc}</p>
                <ul className="space-y-2">
                  {service.how.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="text-indigo-400 font-bold mt-0.5">✓</span>
                      {h}
                    </li>
                  ))}
                </ul>
                {/* CTA Buttons — Trial + Book */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.name)}&type=trial`}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-600/20"
                  >
                    🎁 Start Free Trial <span className="opacity-70 font-normal">(3 days)</span>
                  </Link>
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.name)}&type=book`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 hover:border-indigo-500/50 bg-slate-900/60 hover:bg-slate-800/60 px-5 py-2.5 text-xs font-bold text-slate-200 transition-all"
                  >
                    📋 Book Service <span className="opacity-60 font-normal">₹9,999/mo</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Personal Branding / Other Custom Services ─── */}
      <section className="py-20 bg-gradient-to-b from-slate-950 via-slate-950 to-indigo-950/20 border-t border-slate-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-violet-400 bg-violet-500/10 rounded-full border border-violet-500/20 mb-4">
              Personal Branding & Custom Solutions
            </span>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              We Build What You Need, Exactly How You Need It
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
              Beyond our core SaaS plans, AiGateway delivers fully bespoke digital solutions — personal websites, CRM systems, workflow automation, and custom AI integrations tailored to your business.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {personalBrandingServices.map((item) => (
              <div
                key={item.name}
                className="group rounded-2xl border border-slate-800/80 bg-slate-900/20 p-6 hover:border-violet-500/30 hover:bg-slate-900/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/5"
              >
                <div className="text-2xl p-3 bg-slate-900 border border-slate-800 rounded-xl w-fit mb-4 group-hover:bg-violet-950/20 group-hover:border-violet-800/40 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{item.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          <div className="rounded-2xl border border-violet-800/30 bg-gradient-to-r from-violet-950/20 via-slate-950 to-indigo-950/20 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Have a custom project in mind?</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
                Submit your project scope — from a simple personal website to a fully custom CRM with AI automation pipelines. We review every request within 24 hours and provide a fixed-price quote.
              </p>
            </div>
            <Link
              href="/other-services"
              className="flex-shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-6 py-3 text-sm font-bold text-white transition-all shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 whitespace-nowrap"
            >
              Explore Personal Branding →
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
