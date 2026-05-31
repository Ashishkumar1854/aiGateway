import Link from 'next/link'

const services = [
  {
    icon: '🎯',
    name: 'Lead Generation',
    desc: 'AI finds your ideal customers automatically',
    features: ['Business scraping', 'Lead scoring 0-100', 'CRM sync', 'Contact enrichment'],
    color: 'bg-orange-50 border-orange-200',
  },
  {
    icon: '📧',
    name: 'Email Automation',
    desc: 'AI writes and sends personalized sequences',
    features: ['Cold email drafting', 'Follow-up sequences', 'Reply handling', 'A/B testing'],
    color: 'bg-blue-50 border-blue-200',
  },
  {
    icon: '🎬',
    name: 'Reels Automation',
    desc: 'Consistent content without the effort',
    features: ['Script generation', 'Auto scheduling', 'Multi-platform', 'Analytics'],
    color: 'bg-pink-50 border-pink-200',
  },
  {
    icon: '💬',
    name: 'WhatsApp Automation',
    desc: 'Reach customers where they already are',
    features: ['Broadcast campaigns', 'Auto replies', 'Flow builder', 'Opt-out handling'],
    color: 'bg-green-50 border-green-200',
  },
]

export function ServicesSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Our Services</h2>
          <p className="mt-3 text-slate-500">Pick one to start. Add more as you grow.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.name} className={`rounded-xl border p-5 ${s.color}`}>
              <span className="text-3xl">{s.icon}</span>
              <h3 className="mt-3 text-base font-semibold text-slate-900">{s.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{s.desc}</p>
              <ul className="mt-3 space-y-1.5">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/contact" className="inline-flex rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            Get a free demo →
          </Link>
        </div>
      </div>
    </section>
  )
}
