const features = [
  {
    icon: '🎯',
    title: 'AI Lead Research',
    desc: 'Our Python agents automatically scrape, enrich, and score leads from sources like Google Maps and LinkedIn.',
    circleColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    icon: '📧',
    title: 'Outreach Sequences',
    desc: 'Generates personalized cold outreach drafts based on lead details. Strictly requires human approval.',
    circleColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    icon: '🎬',
    title: 'Reels Automation',
    desc: 'AI handles reels generation, script writing, scheduling, and multi-platform auto-posting.',
    circleColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  },
  {
    icon: '💬',
    title: 'WhatsApp Automation',
    desc: 'Enables custom messaging flows, auto replies, and drip broadcasts to stay connected.',
    circleColor: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  {
    icon: '📅',
    title: 'Discovery Booking',
    desc: 'Analyzes replies for interest, proposes calendar slots, and books meetings directly into your database.',
    circleColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    icon: '📊',
    title: 'Unified Sales CRM',
    desc: 'Track every conversation, task approval state, and customer stage in one central workspace pipeline.',
    circleColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-[#08080f] border-b border-[#1e1e2e] relative overflow-hidden">
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-550/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Capabilities
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-5 sm:text-5xl tracking-tight">Everything your team needs</h2>
          <p className="mt-4 text-slate-450 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            Deploy an integrated workforce of specialized agents cooperating together under one workflow orchestrator.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-[#1e1e2e] bg-[#111118]/50 p-6 hover:border-indigo-500/30 hover:bg-[#111118] transition-all duration-300 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full border flex items-center justify-center text-xl flex-shrink-0 ${f.circleColor}`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors duration-200">
                  {f.title}
                </h3>
              </div>
              <p className="mt-4 text-xs text-slate-400 leading-relaxed font-light">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
