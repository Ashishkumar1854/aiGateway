'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'

export default function OutreachAgentPage() {
  const [tasks, setTasks] = useState([])
  const [meta, setMeta] = useState({ total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/v1/agents/tasks?type=EMAIL_OUTREACH&limit=30')
      .then(res => { setTasks(res.data || []); setMeta(res.meta || { total: 0 }) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Email / LinkedIn Outreach Agent"
        subtitle="AI-drafted outreach messages waiting for admin approval before sending."
      />

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 flex items-start gap-2">
        <span>⚠️</span>
        <p>All outreach drafts require <strong>manual approval</strong> before sending. No emails or LinkedIn messages are sent autonomously. Approve tasks via the <a href="/agents/tasks" className="underline font-bold">Tasks Queue</a>.</p>
      </div>

      {loading ? <LoadingSpinner /> : tasks.length === 0 ? (
        <EmptyState
          title="No outreach tasks yet"
          description="Run the AI Orchestrator on a lead to generate outreach drafts. They will appear here for review."
          icon="📧"
        />
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">{task.lead?.companyName || 'Unknown Company'}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{task.lead?.contactName} · {task.lead?.email}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex-shrink-0 ${
                  task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                  task.status === 'AWAITING_APPROVAL' ? 'bg-yellow-100 text-yellow-700' :
                  task.status === 'APPROVED' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-600'
                }`}>{task.status}</span>
              </div>
              {task.draftContent && (
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto font-mono">
                  {task.draftContent}
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400">{new Date(task.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                {task.status === 'AWAITING_APPROVAL' && (
                  <a href="/agents/tasks" className="text-xs font-bold text-slate-900 hover:underline">
                    Approve in Tasks Queue →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
