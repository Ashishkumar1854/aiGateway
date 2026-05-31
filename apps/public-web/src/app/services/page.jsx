import Link from 'next/link'
import { ServicesSection } from '@/components/ServicesSection'
import { CTASection } from '@/components/CTASection'

export const metadata = {
  title: 'Services — AiGateway',
  description: 'Explore all AI-powered automation services offered by AiGateway.',
}

const details = [
  {
    icon: '🎯',
    name: 'Lead Generation',
    desc: 'Our AI research agent scans the web to find your ideal customers.',
    how: [
      'Searches Google Maps, LinkedIn, and business directories',
      'Scores each lead 0-100 based on your ideal customer profile',
      'Enriches contact information automatically',
      'Syncs to your CRM pipeline in real-time',
      'Human review before any outreach is sent',
    ],
  },
  {
    icon: '📧',
    name: 'Email Automation',
    desc: 'AI writes personalized cold emails and manages follow-up sequences.',
    how: [
      'Generates personalized emails based on lead research',
      'Manages multi-step drip sequences',
      'Handles replies and categorizes responses',
      'A/B tests subject lines automatically',
      'Syncs all conversations to CRM',
    ],
  },
  {
    icon: '🎬',
    name: 'Reels Automation',
    desc: 'Consistent video content for Instagram and YouTube without the effort.',
    how: [
      'AI generates scripts and captions',
      'Schedules posts at optimal times',
      'Posts to multiple platforms simultaneously',
      'Tracks engagement and reports performance',
      'No editing software needed',
    ],
  },
  {
    icon: '💬',
    name: 'WhatsApp Automation',
    desc: 'Reach your audience where they already are — on WhatsApp.',
    how: [
      'Broadcasts to your contact list',
      'Auto-replies to common questions',
      'Flow builder for complex conversations',
      'Lead capture via WhatsApp',
      'Compliant with WhatsApp Business policies',
    ],
  },
]

export default function ServicesPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-indigo-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold text-slate-900">Our Services</h1>
          <p className="mt-4 text-lg text-slate-500">
            Each service is powered by a dedicated AI agent that works 24/7.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-12">
          {details.map((service, i) => (
            <div key={service.name} className={`flex flex-col gap-8 lg:flex-row ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center p-12">
                <span className="text-7xl">{service.icon}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900">{service.name}</h2>
                <p className="mt-2 text-slate-500">{service.desc}</p>
                <ul className="mt-4 space-y-2">
                  {service.how.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-0.5 text-green-500 font-bold">✓</span>
                      {h}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                >
                  Get this service →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  )
}
