const reasons = [
  {
    icon: '🛡️',
    title: 'Human Approved Workflows',
    desc: 'Every email, message, and action requires your explicit approval. No rogue automation — complete control.',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    icon: '⚙️',
    title: 'Custom Automation',
    desc: 'Configure every workflow to match your exact business needs — ICP, messaging tone, channels, and schedules.',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    icon: '🎯',
    title: 'Business Focused',
    desc: 'Built for real business outcomes — leads, meetings, and revenue. Not just vanity metrics or dashboards.',
    iconBg: 'bg-orange-50 text-orange-600 border-orange-100',
  },
  {
    icon: '⚡',
    title: 'Fast Deployment',
    desc: 'Get your first automation running within 24 hours. No lengthy setup, no complex integrations needed.',
    iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    icon: '📈',
    title: 'Scalable Architecture',
    desc: 'Start with one service, scale to all five. Our platform grows with your business without breaking.',
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  },
  {
    icon: '🔗',
    title: 'One Platform',
    desc: 'Lead gen, email, WhatsApp, LinkedIn, and reels — all managed from a single unified dashboard.',
    iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
  },
]

export function WhyAiGateway() {
  return (
    <section className="py-24 bg-slate-50 border-b border-slate-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Why AiGateway
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-5 sm:text-5xl tracking-tight">Why businesses choose us</h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Built with real-world business automation in mind. Every feature designed for measurable ROI.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/60 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full border flex items-center justify-center text-xl flex-shrink-0 ${r.iconBg}`}>
                  {r.icon}
                </div>
                <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-200">
                  {r.title}
                </h3>
              </div>
              <p className="mt-4 text-xs text-slate-500 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
