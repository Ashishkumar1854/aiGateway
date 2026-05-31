import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-20 bg-indigo-600">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-white">
          Ready to automate your business?
        </h2>
        <p className="mt-4 text-indigo-200">
          Join businesses using AiGateway to generate leads, send emails, create content, and grow — on autopilot.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/contact"
            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            Book a Free Demo →
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl border border-indigo-400 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  )
}
