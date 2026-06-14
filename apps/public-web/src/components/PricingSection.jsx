'use client'

import { useState } from 'react'
import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    monthlyPrice: '$99',
    monthlyPriceINR: '₹9,999',
    annualPrice: '$79',
    annualPriceINR: '₹7,999',
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
    monthlyPrice: '$249',
    monthlyPriceINR: '₹24,999',
    annualPrice: '$199',
    annualPriceINR: '₹19,999',
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
    monthlyPrice: 'Custom',
    monthlyPriceINR: '',
    annualPrice: 'Custom',
    annualPriceINR: '',
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
  const [billingPeriod, setBillingPeriod] = useState('monthly') // 'monthly' | 'annually'

  return (
    <section className="py-24 bg-[#08080f] border-b border-[#1e1e2e] relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10">
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Plans
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-5 sm:text-5xl tracking-tight">Transparent, simple pricing</h2>
          <p className="mt-4 text-slate-450 max-w-md mx-auto text-sm leading-relaxed font-light">
            Select the pricing plan that fits your business scale. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Toggle Button */}
        <div className="flex justify-center items-center gap-3 mb-16">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900/40 border border-[#1e1e2e]'
            }`}
          >
            Bill Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('annually')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              billingPeriod === 'annually'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900/40 border border-[#1e1e2e]'
            }`}
          >
            Bill Annually
            <span className="text-[9px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
              Save 20%
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch">
          {plans.map((plan) => {
            const isCustom = plan.monthlyPrice === 'Custom'
            const displayPrice = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice
            const displayINR = billingPeriod === 'monthly' ? plan.monthlyPriceINR : plan.annualPriceINR

            return (
              <div
                key={plan.name}
                className={`rounded-2xl border flex flex-col justify-between p-6 transition-all duration-300 relative ${
                  plan.highlight
                    ? 'border-indigo-500 bg-gradient-to-b from-indigo-950/20 via-[#111118] to-[#111118] text-white shadow-2xl scale-105 z-10 shadow-[0_0_40px_rgba(99,102,241,0.08)]'
                    : 'border-[#1e1e2e] bg-[#111118]/30 text-slate-100 hover:border-slate-700/60 hover:bg-[#111118]/50'
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
                    Most Popular
                  </span>
                )}
                
                <div>
                  <h3 className={`text-base font-bold ${plan.highlight ? 'text-indigo-400' : 'text-white'}`}>
                    {plan.name}
                  </h3>
                  
                  <div className="mt-5 flex flex-col items-start gap-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-black text-white">{displayPrice}</span>
                      <span className="text-xs text-slate-500">{!isCustom && plan.period}</span>
                    </div>
                    {!isCustom && (
                      <span className="text-xs font-semibold text-indigo-400/80 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 mt-1">
                        ({displayINR}{plan.period})
                      </span>
                    )}
                  </div>
                  
                  <p className="mt-4 text-xs text-slate-400 leading-relaxed font-light">{plan.desc}</p>
                  
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-xs text-slate-350 font-light">
                        <span className="text-indigo-400 font-bold">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/contact"
                  className={`mt-8 block rounded-xl py-3.5 text-center text-xs font-bold transition-all shadow-md ${
                    plan.highlight
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:-translate-y-0.5'
                      : 'bg-[#111118] hover:bg-slate-900 text-slate-200 border border-[#1e1e2e] hover:-translate-y-0.5'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
