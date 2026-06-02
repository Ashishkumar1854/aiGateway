'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { StageSelector } from '@/components/crm/StageSelector'
import { ConversationForm } from '@/components/crm/ConversationForm'
import { MeetingForm } from '@/components/crm/MeetingForm'

const CHANNEL_ICON = {
  email: '📧', whatsapp: '💬', linkedin: '💼',
  instagram: '📸', phone: '📞', meeting: '📅',
}

export default function LeadDetailPage() {
  const { id } = useParams()
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stageLoading, setStageLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [showConvForm, setShowConvForm] = useState(false)
  const [showMeetingForm, setShowMeetingForm] = useState(false)

  const load = async () => {
    try {
      const res = await api.get(`/api/v1/crm/leads/${id}`)
      setLead(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (id) load() }, [id])

  const handleStageChange = async (newStatus) => {
    setStageLoading(true)
    try {
      await api.put(`/api/v1/crm/leads/${id}/stage`, { status: newStatus })
      setLead(prev => ({ ...prev, status: newStatus }))
    } catch (err) {
      console.error(err)
    } finally {
      setStageLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!lead) return <div className="p-6 text-slate-500">Lead not found.</div>

  const SCORE_COLOR = lead.score >= 80 ? 'text-green-600' : lead.score >= 60 ? 'text-yellow-600' : 'text-slate-400'

  return (
    <div className="p-6 max-w-5xl">
      {/* Back */}
      <a href="/crm" className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-4">
        ← Back to Pipeline
      </a>

      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{lead.companyName}</h1>
            {lead.contactName && <p className="text-slate-500 mt-0.5">{lead.contactName}</p>}
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-400">
              {lead.email && <span>📧 {lead.email}</span>}
              {lead.phone && <span>📞 {lead.phone}</span>}
              {lead.location && <span>📍 {lead.location}</span>}
              {lead.industry && <span>🏭 {lead.industry}</span>}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`text-4xl font-bold ${SCORE_COLOR}`}>{lead.score}</div>
            <div className="text-xs text-slate-400">score</div>
            <div className="text-xs text-slate-400 mt-1">{lead.source}</div>
          </div>
        </div>

        {/* Stage selector */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-400 mb-2">PIPELINE STAGE</p>
          <StageSelector
            current={lead.status}
            onChange={handleStageChange}
            loading={stageLoading}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-slate-100 rounded-lg p-1 w-fit">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'conversations', label: `Conversations (${lead.conversations?.length || 0})` },
          { key: 'meetings', label: `Meetings (${lead.meetings?.length || 0})` },
          { key: 'notes', label: `Notes (${lead.leadNotes?.length || 0})` },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {lead.notes && (
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">NOTES</p>
                <p className="text-sm text-slate-600">{lead.notes}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-medium text-slate-400">Created</p>
                <p className="text-slate-700">{new Date(lead.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Last Updated</p>
                <p className="text-slate-700">{new Date(lead.updatedAt).toLocaleDateString('en-IN')}</p>
              </div>
              {lead.website && (
                <div>
                  <p className="text-xs font-medium text-slate-400">Website</p>
                  <a href={lead.website} target="_blank" className="text-indigo-600 hover:underline">{lead.website}</a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Conversations */}
        {activeTab === 'conversations' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowConvForm(true)}
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800">
                + Add Conversation
              </button>
            </div>
            {lead.conversations?.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-8">No conversations yet</p>
            ) : (
              <div className="space-y-3">
                {lead.conversations?.map(conv => (
                  <div key={conv.id} className="flex gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-xl flex-shrink-0">{CHANNEL_ICON[conv.channel] || '💬'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-slate-600 capitalize">{conv.channel}</span>
                        <span className={`text-xs px-1.5 rounded ${conv.direction === 'inbound' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                          {conv.direction}
                        </span>
                        <span className="text-xs text-slate-400 ml-auto">{new Date(conv.sentAt).toLocaleDateString('en-IN')}</span>
                      </div>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{conv.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Meetings */}
        {activeTab === 'meetings' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowMeetingForm(true)}
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800">
                + Schedule Meeting
              </button>
            </div>
            {lead.meetings?.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-8">No meetings scheduled</p>
            ) : (
              <div className="space-y-3">
                {lead.meetings?.map(meeting => (
                  <div key={meeting.id} className="p-4 rounded-lg border border-slate-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{meeting.title}</p>
                        <p className="text-sm text-slate-500 mt-0.5">
                          📅 {new Date(meeting.scheduledAt).toLocaleString('en-IN')} · {meeting.duration} min
                        </p>
                        {meeting.meetingUrl && (
                          <a href={meeting.meetingUrl} target="_blank"
                            className="text-xs text-indigo-600 hover:underline mt-1 block">
                            Join Meeting →
                          </a>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        meeting.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        meeting.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {meeting.status}
                      </span>
                    </div>
                    {meeting.notes && <p className="text-sm text-slate-500 mt-2">{meeting.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {activeTab === 'notes' && (
          <div>
            {lead.leadNotes?.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-8">No notes yet</p>
            ) : (
              <div className="space-y-3">
                {lead.leadNotes?.map(note => (
                  <div key={note.id} className="p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                    <p className="text-sm text-slate-700">{note.content}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(note.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showConvForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl mx-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Add Conversation</h2>
            <ConversationForm
              leadId={id}
              onSuccess={() => { setShowConvForm(false); load() }}
              onCancel={() => setShowConvForm(false)}
            />
          </div>
        </div>
      )}

      {showMeetingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl mx-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Schedule Meeting</h2>
            <MeetingForm
              leadId={id}
              onSuccess={() => { setShowMeetingForm(false); load() }}
              onCancel={() => setShowMeetingForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
