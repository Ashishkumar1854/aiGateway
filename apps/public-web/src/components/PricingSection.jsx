import Link from 'next/link'

const services = [
  { icon: '🎯', name: 'Lead Generation',    slug: 'lead-generation',    inr: 4999,  usd: 59,  topBorder: 'border-t-[3px] border-t-indigo-500' },
  { icon: '📧', name: 'Email Automation',   slug: 'email-automation',   inr: 3999,  usd: 49,  topBorder: 'border-t-[3px] border-t-purple-500' },
  { icon: '💬', name: 'WhatsApp Automation',slug: 'whatsapp-automation', inr: 3999,  usd: 49,  topBorder: 'border-t-[3px] border-t-green-500'  },
  { icon: '🔗', name: 'LinkedIn Automation',slug: 'linkedin-automation', inr: 4499,  usd: 55,  topBorder: 'border-t-[3px] border-t-blue-500'   },
  { icon: '🎬', name: 'Reels Automation',   slug: 'reels-automation',   inr: 3499,  usd: 42,  topBorder: 'border-t-[3px] border-t-pink-500'   },
  { icon: '💼', name: 'Job Seeker',         slug: 'job-seeker',         inr: 2999,  usd: 39,  topBorder: 'border-t-[3px] border-t-teal-500'   },
]

export function PricingSection() {
  return (
    <section className="py-24 bg-slate-50 border-b border-slate-100" id="pricing">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-5 sm:text-5xl tracking-tight">
            Simple, per-service pricing
          </h2>
          <p className="mt-4 text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
            Pay only for the services you use. Each service has 3 plans — Starter, Pro, and Enterprise.
            View individual service pages for detailed plan breakdowns.
          </p>
        </div>

        {/* 5 Service Cards — Starting Price */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.slug}
              className={`rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 ${s.topBorder}`}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">{s.icon}</span>
                <h3 className="text-sm font-bold text-slate-900">{s.name}</h3>
              </div>

              <div className="mb-5">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Starting from</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-900">
                    ₹{s.inr.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-400">/mo</span>
                </div>
                <p className="text-[11px] text-indigo-600 mt-0.5">(${s.usd}/mo internationally)</p>
              </div>

              <Link
                href={`/services/${s.slug}#pricing`}
                className="block text-center rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 text-xs font-bold py-2.5 transition-all"
              >
                View Plans →
              </Link>
            </div>
          ))}

          {/* Spacer card — Enterprise CTA */}
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 flex flex-col items-center justify-center text-center gap-4">
            <span className="text-3xl">🏢</span>
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">Enterprise</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Unlimited scale, custom workflows, dedicated AI agents & SLA guarantee.
              </p>
            </div>
            <Link
              href="/contact?type=enterprise"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-5 py-2.5 hover:-translate-y-0.5 transition-all shadow-md shadow-indigo-200"
            >
              Contact Sales →
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          All plans include a 3-day free trial · No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  )
}
