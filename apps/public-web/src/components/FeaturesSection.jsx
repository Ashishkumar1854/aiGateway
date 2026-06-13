const features = [
  {
    icon: '🎯',
    title: 'AI Lead Research',
    desc: 'Our Python agents automatically scrape, enrich, and score leads from sources like Google Maps and LinkedIn.',
  },
  {
    icon: '📧',
    title: 'Outreach Sequences',
    desc: 'Generates personalized cold outreach drafts based on lead details. Strictly requires human approval.',
  },
  {
    icon: '🎬',
    title: 'Reels Automation',
    desc: 'AI handles reels generation, script writing, scheduling, and multi-platform auto-posting.',
  },
  {
    icon: '💬',
    title: 'WhatsApp Automation',
    desc: 'Enables custom messaging flows, auto replies, and drip broadcasts to stay connected.',
  },
  {
    icon: '📅',
    title: 'Discovery Booking',
    desc: 'Analyzes replies for interest, proposes calendar slots, and books meetings directly into your database.',
  },
  {
    icon: '📊',
    title: 'Unified Sales CRM',
    desc: 'Track every conversation, task approval state, and customer stage in one central workspace pipeline.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-950 border-b border-slate-900 relative">
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
            Capabilities
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-4 sm:text-5xl">Everything your team needs</h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Deploy an integrated workforce of specialized agents cooperating together under one workflow orchestrator.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-800 bg-slate-900/30 p-6 hover:border-indigo-500/30 hover:bg-slate-900/50 transition-all duration-300 shadow-xl"
            >
              <span className="text-3xl p-3 bg-slate-950 border border-slate-800/80 rounded-xl inline-block group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </span>
              <h3 className="mt-5 text-base font-bold text-white group-hover:text-indigo-400 transition-colors duration-200">
                {f.title}
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
