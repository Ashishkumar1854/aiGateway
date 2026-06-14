export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Choose Service',
      desc: 'Select your virtual employee from our specialized workforce and set your target ICP, channels, and niche specifications.',
      badge: 'Step 1'
    },
    {
      num: '02',
      title: 'Human Approval',
      desc: 'Your AI agent scrapes leads and drafts outreach sequences. All drafts are queued in your dashboard for one-click manual approval.',
      badge: 'Step 2'
    },
    {
      num: '03',
      title: 'Launch & Automate',
      desc: 'Approved emails and messages are dispatched automatically. Watch your CRM database fill up with scheduled discovery meetings.',
      badge: 'Step 3'
    }
  ]

  return (
    <section className="py-24 bg-[#08080f] border-b border-[#1e1e2e] relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-indigo-900/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Workflow
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-5 sm:text-5xl tracking-tight">How it works</h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            Deploy cooperation loops between pre-trained AI employees to run your lead intake, pitch writing, and scheduling pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 z-0" />

          {steps.map((step, i) => (
            <div
              key={step.num}
              className="relative rounded-2xl border border-[#1e1e2e] bg-[#111118]/40 p-6 flex flex-col items-start hover:border-indigo-500/20 hover:bg-[#111118]/80 transition-all duration-300 z-10"
            >
              <div className="flex justify-between items-center w-full mb-6">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  {step.num}
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-950 border border-indigo-850 text-indigo-300 uppercase tracking-wider">
                  {step.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
