import { PricingSection } from '@/components/PricingSection'
import { CTASection } from '@/components/CTASection'

export const metadata = {
  title: 'Pricing — AiGateway',
  description: 'Simple, transparent pricing for AI-powered business automation.',
}

export default function PricingPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-indigo-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold text-slate-900">Pricing</h1>
          <p className="mt-4 text-lg text-slate-500">
            Start with one service. Scale as your business grows. No lock-in.
          </p>
        </div>
      </section>
      <PricingSection />
      <section className="py-12 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Can I start with just one service?', a: 'Yes. The Starter plan lets you activate 2 services. You can start with just Lead Generation and add more later.' },
              { q: 'Is there a contract or lock-in?', a: 'No. All plans are monthly and you can cancel anytime with no penalties.' },
              { q: 'Do AI agents work without human oversight?', a: 'No — all AI actions require human approval before execution. You stay in full control.' },
              { q: 'How quickly can I get started?', a: 'Once you sign up, your account is set up within 24 hours and your first automation runs within 48 hours.' },
            ].map((item) => (
              <div key={item.q} className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-slate-900">{item.q}</h3>
                <p className="mt-2 text-sm text-slate-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  )
}
