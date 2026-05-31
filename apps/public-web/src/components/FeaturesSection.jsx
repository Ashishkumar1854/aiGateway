const features = [
  {
    icon: '🎯',
    title: 'AI Lead Research',
    desc: 'Our AI agent automatically finds, scores, and enriches leads from Google Maps, LinkedIn, and business directories.',
  },
  {
    icon: '📧',
    title: 'Email Outreach',
    desc: 'Personalized cold email sequences written and sent by AI. Human approval before every send.',
  },
  {
    icon: '🎬',
    title: 'Reels Automation',
    desc: 'AI creates, schedules, and posts Instagram and YouTube Reels for your brand — consistently.',
  },
  {
    icon: '💬',
    title: 'WhatsApp Automation',
    desc: 'Automated WhatsApp follow-ups, broadcasts, and reply handling for your business.',
  },
  {
    icon: '📅',
    title: 'Meeting Booking',
    desc: 'AI qualifies leads and books meetings directly on your calendar. No manual back-and-forth.',
  },
  {
    icon: '📊',
    title: 'CRM & Analytics',
    desc: 'Full pipeline visibility. Track every lead, conversation, and deal from cold to won.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Everything your business needs</h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto">
            One platform. Multiple AI employees. Complete business automation.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-sm transition-all">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-3 text-base font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
