import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-28 pb-32 sm:pt-36 sm:pb-40 border-b border-slate-100">
      {/* Subtle top purple glow - very faint on white */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-100/60 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 relative z-10">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
          <span>🤖</span> AI-Powered Business Automation Platform
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-7xl max-w-5xl mx-auto leading-[1.05]">
          Automate Your Business{' '}
          <br className="hidden sm:block" />
          With{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI Employees
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-8 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-normal">
          Generate Leads. Automate Outreach. Scale Faster.
        </p>

        {/* Action Buttons */}
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

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-500">
          {['✓ 500+ businesses', '✓ 24hr setup', '✓ Human-in-loop control', '✓ Flex pricing plans'].map((item) => (
            <span key={item} className="font-semibold text-slate-600">{item}</span>
          ))}
        </div>

        {/* Dashboard Mockup Preview */}
        <div className="mt-20 rounded-2xl border border-slate-200 bg-white p-3 sm:p-5 shadow-2xl shadow-slate-200/60 relative max-w-4xl mx-auto">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-t from-transparent to-slate-50/50 pointer-events-none" />
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 px-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-4 py-1 rounded-md">
              dashboard.aigateway.com
            </span>
            <span className="w-6" />
          </div>

          {/* Simulated App Content */}
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-5 text-left font-sans text-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Lead Pipeline — Automated</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">12 new leads · 3 pending approval · 2 meetings booked</p>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-wider">
                Live
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Leads Generated', value: '1,247', change: '+12%', color: 'text-indigo-600' },
                { label: 'Emails Sent', value: '856', change: '+8%', color: 'text-blue-600' },
                { label: 'Meetings Booked', value: '34', change: '+23%', color: 'text-emerald-600' },
              ].map((stat) => (
                <div key={stat.label} className="p-3 rounded-lg bg-white border border-slate-100 shadow-sm">
                  <p className="text-[10px] text-slate-400">{stat.label}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
                    <span className="text-[9px] text-emerald-500 font-semibold">{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
