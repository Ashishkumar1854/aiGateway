export function LeadCard({ lead, onClick }) {
  const SCORE_COLOR = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-slate-500 bg-slate-50 border-slate-200'
  }

  const SOURCE_ICON = {
    lead_research_agent: '🤖',
    website_contact: '🌐',
    manual: '✏️',
    referral: '🤝',
  }

  return (
    <div
      onClick={() => onClick(lead)}
      className="group cursor-pointer rounded-lg bg-white border border-slate-200 p-3 hover:border-slate-400 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900 truncate leading-tight">{lead.companyName}</p>
        <span className={`flex-shrink-0 text-xs font-bold px-1.5 py-0.5 rounded border ${SCORE_COLOR(lead.score)}`}>
          {lead.score}
        </span>
      </div>

      {lead.contactName && (
        <p className="text-xs text-slate-400 mt-0.5 truncate">{lead.contactName}</p>
      )}

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-slate-400">{lead.industry || '—'}</span>
        <span className="text-sm" title={lead.source}>
          {SOURCE_ICON[lead.source] || '📋'}
        </span>
      </div>

      {lead._count && (
        <div className="mt-2 flex items-center gap-2">
          {lead._count.conversations > 0 && (
            <span className="text-xs text-slate-400">💬 {lead._count.conversations}</span>
          )}
          {lead._count.meetings > 0 && (
            <span className="text-xs text-slate-400">📅 {lead._count.meetings}</span>
          )}
        </div>
      )}
    </div>
  )
}
