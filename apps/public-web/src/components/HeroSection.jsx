import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 pt-20 pb-28 sm:pt-28 sm:pb-36 border-b border-slate-900">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-20 left-1/3 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 relative z-10">
        {/* Glow Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-400">
          <span>🤖</span> AI Employee Workforce for SaaS & CRM
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-7xl max-w-4xl mx-auto leading-[1.1]">
          Automate your business with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-500 to-purple-400">
            AI Employees
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          AiGateway deploys a specialized virtual workforce for your team. Our Python agents scrape leads, draft outreach sequences, and book discovery meetings—under complete human oversight.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/contact"
            className="w-full sm:w-auto rounded-xl bg-indigo-600 hover:bg-indigo-500 px-8 py-3.5 text-sm font-bold text-white transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35"
          >
            Get Started Free →
          </Link>
          <Link
            href="/services"
            className="w-full sm:w-auto rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/80 px-8 py-3.5 text-sm font-bold text-slate-300 transition-all"
          >
            Explore Services
          </Link>
        </div>

        {/* Checklist */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          {['✓ Zero hiring friction', '✓ Operation 24/7/365', '✓ Full Human approval control', '✓ Flex pricing plans'].map((item) => (
            <span key={item} className="font-medium">{item}</span>
          ))}
        </div>

        {/* Interactive Dashboard Mockup Preview */}
        <div className="mt-16 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-3 sm:p-4 shadow-2xl relative max-w-4xl mx-auto">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-t from-transparent via-slate-800/40 to-slate-800/60 pointer-events-none" />
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4 px-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-950/40 border border-slate-800 px-3 py-0.5 rounded-md">
              admin.aigateway.com/crm/leads
            </span>
            <span className="w-6" />
          </div>

          {/* Simulated App Content Grid */}
          <div className="rounded-xl bg-slate-950/80 border border-slate-800/60 p-4 text-left font-sans text-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-900">
              <div>
                <h4 className="font-bold text-white text-sm">Google DeepMind Workspace</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Scraped Lead · Lead ID: 31a61e3e</p>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Orchestrator Decision: Outreach
              </span>
            </div>

            {/* Simulated Chat log */}
            <div className="space-y-3 font-mono text-[10px]">
              <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                <span className="text-indigo-400 font-bold">🤖 Email Outreach Agent (DRAFT):</span>
                <p className="text-slate-300 mt-1">Subject: Personalized AI workforce solutions for DeepMind...</p>
                <p className="text-slate-500 mt-1 italic">"Hi Demis, I noticed you are expanding AI infrastructure. Our python workforce is optimized..."</p>
              </div>
            </div>

            {/* Approval Box */}
            <div className="flex items-center justify-between gap-4 p-3 bg-indigo-950/15 border border-indigo-500/10 rounded-xl">
              <span className="text-[10px] text-indigo-300">⚠️ Human oversight required before dispatch.</span>
              <div className="flex gap-2">
                <span className="rounded bg-green-600 px-3 py-1 font-semibold text-white">Approve</span>
                <span className="rounded bg-slate-800 px-3 py-1 font-semibold text-slate-400">Reject</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
