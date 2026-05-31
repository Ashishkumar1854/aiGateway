import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    price: '₹9,999',
    period: '/month',
    desc: 'Perfect for small businesses just getting started',
    features: [
      '2 active services',
      '500 leads/month',
      'Email automation',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₹24,999',
    period: '/month',
    desc: 'For growing businesses that want more automation',
    features: [
      '5 active services',
      '2,000 leads/month',
      'All automations',
      'Advanced analytics',
      'Priority support',
      'Custom workflows',
    ],
    cta: 'Start Pro',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large teams with complex requirements',
    features: [
      'Unlimited services',
      'Unlimited leads',
      'Dedicated AI team',
      'Custom integrations',
      'Dedicated manager',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
]

export function PricingSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Simple, transparent pricing</h2>
          <p className="mt-3 text-slate-500">No hidden fees. Cancel anytime.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 ${
                plan.highlight
                  ? 'border-indigo-500 bg-indigo-600 text-white shadow-lg scale-105'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <h3 className={`text-lg font-bold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                {plan.name}
              </h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className={`text-3xl font-bold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.highlight ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {plan.period}
                </span>
              </div>
              <p className={`mt-2 text-sm ${plan.highlight ? 'text-indigo-200' : 'text-slate-500'}`}>
                {plan.desc}
              </p>
              <ul className="mt-5 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-indigo-100' : 'text-slate-600'}`}>
                    <span className={plan.highlight ? 'text-indigo-300' : 'text-green-500'}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`mt-6 block rounded-xl py-2.5 text-center text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
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
