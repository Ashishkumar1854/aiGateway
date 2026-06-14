'use client'

import { useEffect, useState } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { StageSelector } from '@/components/crm/StageSelector'
import { ConversationForm } from '@/components/crm/ConversationForm'
import { MeetingForm } from '@/components/crm/MeetingForm'

const CHANNEL_ICON = {
  email: '📧', whatsapp: '💬', linkedin: '💼',
  instagram: '📸', phone: '📞', meeting: '📅',
}

function parseNotes(notesStr) {
  try {
    if (!notesStr) return null
    return JSON.parse(notesStr)
  } catch (e) {
    return null
  }
}

export default function LeadDetailPage() {
  const { id } = useParams()
  const pathname = usePathname()
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stageLoading, setStageLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [showConvForm, setShowConvForm] = useState(false)
  const [showMeetingForm, setShowMeetingForm] = useState(false)
  const [outreachLoading, setOutreachLoading] = useState(false)
  const [outreachError, setOutreachError] = useState(null)
  const [linkedinLoading, setLinkedinLoading] = useState(false)
  const [linkedinError, setLinkedinError] = useState(null)
  const [meetingLoading, setMeetingLoading] = useState(false)
  const [meetingResult, setMeetingResult] = useState(null)
  const [orchLoading, setOrchLoading] = useState(false)
  const [orchResult, setOrchResult] = useState(null)
  const [orchStatus, setOrchStatus] = useState(null)

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

  useEffect(() => {
    if (id) {
      api.get(`/api/v1/internal/orchestrator/status/${id}`)
        .then(res => setOrchStatus(res.data?.data || null))
        .catch(() => {})
    }
  }, [id])

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

  const handleGenerateEmail = async () => {
    setOutreachLoading(true)
    setOutreachError(null)
    try {
      await api.post('/api/v1/internal/email-outreach', { lead_id: id })
      await load()
    } catch (err) {
      setOutreachError(err.message || 'Failed to generate email outreach draft')
    } finally {
      setOutreachLoading(false)
    }
  }

  const handleGenerateLinkedin = async () => {
    setLinkedinLoading(true)
    setLinkedinError(null)
    try {
      await api.post('/api/v1/internal/linkedin-outreach', { lead_id: id })
      await load()
    } catch (err) {
      setLinkedinError(err.message || 'Failed to generate LinkedIn outreach draft')
    } finally {
      setLinkedinLoading(false)
    }
  }

  const handleMeetingAgent = async () => {
    setMeetingLoading(true)
    setMeetingResult(null)
    try {
      const res = await api.post('/api/v1/internal/meeting-agent', {
        lead_id: id,
        lead_data: {
          id: lead.id,
          companyName: lead.companyName,
          contactName: lead.contactName,
          email: lead.email,
          phone: lead.phone,
          industry: lead.industry,
          location: lead.location,
          notes: lead.notes,
          score: lead.score,
          status: lead.status,
        },
      })
      setMeetingResult(res.data)
      await load()
    } catch (err) {
      setMeetingResult({ error: err.message })
    } finally {
      setMeetingLoading(false)
    }
  }

  const handleRunOrchestrator = async () => {
    setOrchLoading(true)
    setOrchResult(null)
    try {
      const res = await api.post('/api/v1/internal/orchestrator/run', {
        lead_id: id,
        lead_data: {
          companyName: lead.companyName,
          contactName: lead.contactName,
          email: lead.email,
          industry: lead.industry,
          location: lead.location,
          status: lead.status,
          score: lead.score,
        }
      })
      setOrchResult(res.data?.data || res.data)
      
      // Refresh status
      await load()
      const statusRes = await api.get(`/api/v1/internal/orchestrator/status/${id}`)
      setOrchStatus(statusRes.data?.data || null)
    } catch (err) {
      setOrchResult({ error: err.message })
    } finally {
      setOrchLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!lead) return <div className="p-6 text-slate-500">Lead not found.</div>

  const SCORE_COLOR = lead.score >= 80 ? 'text-green-600' : lead.score >= 60 ? 'text-yellow-600' : 'text-slate-400'

  const latestOutreachTask = lead.agentTasks?.find(t => t.agentType === 'EMAIL_OUTREACH')
  const isPendingOrRunning = latestOutreachTask?.status === 'APPROVED' || latestOutreachTask?.status === 'RUNNING'

  const latestLinkedinTask = lead.agentTasks?.find(t => t.agentType === 'LINKEDIN')
  const isLinkedinPendingOrRunning = latestLinkedinTask?.status === 'APPROVED' || latestLinkedinTask?.status === 'RUNNING'

  const latestMeetingTask = lead.agentTasks?.find(t => t.agentType === 'MEETING')
  const isMeetingPendingOrRunning = latestMeetingTask?.status === 'APPROVED' || latestMeetingTask?.status === 'RUNNING'


  return (
    <div className="p-6 max-w-5xl">
      {/* Back */}
      <a 
        href={pathname.startsWith('/agents') ? '/agents/tasks' : '/crm'} 
        className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-4"
      >
        {pathname.startsWith('/agents') ? '← Back to Agent Tasks' : '← Back to Pipeline'}
      </a>

      {/* Warning Banners based on lead source */}
      {lead.source === 'website_contact' && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 mb-4 text-xs font-semibold text-green-800 flex items-center gap-2 shadow-sm">
          <span>🌐</span> This user signed up on your website. Do not use cold AI agent templates.
        </div>
      )}
      {lead.source === 'other_services' && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 mb-4 text-xs font-semibold text-blue-800 flex items-center gap-2 shadow-sm">
          <span>💼</span> Custom request. Avoid cold automation schedules.
        </div>
      )}

      {/* ── Service Interest Banner — extracted from notes ── */}
      {(() => {
        const match = lead.notes?.match(/\[Service Interest:\s*([^\]]+)\]/)
        const svc = match?.[1]?.trim()
        if (!svc) return null
        return (
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 mb-4 flex items-center gap-3 shadow-sm">
            <span className="text-2xl">🎯</span>
            <div className="flex-1">
              <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Interested Service</p>
              <p className="text-sm font-extrabold text-indigo-900 mt-0.5">{svc}</p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-600 border border-indigo-200 whitespace-nowrap">
              From Website Form
            </span>
          </div>
        )
      })()}

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

      {/* AI Outreach Block */}
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-white p-5 mb-4 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600 text-2xl flex-shrink-0">
            🤖
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
              AI Outreach & Meeting Agent Workforce
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">Phase 11 + 12 + 13</span>
            </h3>

            {/* AI Orchestrator Card */}
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 mb-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm font-semibold text-indigo-900 flex items-center gap-1.5">
                    <span>🎯</span> AI Orchestrator
                  </p>
                  <p className="text-xs text-indigo-600">Automatically decides the best next action for this lead based on current stage, score, and conversations.</p>
                </div>
                <button
                  onClick={handleRunOrchestrator}
                  disabled={orchLoading}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {orchLoading ? '🤖 Analyzing...' : '⚡ Run AI Workflow'}
                </button>
              </div>

              {/* Current status */}
              {orchStatus && (
                <div className="mt-3 pt-3 border-t border-indigo-100 text-xs text-indigo-700 space-y-1">
                  <p>
                    Stage: <strong className="uppercase">{orchStatus.stage}</strong> | 
                    Score: <strong>{orchStatus.score || 0}</strong> | 
                    Conversations: <strong>{orchStatus.conversations || 0}</strong> | 
                    Meetings: <strong>{orchStatus.meetings || 0}</strong>
                  </p>
                  {orchStatus.next_action && (
                    <p className="text-indigo-800">
                      Next Recommended: <strong className="text-indigo-900 uppercase font-bold">{orchStatus.next_action.action}</strong> — <span className="italic">{orchStatus.next_action.reason}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Result after running */}
              {orchResult && (
                <div className={`mt-3 rounded-lg p-2.5 text-xs ${orchResult.error ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-white text-indigo-800 border border-indigo-200'}`}>
                  {orchResult.error ? orchResult.error : (
                    <>
                      <p className="font-semibold text-indigo-950 flex items-center gap-1">
                        <span>✅</span> {orchResult.action_taken}
                      </p>
                      <p className="text-indigo-600 mt-0.5">{orchResult.decision?.reason}</p>
                      {orchResult.decision?.action !== 'WAIT' && orchResult.decision?.action !== 'COMPLETE' && (
                        <a href="/agents/tasks" className="mt-1.5 inline-block font-semibold text-indigo-700 hover:text-indigo-900 underline">
                          Review in Agent Tasks →
                        </a>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Email Outreach Block */}
              <div className="border-r border-slate-100 pr-0 md:pr-6">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5 mb-2">
                  <span>📧</span> Email Outreach
                </h4>
                
                {outreachLoading ? (
                  <p className="text-xs text-indigo-600 flex items-center gap-1.5 mt-1">
                    <span className="animate-spin">⏳</span> Drafting personalized email...
                  </p>
                ) : isPendingOrRunning ? (
                  <p className="text-xs text-indigo-700 font-medium flex items-center gap-1.5 mt-1">
                    <span className="animate-spin">⏳</span> Sending email to SendGrid...
                  </p>
                ) : latestOutreachTask?.status === 'AWAITING_APPROVAL' ? (
                  <div className="space-y-2">
                    <p className="text-xs text-amber-700 font-medium flex items-center gap-1">
                      <span>⏳</span> Email draft pending approval
                    </p>
                    <p className="text-xs text-slate-500 italic truncate max-w-full">
                      Subject: "{latestOutreachTask.input?.subject}"
                    </p>
                    <a href="/agents/tasks" className="inline-block rounded-lg bg-amber-600 px-3 py-1 text-xs font-medium text-white hover:bg-amber-700 transition-colors shadow-sm">
                      Review & Approve →
                    </a>
                  </div>
                ) : latestOutreachTask?.status === 'COMPLETED' ? (
                  <div className="space-y-2">
                    <p className="text-xs text-green-700 font-medium flex items-center gap-1">
                      <span>✅</span> Outreach email sent successfully!
                    </p>
                    <button onClick={handleGenerateEmail} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                      Draft New Email
                    </button>
                  </div>
                ) : latestOutreachTask?.status === 'FAILED' ? (
                  <div className="space-y-2">
                    <p className="text-xs text-red-700 font-medium">
                      ❌ Failed: {latestOutreachTask.error || 'Unknown error'}
                    </p>
                    <button onClick={handleGenerateEmail} className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 transition-colors">
                      Retry Draft
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">
                      Draft a personalized email sequence using lead details, company website and notes.
                    </p>
                    {outreachError && (
                      <p className="text-xs text-red-600 font-medium">⚠️ {outreachError}</p>
                    )}
                    <button onClick={handleGenerateEmail} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-1.5">
                      Generate Email Draft
                    </button>
                  </div>
                )}
              </div>

              {/* LinkedIn Outreach Block */}
              <div className="border-r border-slate-100 pr-0 md:pr-6">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5 mb-2">
                  <span>💼</span> LinkedIn Connection (Drafts Only)
                </h4>
                
                {linkedinLoading ? (
                  <p className="text-xs text-indigo-600 flex items-center gap-1.5 mt-1">
                    <span className="animate-spin">⏳</span> Drafting LinkedIn message...
                  </p>
                ) : isLinkedinPendingOrRunning ? (
                  <p className="text-xs text-indigo-700 font-medium flex items-center gap-1.5 mt-1">
                    <span className="animate-spin">⏳</span> Logging connection draft...
                  </p>
                ) : latestLinkedinTask?.status === 'AWAITING_APPROVAL' ? (
                  <div className="space-y-2">
                    <p className="text-xs text-amber-700 font-medium flex items-center gap-1">
                      <span>⏳</span> LinkedIn draft pending approval
                    </p>
                    <p className="text-xs text-slate-500 italic truncate max-w-full">
                      Note: "{latestLinkedinTask.input?.connectionNote}"
                    </p>
                    <a href="/agents/tasks" className="inline-block rounded-lg bg-amber-600 px-3 py-1 text-xs font-medium text-white hover:bg-amber-700 transition-colors shadow-sm">
                      Review & Approve →
                    </a>
                  </div>
                ) : latestLinkedinTask?.status === 'COMPLETED' ? (
                  <div className="space-y-2">
                    <p className="text-xs text-green-700 font-medium flex items-center gap-1">
                      <span>✅</span> LinkedIn draft approved & logged!
                    </p>
                    <button onClick={handleGenerateLinkedin} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                      Draft New Message
                    </button>
                  </div>
                ) : latestLinkedinTask?.status === 'FAILED' ? (
                  <div className="space-y-2">
                    <p className="text-xs text-red-700 font-medium">
                      ❌ Failed: {latestLinkedinTask.error || 'Unknown error'}
                    </p>
                    <button onClick={handleGenerateLinkedin} className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 transition-colors">
                      Retry Draft
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">
                      Draft a personalized connection request (under 300 characters) & initial follow-up pitch.
                    </p>
                    {linkedinError && (
                      <p className="text-xs text-red-600 font-medium">⚠️ {linkedinError}</p>
                    )}
                    <button onClick={handleGenerateLinkedin} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-1.5">
                      Generate LinkedIn Draft
                    </button>
                  </div>
                )}
              </div>

              {/* Meeting Agent Block */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5 mb-2">
                  <span>📅</span> Meeting Booking
                </h4>
                
                {meetingLoading ? (
                  <p className="text-xs text-indigo-600 flex items-center gap-1.5 mt-1">
                    <span className="animate-spin">⏳</span> Analyzing conversations & slots...
                  </p>
                ) : isMeetingPendingOrRunning ? (
                  <p className="text-xs text-indigo-700 font-medium flex items-center gap-1.5 mt-1">
                    <span className="animate-spin">⏳</span> Booking meeting in CRM...
                  </p>
                ) : latestMeetingTask?.status === 'AWAITING_APPROVAL' ? (
                  <div className="space-y-2">
                    <p className="text-xs text-amber-700 font-medium flex items-center gap-1">
                      <span>⏳</span> Proposal pending approval
                    </p>
                    <p className="text-xs text-slate-500 italic truncate max-w-full">
                      Title: "{latestMeetingTask.input?.meeting_title}"
                    </p>
                    <a href="/agents/tasks" className="inline-block rounded-lg bg-amber-600 px-3 py-1 text-xs font-medium text-white hover:bg-amber-700 transition-colors shadow-sm">
                      Review & Approve →
                    </a>
                  </div>
                ) : latestMeetingTask?.status === 'COMPLETED' ? (
                  <div className="space-y-2">
                    <p className="text-xs text-green-700 font-medium flex items-center gap-1">
                      <span>✅</span> Meeting booked successfully!
                    </p>
                    <button onClick={handleMeetingAgent} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                      Book Another
                    </button>
                  </div>
                ) : latestMeetingTask?.status === 'FAILED' ? (
                  <div className="space-y-2">
                    <p className="text-xs text-red-700 font-medium">
                      ❌ Failed: {latestMeetingTask.error || 'Unknown error'}
                    </p>
                    <button onClick={handleMeetingAgent} className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 transition-colors">
                      Retry Booking
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">
                      Analyze conversations using Gemini, generate slots, and draft meeting invite.
                    </p>
                    <button onClick={handleMeetingAgent} className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition-colors shadow-sm flex items-center gap-1.5">
                      Book Meeting
                    </button>
                  </div>
                )}
                
                {meetingResult && (
                  <div className={`mt-2 rounded-lg p-3 text-xs ${meetingResult.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {meetingResult.error || meetingResult.message}
                    {meetingResult.task_id && (
                      <>
                        <span className="ml-1">Interest: <strong>{meetingResult.analysis?.interest_level}</strong></span>
                        <a href="/agents/tasks" className="ml-2 underline font-medium">
                          Review in Agent Tasks →
                        </a>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
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
            {lead.source === 'other_services' ? (
              (() => {
                const parsed = parseNotes(lead.notes)
                if (parsed) {
                  return (
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-205 pb-2">
                        📋 Custom Project Specifications
                      </h3>
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Project Name</p>
                        <p className="text-sm font-extrabold text-slate-900">{parsed.projectName}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Estimated Budget</p>
                          <p className="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-2.5 py-1 w-fit">
                            {parsed.budget}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Source Queue</p>
                          <p className="text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded px-2.5 py-1 w-fit">
                            💼 Other Services Portal
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Requirements Description</p>
                        <p className="text-sm text-slate-755 whitespace-pre-wrap bg-white rounded-lg p-3 border border-slate-200 leading-relaxed">
                          {parsed.requirements}
                        </p>
                      </div>
                    </div>
                  )
                }
                return (
                  <div>
                    <p className="text-xs font-medium text-slate-400 mb-1">REQUIREMENTS</p>
                    <p className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3 whitespace-pre-wrap">{lead.notes}</p>
                  </div>
                )
              })()
            ) : (
              lead.notes && (
                <div>
                  <p className="text-xs font-medium text-slate-400 mb-1">NOTES</p>
                  <p className="text-sm text-slate-600">{lead.notes}</p>
                </div>
              )
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
