import Link from 'next/link'
import { CTASection } from '@/components/CTASection'

export const metadata = {
  title: 'Services — AiGateway',
  description: 'Explore all AI-powered automation services offered by AiGateway — Lead Generation, Email, WhatsApp, LinkedIn, and Reels.',
}

const saasDetails = [
  {
    icon: '🎯',
    name: 'Lead Generation',
    slug: 'lead-generation',
    desc: 'Our AI research agent scans business directories, maps, and LinkedIn to find ideal prospects matching your customer profile.',
    how: [
      'Searches Google Maps, LinkedIn, and local directories',
      'Scores each lead 0-100 based on your ICP criteria',
      'Enriches contact details (email, phone, address, site) automatically',
      'Syncs to your CRM pipeline in real-time as COLD leads',
      'Funnels lead data directly to outreach workflows',
    ],
  },
  {
    icon: '📧',
    name: 'Email Automation',
    slug: 'email-automation',
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
    icon: '💬',
    name: 'WhatsApp Automation',
    slug: 'whatsapp-automation',
    desc: 'Keeps leads warm and captures inquiries where prospects communicate most.',
    how: [
      'Broadcasts text/media sequences to opt-in contacts',
      'Handles common questions instantly via NLP auto-replies',
      'Builds interactive conversational branches to qualify leads',
      'Automatically logs new inbound leads to the CRM database',
      'Maintains complete compliance with WhatsApp API rules',
    ],
  },
  {
    icon: '🔗',
    name: 'LinkedIn Automation',
    slug: 'linkedin-automation',
    desc: 'Automates LinkedIn outreach — connection requests, personalized followups, and prospect discovery.',
    how: [
      'Sends targeted connection requests to decision-makers',
      'AI generates personalized follow-up messages based on profile data',
      'Continuously discovers new prospects matching your ICP',
      'Tracks acceptance rates, responses, and profile visit analytics',
      'Built-in safety limits to protect your LinkedIn account',
    ],
  },
  {
    icon: '🎬',
    name: 'Reels Automation',
    slug: 'reels-automation',
    desc: 'Maintains regular brand exposure across YouTube and Instagram via automated content creation.',
    how: [
      'AI generates scripts, hooks, and video captions',
      'Schedules uploads at peak hours for higher engagement',
      'Syndicates videos to multiple channels concurrently',
      'Provides visual performance analytics in report logs',
      'Saves manual editing resources entirely',
    ],
  },
  {
    icon: '💼',
    name: 'Job Seeker',
    slug: 'job-seeker',
    desc: 'Deploy your personal AI job search assistant. Scrape listings, find recruiter emails, optimize your resume for ATS, auto-apply, and track dashboard replies.',
    how: [
      'AI drafts highly targeted outreach copy matching your resume with the job description',
      'Automatically matches keywords to bypass Applicant Tracking Systems (ATS)',
      'Finds direct HR/recruiter emails via LinkedIn and company careers directories',
      'Submits applications automatically with proper resume attachments',
      'Provides full dashboard response tracking, open receipts, and scheduling replies',
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
    <div className="bg-white text-slate-800 min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden pt-24 pb-20 border-b border-slate-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-indigo-100/60 rounded-full blur-[120px] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 relative z-10">
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Workforce
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-6xl tracking-tight mt-5 leading-tight">All Services</h1>
          <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Six powerful SaaS automation services plus custom development solutions for your business.
          </p>
        </div>
      </section>

      {/* SaaS Services List */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-20">
          {saasDetails.map((service, i) => (
            <div key={service.name} className={`flex flex-col gap-10 lg:flex-row items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Graphic Icon box */}
              <div className="w-full lg:flex-1 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center p-16 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/60 transition-all duration-300 shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-indigo-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <span className="text-8xl select-none transform group-hover:scale-110 transition-transform duration-300">{service.icon}</span>
              </div>

              {/* Content box */}
              <div className="w-full lg:flex-1 space-y-5">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{service.name}</h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{service.desc}</p>
                <ul className="space-y-2.5">
                  {service.how.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-xs text-slate-500">
                      <span className="text-indigo-600 font-bold mt-0.5 select-none">✓</span>
                      {h}
                    </li>
                  ))}
                </ul>

                {/* CTA Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.name)}&type=trial`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-3 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-100 hover:-translate-y-0.5"
                  >
                    🎁 Start Free Trial <span className="opacity-75 font-normal">(3 days)</span>
                  </Link>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 hover:border-indigo-200 bg-white hover:bg-slate-50 px-6 py-3 text-xs font-bold text-slate-600 transition-all hover:-translate-y-0.5"
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Personal Branding Services */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1.5 text-[10px] font-bold text-purple-600 bg-purple-50 rounded-full border border-purple-100 mb-4 tracking-wider uppercase">
              Bespoke Solutions
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight leading-tight">
              We build what you need, exactly how you need it
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed">
              Beyond our core AI SaaS templates, AiGateway delivers custom branding kits, workflow automation, and custom web dashboards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {personalBrandingServices.map((item) => (
              <div
                key={item.name}
                className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-50/60 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="text-2xl p-3 bg-slate-50 border border-slate-100 rounded-xl w-fit mb-5 group-hover:bg-purple-50 group-hover:border-purple-200 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-2">{item.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/50 p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 ring-1 ring-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Have a custom project in mind?</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                Submit your project details — from personal portfolio sites to bespoke CRM integrations. Our engineering team will review within 24 hours and send a transparent, fixed-price quote.
              </p>
            </div>
            <Link
              href="/personal-branding"
              className="flex-shrink-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-3.5 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-100 whitespace-nowrap hover:-translate-y-0.5"
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
