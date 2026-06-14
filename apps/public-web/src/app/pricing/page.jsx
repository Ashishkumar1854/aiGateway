import { PricingSection } from '@/components/PricingSection'
import { CTASection } from '@/components/CTASection'

export const metadata = {
  title: 'Pricing — AiGateway',
  description: 'Simple, transparent pricing for AI-powered business automation.',
}

export default function PricingPage() {
  return (
    <div className="bg-[#08080f] text-slate-100 min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden pt-24 pb-20 border-b border-[#1e1e2e]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-indigo-550/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 relative z-10">
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Pricing
          </span>
          <h1 className="text-4xl font-extrabold text-white sm:text-6xl tracking-tight mt-5 leading-tight">Pricing & Plans</h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed font-light">
            Flexible pricing built to match your operations. Deploy dedicated AI workers at a fraction of standard hiring costs.
          </p>
        </div>
      </section>

      <PricingSection />

      {/* FAQs */}
      <section className="py-24 bg-[#08080f] border-t border-[#1e1e2e] relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-purple-900/5 rounded-full blur-[90px] pointer-events-none" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-5 sm:text-4xl tracking-tight">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { q: 'Can I start with just one service?', a: 'Yes. The Starter plan allows you to activate up to 2 services concurrently. You can start with Lead Research and WhatsApp follow-ups, then scale up as your volume grows.' },
              { q: 'Is there a contract lock-in or cancellation penalty?', a: 'No, all plans are billed monthly. You can cancel your subscription or modify active service configurations at any time without extra fees.' },
              { q: 'Do AI agents perform actions autonomously?', a: 'No. To maintain complete brand safety, every outreach pitch, booking invite, or scrap task generates an approval request in your task queue. They never act without human verification.' },
              { q: 'How fast can I get my virtual employee running?', a: 'Setting up client API endpoints takes 24 hours. Your first automation runs and populates leads in the CRM database within 48 hours.' },
            ].map((item) => (
              <div key={item.q} className="rounded-2xl border border-[#1e1e2e] bg-[#111118]/40 p-5 hover:border-slate-800 transition-all duration-200">
                <h3 className="text-xs sm:text-sm font-bold text-white">{item.q}</h3>
                <p className="mt-2.5 text-xs text-slate-400 leading-relaxed font-light">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
