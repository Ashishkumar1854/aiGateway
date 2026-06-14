import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-24 bg-[#08080f] relative overflow-hidden border-b border-[#1e1e2e]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/10 via-[#08080f] to-[#08080f] pointer-events-none" />
      
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 relative z-10">
        <div className="rounded-3xl border border-white/5 bg-[#111118]/50 p-8 sm:p-14 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
          <div className="absolute -right-20 -top-20 w-60 h-60 bg-indigo-500/5 rounded-full blur-[85px] pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-purple-500/5 rounded-full blur-[85px] pointer-events-none" />

          <h2 className="text-3xl font-extrabold text-white sm:text-5xl leading-tight tracking-tight">
            Ready to deploy your AI workforce?
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            Get started with AiGateway today. Empower your team, streamline lead workflows, and save hours of manual operations.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="w-full sm:w-auto rounded-xl bg-indigo-600 hover:bg-indigo-500 px-8 py-4 text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5"
            >
              Book a Free Demo →
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto rounded-xl border border-[#1e1e2e] bg-[#111118]/60 hover:bg-[#111118] px-8 py-4 text-sm font-semibold text-slate-350 transition-all hover:-translate-y-0.5"
            >
              View Pricing Plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
