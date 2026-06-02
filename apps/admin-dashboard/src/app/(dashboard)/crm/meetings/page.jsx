'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState([])
  const [meta, setMeta] = useState({ total: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('SCHEDULED')

  useEffect(() => {
    setLoading(true)
    api.get(`/api/v1/crm/meetings?status=${filter}&limit=20`)
      .then(res => { setMeetings(res.data); setMeta(res.meta) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [filter])

  const STATUS_COLOR = {
    SCHEDULED: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    NO_SHOW: 'bg-slate-100 text-slate-500',
  }

  return (
    <div className="p-6">
      <PageHeader title="Meetings" subtitle={`${meta.total} meetings`} />

      <div className="mb-4 flex gap-2">
        {['SCHEDULED', 'COMPLETED', 'CANCELLED'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : meetings.length === 0 ? (
        <EmptyState title="No meetings found" icon="📅" />
      ) : (
        <div className="space-y-3">
          {meetings.map(meeting => (
            <div key={meeting.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-900">{meeting.title}</p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {meeting.lead?.companyName} {meeting.lead?.contactName ? `— ${meeting.lead.contactName}` : ''}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    📅 {new Date(meeting.scheduledAt).toLocaleString('en-IN')} · {meeting.duration} min
                  </p>
                  {meeting.meetingUrl && (
                    <a href={meeting.meetingUrl} target="_blank"
                      className="text-xs text-indigo-600 hover:underline mt-1 block">
                      Join Meeting →
                    </a>
                  )}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[meeting.status] || ''}`}>
                  {meeting.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
