import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden border-b border-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950 to-slate-950 pointer-events-none" />
      
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 relative z-10">
        <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900/60 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

          <h2 className="text-3xl font-extrabold text-white sm:text-5xl leading-tight">
            Ready to deploy your AI workforce?
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Get started with AiGateway today. Empower your team, streamline lead workflows, and save hours of manual operations.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="w-full sm:w-auto rounded-xl bg-indigo-600 hover:bg-indigo-500 px-8 py-3.5 text-sm font-bold text-white transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35"
            >
              Book a Free Demo →
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/80 px-8 py-3.5 text-sm font-bold text-slate-300 transition-all"
            >
              View Pricing plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
