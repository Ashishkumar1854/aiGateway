const features = [
  { name: 'Lead Generation',       manual: 'no',  freelancer: 'partial', aigateway: 'yes' },
  { name: 'Email Automation',      manual: 'no',  freelancer: 'partial', aigateway: 'yes' },
  { name: 'WhatsApp Automation',   manual: 'no',  freelancer: 'no',      aigateway: 'yes' },
  { name: 'LinkedIn Outreach',     manual: 'no',  freelancer: 'partial', aigateway: 'yes' },
  { name: 'CRM Sync',              manual: 'no',  freelancer: 'no',      aigateway: 'yes' },
  { name: '24/7 Availability',     manual: 'no',  freelancer: 'no',      aigateway: 'yes' },
  { name: 'Human-in-Loop Control', manual: 'yes', freelancer: 'partial', aigateway: 'yes' },
  { name: 'Scalable Architecture', manual: 'no',  freelancer: 'no',      aigateway: 'yes' },
]

const statusIcon = {
  yes:     <span className="text-emerald-500 text-sm">✅</span>,
  partial: <span className="text-amber-400  text-sm">⚠️</span>,
  no:      <span className="text-red-400    text-sm">❌</span>,
}

export function ComparisonTable() {
  return (
    <section className="py-24 bg-slate-50 border-b border-slate-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Comparison
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-5 sm:text-5xl tracking-tight">How we compare</h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            See why AiGateway outperforms manual processes and freelance solutions.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-100/80">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-4 font-semibold text-slate-700 text-xs">Feature</th>
                <th className="text-center px-4 py-4 font-semibold text-slate-500 text-xs">Manual</th>
                <th className="text-center px-4 py-4 font-semibold text-slate-500 text-xs">Freelancer</th>
                <th className="text-center px-4 py-4 font-semibold text-xs">
                  <span className="text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded-lg">AiGateway</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr
                  key={f.name}
                  className={`border-b border-slate-100 hover:bg-indigo-50/30 transition-colors ${
                    i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                  }`}
                >
                  <td className="px-5 py-3.5 text-slate-700 font-medium text-xs">{f.name}</td>
                  <td className="px-4 py-3.5 text-center">{statusIcon[f.manual]}</td>
                  <td className="px-4 py-3.5 text-center">{statusIcon[f.freelancer]}</td>
                  <td className="px-4 py-3.5 text-center">{statusIcon[f.aigateway]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
