'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'How does Lead Generation work?',
    a: 'Our AI agents automatically search Google Maps, LinkedIn, and business directories to find prospects matching your ideal customer profile. Each lead is scored, enriched with contact details, and synced to your CRM pipeline — all under human oversight.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, all plans are billed monthly with no lock-in contracts. You can cancel, upgrade, or downgrade your subscription at any time from your client dashboard without any penalties.',
  },
  {
    q: 'Can I upgrade later?',
    a: 'Absolutely. Start with a single service and add more as your business grows. You can upgrade your plan or add additional services at any time — the transition is seamless.',
  },
  {
    q: 'How does the trial work?',
    a: 'Our 3-day free trial gives you full access to any one service. No credit card required. Simply fill in your details, and our team activates your trial within 1 hour. After the trial, continue for ₹999/mo or cancel — no questions asked.',
  },
  {
    q: 'Do I need technical knowledge?',
    a: 'Not at all. AiGateway is designed for business owners, not developers. Our setup wizard guides you through configuration, and our team handles all the technical implementation behind the scenes.',
  },
  {
    q: 'How is billing calculated?',
    a: 'Billing is per-service, per-month. Each service has a transparent flat rate. You only pay for the services you activate. Annual billing gives you a 20% discount across all plans.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-100">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-5 sm:text-5xl tracking-tight">Frequently asked questions</h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Everything you need to know about AiGateway.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className={`rounded-2xl border transition-all duration-300 ${
                openIndex === i
                  ? 'border-indigo-200 bg-indigo-50/50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 pr-4">{faq.q}</h3>
                <svg
                  className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180 text-indigo-500' : 'text-slate-400'
                  }`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 -mt-1">
                  <p className="text-xs text-slate-500 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
