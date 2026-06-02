const STAGES = ['COLD', 'WARM', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST']

const STAGE_LABELS = {
  COLD: '🧊 Cold',
  WARM: '🔥 Warm',
  QUALIFIED: '✅ Qualified',
  PROPOSAL: '📄 Proposal',
  NEGOTIATION: '🤝 Negotiation',
  WON: '🎉 Won',
  LOST: '❌ Lost',
}

export function StageSelector({ current, onChange, loading }) {
  return (
    <div className="flex flex-wrap gap-2">
      {STAGES.map((stage) => (
        <button
          key={stage}
          onClick={() => stage !== current && onChange(stage)}
          disabled={loading || stage === current}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            stage === current
              ? 'bg-slate-900 text-white cursor-default'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50'
          }`}
        >
          {STAGE_LABELS[stage]}
        </button>
      ))}
    </div>
  )
}
