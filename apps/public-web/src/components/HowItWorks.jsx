export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Choose Service',
      desc: 'Select from our AI-powered SaaS services — lead generation, email automation, WhatsApp, LinkedIn, or reels.',
      badge: 'Step 1',
      color: 'text-indigo-600',
    },
    {
      num: '02',
      title: 'Configure Requirements',
      desc: 'Set your target audience, industry, messaging tone, and automation preferences through our simple setup wizard.',
      badge: 'Step 2',
      color: 'text-purple-600',
    },
    {
      num: '03',
      title: 'Automation Runs',
      desc: 'Our AI agents start working — scraping leads, drafting outreach, scheduling content. All with human-in-the-loop approval.',
      badge: 'Step 3',
      color: 'text-blue-600',
    },
    {
      num: '04',
      title: 'Get Results',
      desc: 'Watch your CRM fill up with qualified leads, booked meetings, and conversion data. Scale as you grow.',
      badge: 'Step 4',
      color: 'text-emerald-600',
    },
  ]

  return (
    <section className="py-24 bg-white border-b border-slate-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Workflow
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-5 sm:text-5xl tracking-tight">How it works</h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            From setup to results in four simple steps. No technical knowledge required.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-indigo-100 via-purple-100 to-indigo-100 z-0" />

          {steps.map((step) => (
            <div
              key={step.num}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 flex flex-col items-start hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/60 transition-all duration-300 z-10"
            >
              <div className="flex justify-between items-center w-full mb-6">
                <span className={`text-3xl font-black ${step.color}`}>
                  {step.num}
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-600 uppercase tracking-wider">
                  {step.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
