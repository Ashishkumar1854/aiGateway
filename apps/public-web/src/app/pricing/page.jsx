import { PricingSection } from '@/components/PricingSection'
import { CTASection } from '@/components/CTASection'

export const metadata = {
  title: 'Pricing — AiGateway',
  description: 'Simple, transparent pricing for AI-powered business automation.',
}

export default function PricingPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pb-20 border-b border-slate-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 relative z-10">
          <h1 className="text-3xl font-extrabold text-white sm:text-5xl">Pricing & Plans</h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Flexible pricing built to match your operations. Deploy dedicated AI workers at a fraction of standard hiring costs.
          </p>
        </div>
      </section>

      <PricingSection />

      {/* FAQs */}
      <section className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-4 sm:text-3xl">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { q: 'Can I start with just one service?', a: 'Yes. The Starter plan allows you to activate up to 2 services concurrently. You can start with Lead Research and WhatsApp follow-ups, then scale up as your volume grows.' },
              { q: 'Is there a contract lock-in or cancellation penalty?', a: 'No, all plans are billed monthly. You can cancel your subscription or modify active service configurations at any time without extra fees.' },
              { q: 'Do AI agents perform actions autonomously?', a: 'No. To maintain complete brand safety, every outreach pitch, booking invite, or scrap task generates an approval request in your task queue. They never act without human verification.' },
              { q: 'How fast can I get my virtual employee running?', a: 'Setting up client API endpoints takes 24 hours. Your first automation runs and populates leads in the CRM database within 48 hours.' },
            ].map((item) => (
              <div key={item.q} className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 hover:border-slate-700/60 transition-all duration-200">
                <h3 className="text-xs sm:text-sm font-bold text-white">{item.q}</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
