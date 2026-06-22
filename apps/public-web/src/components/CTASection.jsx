import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-24 bg-slate-50 border-b border-slate-100">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 sm:p-14 shadow-xl shadow-indigo-100/40 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-60 h-60 bg-indigo-100/60 rounded-full blur-[85px] pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-purple-100/60 rounded-full blur-[85px] pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-5xl leading-tight tracking-tight">
              Ready To Automate Your Business?
            </h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Get started with AiGateway today. Deploy AI employees, automate lead generation, and scale your revenue.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact?type=trial"
                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-4 text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5"
              >
                Start Free Trial →
              </Link>
              <Link
                href="/book-demo"
                className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-8 py-4 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 shadow-sm"
              >
                Book Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
