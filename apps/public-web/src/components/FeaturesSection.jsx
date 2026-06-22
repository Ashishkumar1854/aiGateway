const features = [
  {
    icon: '🎯',
    title: 'AI Lead Research',
    desc: 'Our Python agents automatically scrape, enrich, and score leads from sources like Google Maps and LinkedIn.',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    icon: '📧',
    title: 'Outreach Sequences',
    desc: 'Generates personalized cold outreach drafts based on lead details. Strictly requires human approval.',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    icon: '🎬',
    title: 'Reels Automation',
    desc: 'AI handles reels generation, script writing, scheduling, and multi-platform auto-posting.',
    iconBg: 'bg-pink-50 text-pink-600 border-pink-100',
  },
  {
    icon: '💬',
    title: 'WhatsApp Automation',
    desc: 'Enables custom messaging flows, auto replies, and drip broadcasts to stay connected.',
    iconBg: 'bg-green-50 text-green-600 border-green-100',
  },
  {
    icon: '📅',
    title: 'Discovery Booking',
    desc: 'Analyzes replies for interest, proposes calendar slots, and books meetings directly into your database.',
    iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    icon: '📊',
    title: 'Unified Sales CRM',
    desc: 'Track every conversation, task approval state, and customer stage in one central workspace pipeline.',
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-50 border-b border-slate-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Capabilities
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-5 sm:text-5xl tracking-tight">Everything your team needs</h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Deploy an integrated workforce of specialized agents cooperating together under one workflow orchestrator.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/60 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full border flex items-center justify-center text-xl flex-shrink-0 ${f.iconBg}`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-200">
                  {f.title}
                </h3>
              </div>
              <p className="mt-4 text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
