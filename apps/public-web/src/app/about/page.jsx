import Link from 'next/link'
import { CTASection } from '@/components/CTASection'

export const metadata = {
  title: 'About — AiGateway',
  description: 'Learn about AiGateway and our mission to automate businesses with AI.',
}

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-indigo-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold text-slate-900">About AiGateway</h1>
          <p className="mt-4 text-lg text-slate-500">
            We built AiGateway because we believe every business deserves a team of tireless AI workers.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-8">
          <div className="rounded-2xl border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              AiGateway gives small and medium businesses access to the same AI-powered automation that large enterprises use. We build AI employees — not just tools — that research leads, write emails, create content, and book meetings on your behalf.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">How We Work</h2>
            <p className="text-slate-600 leading-relaxed">
              Every automation is managed by a dedicated AI agent. Humans stay in the loop — all AI actions require your approval before execution. This ensures quality while saving you hours every week.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">Built for India</h2>
            <p className="text-slate-600 leading-relaxed">
              We're built specifically for Indian businesses — Razorpay billing, WhatsApp-first outreach, Hindi + English content support, and pricing in INR. We understand the Indian market.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 mt-8 text-center">
          <Link href="/contact" className="inline-flex rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            Work with us →
          </Link>
        </div>
      </section>

      <CTASection />
    </>
  )
}
