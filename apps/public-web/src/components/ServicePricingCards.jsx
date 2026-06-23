'use client'

import { useState } from 'react'
import Link from 'next/link'

// All per-service pricing plans data
const servicePlans = {
  'lead-generation': [
    {
      tier: 'Starter',
      name: 'Data Scout',
      inr: 4999, usd: 59,
      popular: false,
      topColor: 'border-t-gray-400',
      features: [
        'Lead data collected (name, email, phone, company)',
        'Google Maps + LinkedIn search',
        'Up to 500 leads/month',
        'CRM sync',
        'Manual review required',
      ],
    },
    {
      tier: 'Pro',
      name: 'Growth Engine',
      inr: 9999, usd: 119,
      popular: true,
      topColor: 'border-t-indigo-500',
      features: [
        'Everything in Starter',
        'Automated outreach workflow starts',
        'Lead → Email → Follow-up → Meeting booking',
        'Full pipeline: Lead to Won deal automated',
        'Human approval at each step',
        'Up to 2,000 leads/month',
      ],
    },
    {
      tier: 'Enterprise',
      name: 'Unlimited',
      inr: null, usd: null,
      popular: false,
      topColor: 'border-t-purple-500',
      features: [
        'Unlimited leads',
        'Custom scraper scripts',
        'Dedicated AI agent',
        'Priority support',
        'Custom workflow design',
      ],
    },
  ],
  'email-automation': [
    {
      tier: 'Starter', name: 'Sender', inr: 3999, usd: 49, popular: false, topColor: 'border-t-gray-400',
      features: ['1,000 emails/month', 'Campaign builder', 'Basic follow-ups', 'Reply tracking', 'CRM sync'],
    },
    {
      tier: 'Pro', name: 'Closer', inr: 7999, usd: 99, popular: true, topColor: 'border-t-indigo-500',
      features: ['5,000 emails/month', 'AI-written personalized emails', 'Multi-step sequences', 'Reply tracking + CRM sync', 'Meeting booking automation'],
    },
    {
      tier: 'Enterprise', name: 'Unlimited', inr: null, usd: null, popular: false, topColor: 'border-t-purple-500',
      features: ['Unlimited emails', 'Custom AI models', 'Dedicated IP', 'Priority support', 'Custom integrations'],
    },
  ],
  'whatsapp-automation': [
    {
      tier: 'Starter', name: 'Broadcaster', inr: 3999, usd: 49, popular: false, topColor: 'border-t-gray-400',
      features: ['Broadcast messages', 'Basic auto-replies', 'Lead capture flows', 'CRM sync', '1,000 messages/month'],
    },
    {
      tier: 'Pro', name: 'Conversationalist', inr: 6999, usd: 85, popular: true, topColor: 'border-t-indigo-500',
      features: ['5,000 messages/month', 'AI-driven conversation flows', 'Lead qualification automation', 'CRM integration', 'Analytics dashboard'],
    },
    {
      tier: 'Enterprise', name: 'Unlimited', inr: null, usd: null, popular: false, topColor: 'border-t-purple-500',
      features: ['Unlimited messages', 'Custom NLP flows', 'Dedicated WhatsApp number', 'Priority support', 'Custom integrations'],
    },
  ],
  'linkedin-automation': [
    {
      tier: 'Starter', name: 'Connector', inr: 4499, usd: 55, popular: false, topColor: 'border-t-gray-400',
      features: ['50 connections/day', 'Personalized connection requests', 'Basic follow-up messages', 'Prospect discovery', 'CRM sync'],
    },
    {
      tier: 'Pro', name: 'Networker', inr: 8999, usd: 109, popular: true, topColor: 'border-t-indigo-500',
      features: ['100 connections/day', 'AI-written personalized messages', 'Multi-step outreach sequences', 'Response tracking', 'Meeting booking integration'],
    },
    {
      tier: 'Enterprise', name: 'Unlimited', inr: null, usd: null, popular: false, topColor: 'border-t-purple-500',
      features: ['Unlimited outreach', 'Custom scripts', 'Dedicated LinkedIn agent', 'Priority support', 'Custom workflow design'],
    },
  ],
  'reels-automation': [
    {
      tier: 'Starter', name: 'Creator', inr: 3499, usd: 42, popular: false, topColor: 'border-t-gray-400',
      features: ['8 reels/month', 'AI script generation', 'Basic captions', 'Scheduling', 'Instagram + YouTube'],
    },
    {
      tier: 'Pro', name: 'Influencer', inr: 6499, usd: 79, popular: true, topColor: 'border-t-indigo-500',
      features: ['20 reels/month', 'AI hooks + trending formats', 'Multi-platform posting', 'Analytics dashboard', 'Custom brand voice'],
    },
    {
      tier: 'Enterprise', name: 'Unlimited', inr: null, usd: null, popular: false, topColor: 'border-t-purple-500',
      features: ['Unlimited reels', 'Custom AI video pipeline', 'Dedicated content agent', 'Priority support', 'Brand identity kit included'],
    },
  ],
  'job-seeker': [
    {
      tier: 'Starter',
      name: 'Smart Outreach',
      inr: 2999, usd: 39,
      popular: false,
      topColor: 'border-t-gray-400',
      features: [
        'User inputs recruiter/HR emails',
        'AI drafts ATS-optimized email',
        'Automatically emails with resume attach',
        'Track email opens & link clicks',
        'Dashboard reply controls',
        'Up to 100 applications/month',
      ],
    },
    {
      tier: 'Pro',
      name: 'Auto Hunter',
      inr: 5999, usd: 79,
      popular: true,
      topColor: 'border-t-indigo-500',
      features: [
        'Everything in Starter',
        'Auto-scrapes LinkedIn, Indeed & Careers pages',
        'Auto-discovers recruiter emails',
        'Automated API job application submission',
        'AI handles scheduling replies',
        'Up to 500 applications/month',
      ],
    },
    {
      tier: 'Enterprise',
      name: 'Enterprise Recruit',
      inr: null, usd: null,
      popular: false,
      topColor: 'border-t-purple-500',
      features: [
        'Unlimited applications',
        'Dedicated AI recruiter instance',
        'Custom resumes & portfolios',
        'ATS profile optimization audit',
        'Priority 24/7 Slack support',
      ],
    },
  ],
}

