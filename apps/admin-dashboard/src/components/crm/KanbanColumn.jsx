import { LeadCard } from './LeadCard'

const STATUS_STYLES = {
  COLD:        { bg: 'bg-slate-50',    border: 'border-slate-200',  dot: 'bg-slate-400',   label: '🧊 Cold' },
  WARM:        { bg: 'bg-orange-50',   border: 'border-orange-200', dot: 'bg-orange-400',  label: '🔥 Warm' },
  QUALIFIED:   { bg: 'bg-blue-50',     border: 'border-blue-200',   dot: 'bg-blue-500',    label: '✅ Qualified' },
  PROPOSAL:    { bg: 'bg-purple-50',   border: 'border-purple-200', dot: 'bg-purple-500',  label: '📄 Proposal' },
  NEGOTIATION: { bg: 'bg-yellow-50',   border: 'border-yellow-200', dot: 'bg-yellow-500',  label: '🤝 Negotiation' },
  WON:         { bg: 'bg-green-50',    border: 'border-green-200',  dot: 'bg-green-500',   label: '🎉 Won' },
  LOST:        { bg: 'bg-red-50',      border: 'border-red-200',    dot: 'bg-red-400',     label: '❌ Lost' },
}

export function KanbanColumn({ status, count, leads, onLeadClick }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.COLD

  return (
    <div className="flex-shrink-0 w-60">
      {/* Column header */}
      <div className={`rounded-xl border ${style.border} ${style.bg} p-3`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${style.dot}`} />
            <h3 className="text-xs font-bold text-slate-700">{style.label}</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-white border border-slate-200 rounded-full px-2 py-0.5">
            {count}
          </span>
        </div>

        {/* Lead cards */}
        <div className="space-y-2 min-h-[40px]">
          {leads.length === 0 ? (
            <p className="text-center text-xs text-slate-300 py-4">Empty</p>
          ) : (
            leads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onClick={onLeadClick} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
