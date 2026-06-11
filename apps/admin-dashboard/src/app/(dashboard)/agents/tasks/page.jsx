'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'

export default function AgentTasksPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('AWAITING_APPROVAL')
  const [actionLoading, setActionLoading] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/api/v1/agents/tasks?status=${filter}&limit=20`)
      setTasks(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filter])

  const handleApprove = async (id) => {
    setActionLoading(id)
    try {
      await api.put(`/api/v1/agents/tasks/${id}/approve`, {})
      await load()
    } catch (err) { console.error(err) }
    finally { setActionLoading(null) }
  }

  const handleReject = async (id) => {
    setActionLoading(id)
    try {
      await api.put(`/api/v1/agents/tasks/${id}/reject`, { reason: 'Rejected by admin' })
      await load()
    } catch (err) { console.error(err) }
    finally { setActionLoading(null) }
  }

  const STATUS_BADGE = {
    AWAITING_APPROVAL: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
    FAILED: 'bg-red-100 text-red-700',
  }

  return (
    <div className="p-6">
      <PageHeader title="Agent Tasks" subtitle="Review and approve AI agent actions" />
      <div className="mb-4 flex gap-2 flex-wrap">
        {['AWAITING_APPROVAL', 'APPROVED', 'COMPLETED', 'REJECTED', 'FAILED'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${filter === s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>
      {loading ? <LoadingSpinner /> : tasks.length === 0 ? (
        <EmptyState title="No tasks found" description="No agent tasks with this status" icon="🤖" />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-900">{task.agentType.replace('_', ' ')}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[task.status] || 'bg-slate-100 text-slate-500'}`}>{task.status.replace('_', ' ')}</span>
                  </div>
                  {task.lead && <p className="text-sm text-slate-500">Lead: <strong>{task.lead.companyName}</strong></p>}
                  <p className="text-xs text-slate-400 mt-1">{new Date(task.createdAt).toLocaleString()}</p>
                  
                  {task.agentType === 'MEETING' && task.input?.analysis && (
                    <div className="mt-2 p-2 rounded bg-slate-50 border border-slate-100 max-w-xl">
                      <p className="text-xs font-medium text-slate-600">
                        Interest: <span className={`font-bold ${
                          task.input.analysis.interest_level === 'HIGH' ? 'text-green-600' :
                          task.input.analysis.interest_level === 'MEDIUM' ? 'text-yellow-600' :
                          'text-slate-400'
                        }`}>{task.input.analysis.interest_level}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{task.input.analysis.summary}</p>
                      {task.input.proposed_slots?.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-slate-500">Proposed slots:</p>
                          {task.input.proposed_slots.map((slot, i) => (
                            <p key={i} className="text-xs text-slate-400">• {slot.label}</p>
                          ))}
                        </div>
                      )}
                      {task.input.invite_message && (
                        <details className="mt-2">
                          <summary className="text-xs text-slate-400 cursor-pointer">View invite message</summary>
                          <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap">{task.input.invite_message}</p>
                        </details>
                      )}
                    </div>
                  )}
                </div>
                {task.status === 'AWAITING_APPROVAL' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleApprove(task.id)} disabled={actionLoading === task.id} className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50">
                      {actionLoading === task.id ? '...' : 'Approve'}
                    </button>
                    <button onClick={() => handleReject(task.id)} disabled={actionLoading === task.id} className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 disabled:opacity-50">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}