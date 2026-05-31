import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="mb-4 inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
          🤖 AI Workforce for Your Business
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Automate your business with{' '}
          <span className="text-indigo-600">AI employees</span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          AiGateway gives your business a full team of AI workers — from lead research and email outreach to reels creation and WhatsApp automation. All managed from one dashboard.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/contact"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Get Started Free →
          </Link>
          <Link
            href="/services"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            See All Services
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
          {['✓ No hiring costs', '✓ Works 24/7', '✓ Human oversight', '✓ Cancel anytime'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
