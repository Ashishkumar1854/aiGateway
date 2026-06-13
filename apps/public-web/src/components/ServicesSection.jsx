import Link from 'next/link'

const services = [
  {
    icon: '🎯',
    name: 'Lead Generation Bot',
    desc: 'AI finds your ideal customers automatically',
    features: ['Business maps scraping', 'ICP lead scoring 0-100', 'CRM database sync', 'Contact detail enrichment'],
    color: 'border-slate-800 hover:border-orange-500/30',
    iconColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
  {
    icon: '📧',
    name: 'Email Agent Pitches',
    desc: 'AI writes and drafts custom outreach messages',
    features: ['Cold email drafting', 'Auto follow-up chains', 'Reply signals checks', 'Approval queues integration'],
    color: 'border-slate-800 hover:border-blue-500/30',
    iconColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    icon: '🎬',
    name: 'Reels Producer Bot',
    desc: 'Automates video script drafting and posting schedules',
    features: ['Script ideas generator', 'Calendar auto scheduler', 'Multi-channel syncing', 'Growth charts analysis'],
    color: 'border-slate-800 hover:border-pink-500/30',
    iconColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  },
  {
    icon: '💬',
    name: 'WhatsApp Auto-Reply',
    desc: 'Maintains live customer conversations on chat',
    features: ['Broadcasting announcements', 'Smart fallback replies', 'Messaging funnel nodes', 'Client opt-out handlers'],
    color: 'border-slate-800 hover:border-green-500/30',
    iconColor: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
]

export function ServicesSection() {
  return (
    <section className="py-24 bg-slate-950 border-b border-slate-900 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/5 rounded-full blur-[110px] pointer-events-none" />
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
            Our Workforces
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-4 sm:text-5xl">Automate with AI Assistants</h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Pick from our pre-trained AI employees to start, then customize their configurations as your operations grow.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div
              key={s.name}
              className={`rounded-2xl border bg-slate-900/30 p-5 flex flex-col justify-between transition-all duration-300 hover:bg-slate-900/60 shadow-xl ${s.color}`}
            >
              <div>
                <span className={`text-2xl p-2.5 rounded-xl border inline-block ${s.iconColor}`}>
                  {s.icon}
                </span>
                <h3 className="mt-4 text-sm font-bold text-white">{s.name}</h3>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                <ul className="mt-5 space-y-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <span className="text-indigo-400 font-bold">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/contact"
            className="inline-flex rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-sm font-bold text-white transition-all shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25"
          >
            Get a free demo →
          </Link>
        </div>
      </div>
    </section>
  )
}
