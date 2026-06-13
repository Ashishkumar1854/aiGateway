import Link from 'next/link'
import { CTASection } from '@/components/CTASection'

export const metadata = {
  title: 'About — AiGateway',
  description: 'Learn about AiGateway and our mission to automate businesses with AI.',
}

export default function AboutPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pb-20 border-b border-slate-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 relative z-10">
          <h1 className="text-3xl font-extrabold text-white sm:text-5xl">About AiGateway</h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Empowering modern businesses with dedicated, cooperate AI employees that work tirelessly around the clock.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-slate-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 hover:border-slate-700/60 transition-all duration-200">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Our Mission</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              AiGateway gives small and medium businesses access to high-end AI-powered automation. We build dedicated AI employees—not just simple scripts—that research leads, draft outbound messaging sequences, and manage bookings cooperatively.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 hover:border-slate-700/60 transition-all duration-200">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">How We Cooperate</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every sales stage is coordinated by the Multi-Agent Orchestrator. To ensure quality control, no email or schedule is finalized without your explicit review and approval in our task dashboard.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 hover:border-slate-700/60 transition-all duration-200">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Built for India</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We customize integrations specifically for Indian sales setups—featuring standard IST calendar proposals, WhatsApp-first client campaigns, local database scoring models, and localized pricing tiers.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 mt-12 text-center">
          <Link
            href="/contact"
            className="inline-flex rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-sm font-bold text-white transition-all shadow-lg shadow-indigo-600/10"
          >
            Work with us →
          </Link>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
