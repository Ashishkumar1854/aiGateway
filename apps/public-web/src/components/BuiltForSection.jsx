const audiences = [
  { icon: '🚀', name: 'Startups', desc: 'Scale from 0 to 1 with automated lead gen' },
  { icon: '🏢', name: 'Agencies', desc: 'Manage multiple client campaigns effortlessly' },
  { icon: '🎯', name: 'Recruiters', desc: 'Automate candidate sourcing & outreach' },
  { icon: '💼', name: 'Freelancers', desc: 'Focus on delivery, let AI handle prospecting' },
  { icon: '📋', name: 'Consultants', desc: 'Build pipeline while you consult' },
  { icon: '🏠', name: 'Real Estate', desc: 'Find buyers & sellers automatically' },
  { icon: '🏪', name: 'Local Businesses', desc: 'Get found and grow your customer base' },
  { icon: '🎓', name: 'Coaches', desc: 'Fill your calendar with qualified leads' },
]

export function BuiltForSection() {
  return (
    <section className="py-24 bg-white border-b border-slate-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Built For
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-5 sm:text-5xl tracking-tight">Built for every business</h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Whether you&apos;re a solo founder or a growing agency, AiGateway adapts to your exact use case.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {audiences.map((a) => (
            <div
              key={a.name}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-center hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-3 text-2xl group-hover:bg-indigo-100 transition-colors duration-300">
                {a.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{a.name}</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
