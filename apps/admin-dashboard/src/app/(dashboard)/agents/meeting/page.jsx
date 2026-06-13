'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'

export default function MeetingAgentPage() {
  const [tasks, setTasks] = useState([])
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/api/v1/agents/tasks?type=MEETING_SCHEDULE&limit=30'),
      api.get('/api/v1/crm/meetings?limit=20'),
    ])
      .then(([tasksRes, meetingsRes]) => {
        setTasks(tasksRes.data || [])
        setMeetings(meetingsRes.data || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Meeting Agent"
        subtitle="AI-drafted meeting invites and calendar scheduling tasks. All meeting proposals require admin approval."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meeting Draft Tasks */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800">🗓️ Meeting Drafts Queue</h3>
          {loading ? <LoadingSpinner /> : tasks.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No meeting drafts pending.</p>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="border border-slate-100 rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-900">{task.lead?.companyName || 'Company'}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      task.status === 'AWAITING_APPROVAL' ? 'bg-yellow-100 text-yellow-700' :
                      task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>{task.status}</span>
                  </div>
                  {task.draftContent && (
                    <p className="text-xs text-slate-500 line-clamp-2 italic">"{task.draftContent}"</p>
                  )}
                  {task.status === 'AWAITING_APPROVAL' && (
                    <a href="/agents/tasks" className="text-[10px] font-bold text-indigo-600 hover:underline">
                      Approve in Tasks Queue →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scheduled Meetings */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800">✅ Scheduled Meetings</h3>
          {loading ? <LoadingSpinner /> : meetings.length === 0 ? (
            <EmptyState title="No meetings yet" description="Meeting invites approved and scheduled will appear here." icon="📅" />
          ) : (
            <div className="space-y-3">
              {meetings.map(meeting => (
                <div key={meeting.id} className="border border-slate-100 rounded-lg p-3 space-y-1">
                  <p className="text-xs font-semibold text-slate-900">{meeting.lead?.companyName || 'Meeting'}</p>
                  <p className="text-xs text-slate-500">{meeting.title}</p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(meeting.scheduledAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
