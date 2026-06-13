import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    price: '₹9,999',
    period: '/month',
    desc: 'Perfect for small teams just getting started with AI',
    features: [
      '2 active AI employees',
      '500 enriched leads/month',
      'Email outreach automation',
      'Basic analytics dashboard',
      'Standard email support',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₹24,999',
    period: '/month',
    desc: 'For growing businesses seeking full lead pipelines',
    features: [
      '5 active AI employees',
      '2,000 enriched leads/month',
      'All outreach bots enabled',
      'Advanced analytics & reports',
      'Priority slack support',
      'Custom python configs',
    ],
    cta: 'Start Pro Free Trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large operations requiring customized python bots',
    features: [
      'Unlimited AI employees',
      'Unlimited lead enrichment',
      'Custom python scraper scripts',
      'Dedicated orchestrator node',
      'SLA performance guarantee',
      '1-on-1 account manager',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
]

export function PricingSection() {
  return (
    <section className="py-24 bg-slate-950 border-b border-slate-900 relative">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
            Plans
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-4 sm:text-5xl">Transparent, simple pricing</h2>
          <p className="mt-3 text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
            Select the pricing plan that fits your business scale. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border flex flex-col justify-between p-6 transition-all duration-300 relative ${
                plan.highlight
                  ? 'border-indigo-500 bg-gradient-to-b from-indigo-950 to-slate-900 text-white shadow-2xl scale-105 z-10'
                  : 'border-slate-800 bg-slate-900/30 text-slate-100 hover:border-slate-700/60'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white shadow-md">
                  Most Popular
                </span>
              )}
              
              <div>
                <h3 className={`text-base font-bold ${plan.highlight ? 'text-indigo-400' : 'text-white'}`}>
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-xs text-slate-500">{plan.period}</span>
                </div>
                <p className="mt-3 text-xs text-slate-400 leading-relaxed">{plan.desc}</p>
                
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <span className="text-indigo-400 font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/contact"
                className={`mt-8 block rounded-xl py-3 text-center text-xs font-bold transition-all shadow-md ${
                  plan.highlight
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 hover:shadow-indigo-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700/50'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
