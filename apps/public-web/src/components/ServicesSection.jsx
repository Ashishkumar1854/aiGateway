import Link from 'next/link'

const services = [
  {
    icon: '🎯',
    name: 'Lead Generation',
    slug: 'lead-generation',
    desc: 'AI finds your ideal customers automatically from Google Maps, LinkedIn & business directories.',
    features: ['Search Businesses', 'Google Maps', 'LinkedIn', 'Lead Enrichment', 'Exports', 'CRM Sync'],
    topBorder: 'border-t-[3px] border-t-indigo-500',
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    price: { inr: '₹4,999', usd: '$59' },
  },
  {
    icon: '📧',
    name: 'Email Automation',
    slug: 'email-automation',
    desc: 'Personalized outreach campaigns at scale with human approval before every send.',
    features: ['Campaign Builder', 'Followups', 'Reply Tracking', 'Human Approval', 'Reports'],
    topBorder: 'border-t-[3px] border-t-purple-500',
    iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
    price: { inr: '₹3,999', usd: '$49' },
  },
  {
    icon: '💬',
    name: 'WhatsApp Automation',
    slug: 'whatsapp-automation',
    desc: 'Automated broadcasts, flows & lead qualification conversations on WhatsApp.',
    features: ['Broadcasts', 'Flows', 'Lead Qualification', 'CRM Integration', 'Analytics'],
    topBorder: 'border-t-[3px] border-t-green-500',
    iconBg: 'bg-green-50 text-green-600 border-green-100',
    price: { inr: '₹3,999', usd: '$49' },
  },
  {
    icon: '🔗',
    name: 'LinkedIn Automation',
    slug: 'linkedin-automation',
    desc: 'Connect, follow up & prospect on LinkedIn with AI-driven outreach sequences.',
    features: ['Connection Requests', 'Followups', 'Prospect Discovery', 'Outreach Tracking'],
    topBorder: 'border-t-[3px] border-t-blue-500',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
    price: { inr: '₹4,499', usd: '$55' },
  },
  {
    icon: '🎬',
    name: 'Reels Automation',
    slug: 'reels-automation',
    desc: 'AI-generated scripts, captions, scheduling & multi-platform analytics for Reels.',
    features: ['Scripts', 'Captions', 'Scheduling', 'Analytics'],
    topBorder: 'border-t-[3px] border-t-pink-500',
    iconBg: 'bg-pink-50 text-pink-600 border-pink-100',
    price: { inr: '₹3,499', usd: '$42' },
  },
  {
    icon: '💼',
    name: 'Job Seeker',
    slug: 'job-seeker',
    desc: 'Automate recruiter outreach, auto-customize your resume for ATS, and apply at scale.',
    features: ['ATS Optimization', 'Auto Resume Attach', 'Recruiter Mail Finder', 'Auto Job Applying', 'Reply Dashboard'],
    topBorder: 'border-t-[3px] border-t-teal-500',
    iconBg: 'bg-teal-50 text-teal-600 border-teal-100',
    price: { inr: '₹2,999', usd: '$39' },
  },
]

export function ServicesSection() {
  return (
    <section className="py-24 bg-white border-b border-slate-100" id="services">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            SaaS Services
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-5 sm:text-5xl tracking-tight">Automate with AI</h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            Six powerful automation services. Start with one, add more as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.name}
              className={`rounded-2xl border border-slate-200 bg-white p-6 flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 ${s.topBorder}`}
            >
              {/* Icon + Price */}
              <div className="flex items-start justify-between mb-4">
                <span className={`text-2xl p-2.5 rounded-xl border inline-block ${s.iconBg}`}>
                  {s.icon}
                </span>
                <div className="text-right">
                  <p className="text-lg font-black text-slate-900">{s.price.inr}</p>
                  <p className="text-[10px] text-slate-400">{s.price.usd} · /month</p>
                </div>
              </div>

              {/* Name & Desc */}
              <h3 className="text-sm font-bold text-slate-900 mb-2">{s.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{s.desc}</p>

              {/* Features */}
              <ul className="space-y-1.5 mb-6 flex-1">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="text-indigo-500 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="flex flex-col gap-2 mt-auto">
                <Link
                  href={`/services/${s.slug}`}
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-[11px] font-bold py-2.5 text-center transition-all shadow-md shadow-indigo-100 hover:-translate-y-0.5"
                >
                  View Plans & Pricing →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Services Link */}
        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300 px-6 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-all"
          >
            View All Services →
          </Link>
        </div>
      </div>
    </section>
  )
}