export function ServicePricingCards({ serviceSlug, serviceName }) {
  const [currency, setCurrency] = useState('india')
  const plans = servicePlans[serviceSlug] || []

  return (
    <section className="py-20 bg-[#0d0e1a] border-t border-[#1e2035]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-white sm:text-4xl tracking-tight">
            Choose Your Plan
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Start free, scale as you grow. No hidden fees.
          </p>
        </div>

        {/* INR / USD Toggle */}
        <div className="flex justify-center items-center gap-3 mb-10">
          <button
            onClick={() => setCurrency('india')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              currency === 'india'
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                : 'bg-[#13141f] border-[#1e2035] text-slate-400 hover:text-white'
            }`}
          >
            🇮🇳 India (₹ INR)
          </button>
          <button
            onClick={() => setCurrency('other')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              currency === 'other'
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                : 'bg-[#13141f] border-[#1e2035] text-slate-400 hover:text-white'
            }`}
          >
            🌍 International ($ USD)
          </button>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`relative rounded-2xl border flex flex-col p-6 transition-all duration-300 border-t-[3px] ${plan.topColor} ${
                plan.popular
                  ? 'bg-[#13141f] border-indigo-500/60 shadow-2xl shadow-indigo-500/10 ring-1 ring-indigo-500/20 scale-105'
                  : 'bg-[#13141f] border-[#1e2035] hover:border-slate-600'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg whitespace-nowrap">
                  ⭐ Most Popular
                </span>
              )}

              {/* Tier & Name */}
              <div className="mb-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                  {plan.tier}
                </p>
                <h3 className={`text-lg font-extrabold ${plan.popular ? 'text-indigo-400' : 'text-white'}`}>
                  {plan.name}
                </h3>
              </div>

              {/* Price */}
              <div className="mb-6">
                {plan.inr === null ? (
                  <div>
                    <p className="text-3xl font-black text-white">Custom</p>
                    <p className="text-[11px] text-slate-500 mt-1">Tailored to your needs</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-3xl font-black text-white">
                      {currency === 'india'
                        ? `₹${plan.inr.toLocaleString('en-IN')}`
                        : `$${plan.usd}`}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">/month · billed monthly</p>
                    {currency === 'india' && (
                      <p className="text-[10px] text-indigo-400 mt-0.5">(≈ ${plan.usd}/mo internationally)</p>
                    )}
                    {currency === 'other' && (
                      <p className="text-[10px] text-indigo-400 mt-0.5">(₹{plan.inr.toLocaleString('en-IN')}/mo in India)</p>
                    )}
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs text-slate-400">
                    <span className="text-indigo-400 font-bold mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              {plan.tier === 'Enterprise' ? (
                <Link
                  href={`/contact?service=${encodeURIComponent(serviceName)}&type=enterprise`}
                  className="block text-center rounded-xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-bold py-3 transition-all hover:-translate-y-0.5"
                >
                  Contact Sales →
                </Link>
              ) : (
                <Link
                  href={`/contact?service=${encodeURIComponent(serviceName)}&type=trial&plan=${encodeURIComponent(plan.name)}`}
                  className={`block text-center rounded-xl text-xs font-bold py-3 transition-all hover:-translate-y-0.5 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-[#1e2035] hover:bg-[#252640] text-white border border-[#2e3055]'
                  }`}
                >
                  Start Free Trial →
                </Link>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] text-slate-600 mt-8">
          All plans include a 3-day free trial · No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  )
}
