import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#08080f] via-[#0f0f1c] to-[#08080f] pt-28 pb-32 sm:pt-36 sm:pb-40 border-b border-[#1e1e2e]">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 left-1/3 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 relative z-10">
        {/* Glow Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
          <span>🤖</span> AI Employee Workforce for SaaS & CRM
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-7xl max-w-4xl mx-auto leading-[1.05] tracking-tight">
          Automate your business with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-500 to-purple-400">
            AI Employees
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-8 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
          AiGateway deploys a specialized virtual workforce for your team. Our Python agents scrape leads, draft outreach sequences, and book discovery meetings—under complete human oversight.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/contact"
            className="w-full sm:w-auto rounded-xl bg-indigo-600 hover:bg-indigo-500 px-8 py-4 text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/45 hover:-translate-y-0.5"
          >
            Get Started Free →
          </Link>
          <Link
            href="/services"
            className="w-full sm:w-auto rounded-xl border border-[#1e1e2e] bg-[#111118]/60 hover:bg-[#111118] px-8 py-4 text-sm font-semibold text-slate-300 transition-all hover:-translate-y-0.5"
          >
            Explore Services
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-500">
          {['✓ 500+ businesses', '✓ 24hr setup', '✓ Human-in-loop control', '✓ Flex pricing plans'].map((item) => (
            <span key={item} className="font-semibold">{item}</span>
          ))}
        </div>

        {/* Interactive Dashboard Mockup Preview */}
        <div className="mt-20 rounded-2xl border border-white/5 bg-[#111118]/40 backdrop-blur-md p-3 sm:p-5 shadow-2xl relative max-w-4xl mx-auto ring-1 ring-white/10 shadow-[0_0_50px_rgba(99,102,241,0.1)]">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-t from-transparent via-[#1e1e2e]/40 to-[#1e1e2e]/80 pointer-events-none" />
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[#1e1e2e] mb-4 px-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-[#08080f]/60 border border-[#1e1e2e] px-4 py-1 rounded-md">
              admin.aigateway.com/crm/leads
            </span>
            <span className="w-6" />
          </div>

          {/* Simulated App Content Grid */}
          <div className="rounded-xl bg-[#08080f]/90 border border-white/5 p-5 text-left font-sans text-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#111118]">
              <div>
                <h4 className="font-bold text-white text-sm">Google DeepMind Workspace</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Scraped Lead · Lead ID: 31a61e3e</p>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-wider">
                Orchestrator Decision: Outreach
              </span>
            </div>

            {/* Simulated Chat log */}
            <div className="space-y-3 font-mono text-[10px]">
              <div className="p-4 bg-[#111118]/50 border border-[#1e1e2e] rounded-xl">
                <span className="text-indigo-400 font-bold">🤖 Email Outreach Agent (DRAFT):</span>
                <p className="text-slate-300 mt-1.5">Subject: Personalized AI workforce solutions for DeepMind...</p>
                <p className="text-slate-500 mt-1.5 italic">"Hi Demis, I noticed you are expanding AI infrastructure. Our python workforce is optimized..."</p>
              </div>
            </div>

            {/* Approval Box */}
            <div className="flex items-center justify-between gap-4 p-3.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
              <span className="text-[10px] text-indigo-300 font-medium">⚠️ Human oversight required before dispatch.</span>
              <div className="flex gap-2">
                <span className="rounded-lg bg-green-600 hover:bg-green-500 px-4 py-1.5 font-semibold text-white cursor-pointer transition-colors shadow-md">Approve</span>
                <span className="rounded-lg bg-[#111118] border border-[#1e1e2e] px-4 py-1.5 font-semibold text-slate-400 cursor-pointer hover:bg-slate-900 transition-colors">Reject</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
