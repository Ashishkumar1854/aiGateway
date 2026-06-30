'use client'

import { useEffect, useState, use } from 'react'
import { api } from '@/lib/api'
import { getUser } from '@/lib/auth'
import Link from 'next/link'

export default function ServiceSlugPage({ params }) {
  const slug = params?.slug || ''

  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState(null)
  const [assignment, setAssignment] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Smart Apply State
  const [resumes, setResumes] = useState([])
  const [applications, setApplications] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)

  // Form states - Upload Resume
  const [newResumeName, setNewResumeName] = useState('')
  const [newResumePdf, setNewResumePdf] = useState('')
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  // Form states - Replace Resume Version
  const [replaceResumeId, setReplaceResumeId] = useState(null)
  const [replacePdf, setReplacePdf] = useState('')
  const [replaceLoading, setReplaceLoading] = useState(false)
  const [replaceError, setReplaceError] = useState('')

  // Form states - Manual Apply
  const [applyResumeVersionId, setApplyResumeVersionId] = useState('')
  const [applyRole, setApplyRole] = useState('')
  const [applyCompany, setApplyCompany] = useState('')
  const [applyHrEmail, setApplyHrEmail] = useState('')
  const [applyHrName, setApplyHrName] = useState('')
  const [applyJobDesc, setApplyJobDesc] = useState('')
  const [applyNotes, setApplyNotes] = useState('')
  const [generateLoading, setGenerateLoading] = useState(false)
  const [generateError, setGenerateError] = useState('')

  // Preview / Send Email Draft states
  const [generatedDraftId, setGeneratedDraftId] = useState(null)
  const [draftSubject, setDraftSubject] = useState('')
  const [draftBody, setDraftBody] = useState('')
  const [sendLoading, setSendLoading] = useState(false)
  const [sendError, setSendError] = useState('')
  const [sendSuccessMsg, setSendSuccessMsg] = useState('')

  // Settings states
  const [settingsSignature, setSettingsSignature] = useState('Best regards,\n[Your Name]')
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState(false)

  // Interview Notes Form states
  const [interviewRoundName, setInterviewRoundName] = useState('')
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewQuestions, setInterviewQuestions] = useState('')
  const [interviewResult, setInterviewResult] = useState('Pending')
  const [interviewNotes, setInterviewNotes] = useState('')
  const [interviewSaveLoading, setInterviewSaveLoading] = useState(false)

  // 1. Initial assignment / layout resolve
  useEffect(() => {
    const userObj = getUser()
    if (!userObj?.client?.id) {
      setLoading(false)
      return
    }

    api.get(`/api/v1/clients/${userObj.client.id}`)
      .then((clientRes) => {
        if (clientRes?.success && clientRes.data) {
          setClient(clientRes.data)
          const found = clientRes.data.serviceAssignments?.find(sa => {
            const type = sa.service?.type
            const serviceSlug = getSlugForType(type)
            return serviceSlug === slug
          })
          setAssignment(found || null)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  // 2. Fetch Smart Apply data (Resumes & Applications)
  const fetchSmartApplyData = () => {
    if (slug !== 'smart-apply' && slug !== 'job-seeker') return

    // Get resumes
    api.get('/api/v1/smart-apply/resumes')
      .then(res => {
        if (res.success && res.data) {
          setResumes(res.data)
          // Pre-select active version if manual apply is empty
          if (!applyResumeVersionId && res.data.length > 0) {
            const activeRes = res.data[0];
            const currentVer = activeRes.versions?.find(v => v.isCurrent) || activeRes.versions?.[0];
            if (currentVer) setApplyResumeVersionId(currentVer.id);
          }
        }
      })
      .catch(console.error)

    // Get applications
    api.get('/api/v1/smart-apply/applications')
      .then(res => {
        if (res.success && res.data) {
          setApplications(res.data)
        }
      })
      .catch(console.error)
  }

  useEffect(() => {
    if (!loading && assignment && (slug === 'smart-apply' || slug === 'job-seeker')) {
      fetchSmartApplyData()
    }
  }, [loading, assignment, slug])

  const getSlugForType = (type) => {
    switch (type) {
      case 'LEAD_GENERATION': return 'lead-generation'
      case 'EMAIL_AUTOMATION': return 'email-automation'
      case 'REELS_AUTOMATION': return 'reels-automation'
      case 'WHATSAPP_AUTOMATION': return 'whatsapp-automation'
      case 'LINKEDIN_OUTREACH': return 'linkedin-automation'
      case 'JOB_SEEKER': return 'smart-apply'
      case 'SMART_APPLY': return 'smart-apply'
      default: return 'custom'
    }
  }

  // ─── RESUME ACTIONS ────────────────────────────────────────────────────────

  const handleUploadResume = (e) => {
    e.preventDefault()
    if (!newResumeName || !newResumePdf) {
      setUploadError('Please fill out all fields.')
      return
    }

    setUploadLoading(true)
    setUploadError('')

    api.post('/api/v1/smart-apply/resumes', {
      name: newResumeName,
      pdfLocation: newResumePdf
    })
      .then(res => {
        if (res.success) {
          setNewResumeName('')
          setNewResumePdf('')
          fetchSmartApplyData()
        } else {
          setUploadError(res.error?.message || 'Failed to create resume.')
        }
      })
      .catch(err => setUploadError(err.message || 'An error occurred.'))
      .finally(() => setUploadLoading(false))
  }

  const handleReplaceVersion = (e) => {
    e.preventDefault()
    if (!replacePdf) {
      setReplaceError('Please provide a PDF file location.')
      return
    }

    setReplaceLoading(true)
    setReplaceError('')

    api.post(`/api/v1/smart-apply/resumes/${replaceResumeId}/versions`, {
      pdfLocation: replacePdf
    })
      .then(res => {
        if (res.success) {
          setReplacePdf('')
          setReplaceResumeId(null)
          fetchSmartApplyData()
        } else {
          setReplaceError(res.error?.message || 'Failed to add version.')
        }
      })
      .catch(err => setReplaceError(err.message || 'An error occurred.'))
      .finally(() => setReplaceLoading(false))
  }

  const handleSetActiveVersion = (resumeId, versionId) => {
    api.put(`/api/v1/smart-apply/resumes/${resumeId}/versions/${versionId}/current`)
      .then(res => {
        if (res.success) {
          fetchSmartApplyData()
        }
      })
      .catch(console.error)
  }

  // ─── APPLICATION DRAFT & SEND ACTIONS ──────────────────────────────────────

  const handleGenerateEmail = (e) => {
    e.preventDefault()
    if (!applyResumeVersionId || !applyRole || !applyCompany || !applyHrEmail) {
      setGenerateError('Please fill out all mandatory fields.')
      return
    }

    setGenerateLoading(true)
    setGenerateError('')
    setGeneratedDraftId(null)
    setDraftSubject('')
    setDraftBody('')

    api.post('/api/v1/smart-apply/applications', {
      resumeVersionId: applyResumeVersionId,
      companyName: applyCompany,
      role: applyRole,
      hrEmail: applyHrEmail,
      hrName: applyHrName,
      jobDescription: applyJobDesc,
      additionalNotes: applyNotes
    })
      .then(res => {
        if (res.success && res.data) {
          setGeneratedDraftId(res.data.id)
          setDraftSubject(res.data.subject || '')
          // Append signature if configured
          const baseContent = res.data.emailContent || '';
          setDraftBody(settingsSignature ? `${baseContent}\n\n${settingsSignature}` : baseContent)
        } else {
          setGenerateError(res.error?.message || 'Failed to generate email draft.')
        }
      })
      .catch(err => setGenerateError(err.message || 'An error occurred during AI email generation.'))
      .finally(() => setGenerateLoading(false))
  }

  const handleSendEmail = () => {
    if (!generatedDraftId) return

    setSendLoading(true)
    setSendError('')
    setSendSuccessMsg('')

    // Update with edited subject/body and transition to SENT
    api.put(`/api/v1/smart-apply/applications/${generatedDraftId}`, {
      status: 'SENT',
      subject: draftSubject,
      emailContent: draftBody
    })
      .then(res => {
        if (res.success) {
          setSendSuccessMsg('Job application email successfully dispatched to recruiter!')
          setGeneratedDraftId(null)
          setDraftSubject('')
          setDraftBody('')
          // Reset apply fields
          setApplyRole('')
          setApplyCompany('')
          setApplyHrEmail('')
          setApplyHrName('')
          setApplyJobDesc('')
          setApplyNotes('')
          fetchSmartApplyData()
        } else {
          setSendError(res.error?.message || 'Failed to send email.')
        }
      })
      .catch(err => setSendError(err.message || 'An error occurred during sending.'))
      .finally(() => setSendLoading(false))
  }

  const handleUpdateApplicationStatus = (appId, nextStatus) => {
    api.put(`/api/v1/smart-apply/applications/${appId}`, {
      status: nextStatus
    })
      .then(res => {
        if (res.success) {
          fetchSmartApplyData()
          // Refresh details view if matching
          if (selectedApplication?.id === appId) {
            api.get(`/api/v1/smart-apply/applications/${appId}`).then(dRes => {
              if (dRes.success) setSelectedApplication(dRes.data)
            })
          }
        }
      })
      .catch(console.error)
  }

  const handleSaveInterviewRound = (e) => {
    e.preventDefault()
    if (!interviewRoundName) return

    setInterviewSaveLoading(true)

    api.post(`/api/v1/smart-apply/applications/${selectedApplication.id}/interviews`, {
      roundName: interviewRoundName,
      scheduledAt: interviewDate || null,
      questionsAsked: interviewQuestions,
      result: interviewResult,
      notes: interviewNotes
    })
      .then(res => {
        if (res.success) {
          // Reset note form fields
          setInterviewRoundName('')
          setInterviewDate('')
          setInterviewQuestions('')
          setInterviewResult('Pending')
          setInterviewNotes('')
          // Refresh details view
          api.get(`/api/v1/smart-apply/applications/${selectedApplication.id}`).then(dRes => {
            if (dRes.success) {
              setSelectedApplication(dRes.data)
              fetchSmartApplyData()
            }
          })
        }
      })
      .catch(console.error)
      .finally(() => setInterviewSaveLoading(false))
  }

  const selectApplicationForDetail = (appId) => {
    api.get(`/api/v1/smart-apply/applications/${appId}`)
      .then(res => {
        if (res.success && res.data) {
          setSelectedApplication(res.data)
        }
      })
      .catch(console.error)
  }

  // ─── ANALYTICS CALCULATION ─────────────────────────────────────────────────

  const totalApplications = applications.filter(a => a.status !== 'DRAFT').length
  const totalOpened = applications.filter(a => a.status === 'OPENED' || a.status === 'FEEDBACK_RECEIVED' || a.status.startsWith('INTERVIEW')).length
  const totalFeedback = applications.filter(a => a.status === 'FEEDBACK_RECEIVED').length
  const totalInterviews = applications.filter(a => a.status.startsWith('INTERVIEW') || a.status === 'OFFER_RECEIVED').length
  const totalOffers = applications.filter(a => a.status === 'OFFER_RECEIVED').length
  const openRate = totalApplications > 0 ? Math.round((totalOpened / totalApplications) * 100) : 0

  // ─── RENDERERS ─────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-800 border-t-indigo-500" />
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <span className="text-5xl block">⚠️</span>
        <h2 className="text-lg font-bold text-slate-900">Access Denied / Not Assigned</h2>
        <p className="text-xs text-slate-500">This AI automation service is not assigned to your active plan.</p>
        <Link href="/services" className="inline-block text-xs font-semibold text-indigo-650 hover:underline">← View My Services</Link>
      </div>
    )
  }

  // Render generic layout for other slugs if accessed
  if (slug !== 'smart-apply' && slug !== 'job-seeker') {
    return (
      <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-black text-slate-900">{assignment.service?.name}</h1>
        <p className="text-xs text-slate-500">{assignment.service?.description}</p>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs text-slate-400 italic">Workspace configuration pending design review.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 lg:p-8 max-w-6xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-3xl">💼</div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Smart Apply</h1>
            <p className="text-xs text-slate-500 mt-0.5">Professional AI-assisted candidate application system</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 self-start md:self-auto">
          {['dashboard', 'resumes', 'apply', 'applications', 'analytics', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setSelectedApplication(null)
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 capitalize ${
                activeTab === tab
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-950'
              }`}
            >
              {tab === 'resumes' ? 'Resume Library' : tab === 'apply' ? 'Manual Apply' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* ─── TAB CONTENT ──────────────────────────────────────────────────────── */}

      {/* 1. DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-lg border border-indigo-950">
              <div className="absolute top-0 right-0 p-8 text-7xl opacity-10 pointer-events-none">⚡</div>
              <h2 className="text-xl font-black">Welcome to Candidate Workspace</h2>
              <p className="text-slate-300 text-xs mt-2 max-w-lg leading-relaxed">
                Configure your personalized resumes, generate customized outreach emails using parsed ATS profiles, verify details, and manual update round tracking from a single dashboard.
              </p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setActiveTab('apply')} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all duration-200">
                  New Application →
                </button>
                <button onClick={() => setActiveTab('resumes')} className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200">
                  Manage Resumes
                </button>
              </div>
            </div>

            {/* Quick How-it-Works roadmap */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900">Application Pipeline Setup</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { step: '1', title: 'Upload PDF', desc: 'Add resume. Parser extracts ATS fields.' },
                  { step: '2', title: 'Fill Info', desc: 'Select resume and enter target job specs.' },
                  { step: '3', title: 'Verify AI Draft', desc: 'Preview, edit, or regenerate variations.' },
                  { step: '4', title: 'Track Status', desc: 'Monitor recruiter interactions & opens.' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 relative">
                    <span className="absolute top-3 right-3 text-[10px] font-black bg-indigo-50 border border-indigo-150 text-indigo-700 px-2 py-0.5 rounded-full">
                      Step {item.step}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-4">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Active info card */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900">Active Profile</h3>
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-medium">Company Name</span>
                  <span className="font-bold text-slate-900">{client?.companyName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-medium">Total Resumes</span>
                  <span className="font-bold text-slate-900">{resumes.length} profiles</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-medium">Total Applications</span>
                  <span className="font-bold text-slate-900">{applications.length} submitted</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Plan</span>
                  <span className="bg-indigo-50 border border-indigo-150 text-indigo-700 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase">
                    {assignment.plan}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. RESUME LIBRARY TAB */}
      {activeTab === 'resumes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Resume profiles listing */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-base font-black text-slate-900">Candidate Resumes ({resumes.length})</h2>
            
            {resumes.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-400 text-xs italic">
                No resume profiles added yet. Use the sidebar to upload your first resume.
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map(resume => {
                  const currentVersionObj = resume.versions?.find(v => v.isCurrent) || resume.versions?.[0]
                  
                  return (
                    <div key={resume.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 hover:border-slate-300 transition-all duration-200">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            📄 {resume.name}
                            <span className="bg-slate-100 border border-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                              v{currentVersionObj?.version || 1} Active
                            </span>
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-1 font-medium">
                            Primary Role: <span className="text-slate-900 font-bold">{currentVersionObj?.primaryRole || 'Pending parsing'}</span>
                          </p>
                        </div>

                        {/* Replace Trigger */}
                        <button
                          onClick={() => {
                            setReplaceResumeId(resume.id)
                            setReplaceError('')
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 transition-all duration-200"
                        >
                          🔄 Replace / Add Version
                        </button>
                      </div>

                      {/* Display structured fields parsed by AI */}
                      {currentVersionObj && (
                        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-[11px] space-y-3">
                          <div>
                            <span className="font-bold text-slate-800 uppercase text-[9px] tracking-wider block">Target Niche/Skills:</span>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {currentVersionObj.skills?.map((s, idx) => (
                                <span key={idx} className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] px-2.5 py-0.5 rounded-md font-medium">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="font-bold text-slate-800 uppercase text-[9px] tracking-wider block">Key Technologies:</span>
                            <span className="text-slate-650 mt-1 block">{currentVersionObj.technologies?.join(', ') || 'No tech details.'}</span>
                          </div>

                          <div>
                            <span className="font-bold text-slate-800 uppercase text-[9px] tracking-wider block">ATS keywords:</span>
                            <span className="text-slate-650 mt-1 block">{currentVersionObj.atsKeywords?.join(', ') || 'No keywords.'}</span>
                          </div>

                          <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2.5 flex justify-between">
                            <span>File: <span className="font-mono text-slate-650">{currentVersionObj.pdfLocation}</span></span>
                            <span>Experience: <span className="font-bold text-slate-700">{currentVersionObj.experience}</span></span>
                          </div>
                        </div>
                      )}

                      {/* Version history list */}
                      {resume.versions && resume.versions.length > 1 && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Version History</span>
                          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden text-[10.5px]">
                            {resume.versions.map(v => (
                              <div key={v.id} className="flex justify-between items-center px-4 py-2 bg-slate-50/20">
                                <span>Version {v.version} ({v.primaryRole || 'Unparsed'}) - <span className="font-mono text-[9.5px] text-slate-400">{v.pdfLocation}</span></span>
                                {!v.isCurrent ? (
                                  <button
                                    onClick={() => handleSetActiveVersion(resume.id, v.id)}
                                    className="text-[9.5px] font-bold text-indigo-650 hover:underline"
                                  >
                                    Set Active
                                  </button>
                                ) : (
                                  <span className="text-[9.5px] font-black text-emerald-700">★ Active</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Form panels (Upload/Replace) */}
          <div className="space-y-6">
            
            {/* Create Resume profile form */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900">Upload New Resume</h3>
              <form onSubmit={handleUploadResume} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-450 uppercase block">Profile Name</label>
                  <input
                    type="text"
                    value={newResumeName}
                    onChange={e => setNewResumeName(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-all duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-450 uppercase block">PDF Path / Location</label>
                  <input
                    type="text"
                    value={newResumePdf}
                    onChange={e => setNewResumePdf(e.target.value)}
                    placeholder="e.g. /resumes/frontend_v1.pdf"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-all duration-200"
                  />
                </div>

                {uploadError && <p className="text-[10px] font-bold text-red-600">{uploadError}</p>}

                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all duration-250"
                >
                  {uploadLoading ? 'Uploading & AI Parsing...' : 'Upload & Parse Resume'}
                </button>
              </form>
            </div>

            {/* Replace version form modal-like panel */}
            {replaceResumeId && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 relative">
                <button
                  onClick={() => setReplaceResumeId(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 font-bold"
                >
                  ✕
                </button>
                <h3 className="text-sm font-black text-slate-900">Replace/Update Resume Version</h3>
                <form onSubmit={handleReplaceVersion} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase block">New PDF Path / Location</label>
                    <input
                      type="text"
                      value={replacePdf}
                      onChange={e => setReplacePdf(e.target.value)}
                      placeholder="e.g. /resumes/frontend_v2.pdf"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-all duration-200"
                    />
                  </div>

                  {replaceError && <p className="text-[10px] font-bold text-red-600">{replaceError}</p>}

                  <button
                    type="submit"
                    disabled={replaceLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all duration-250"
                  >
                    {replaceLoading ? 'Replacing & AI Parsing...' : 'Parse & Set Current'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. MANUAL APPLY TAB */}
      {activeTab === 'apply' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Configuration Form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 h-fit">
            <h3 className="text-sm font-black text-slate-900">Manual Apply Details</h3>
            
            <form onSubmit={handleGenerateEmail} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-450 uppercase block">Select Resume Profile</label>
                <select
                  value={applyResumeVersionId}
                  onChange={e => setApplyResumeVersionId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-all duration-200 font-medium"
                >
                  <option value="">-- Choose Resume Profile --</option>
                  {resumes.map(r => {
                    const currentVer = r.versions?.find(v => v.isCurrent) || r.versions?.[0]
                    return (
                      <option key={r.id} value={currentVer?.id}>
                        {r.name} (v{currentVer?.version || 1} - {currentVer?.primaryRole || 'Unparsed'})
                      </option>
                    )
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-450 uppercase block">Target Company *</label>
                  <input
                    type="text"
                    value={applyCompany}
                    onChange={e => setApplyCompany(e.target.value)}
                    placeholder="e.g. Google"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-all duration-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-450 uppercase block">Job Role *</label>
                  <input
                    type="text"
                    value={applyRole}
                    onChange={e => setApplyRole(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-450 uppercase block">HR Email *</label>
                  <input
                    type="email"
                    value={applyHrEmail}
                    onChange={e => setApplyHrEmail(e.target.value)}
                    placeholder="e.g. jobs@google.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-all duration-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-450 uppercase block">HR Name (Optional)</label>
                  <input
                    type="text"
                    value={applyHrName}
                    onChange={e => setApplyHrName(e.target.value)}
                    placeholder="e.g. Ashish"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-450 uppercase block">Job Description (Optional)</label>
                <textarea
                  value={applyJobDesc}
                  onChange={e => setApplyJobDesc(e.target.value)}
                  placeholder="Paste details to improve AI context match..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-all duration-200 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-450 uppercase block">Additional Notes (Optional)</label>
                <input
                  type="text"
                  value={applyNotes}
                  onChange={e => setApplyNotes(e.target.value)}
                  placeholder="e.g. Please mention my interest in Remote work."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-all duration-200"
                />
              </div>

              {generateError && <p className="text-[10px] font-bold text-red-600">{generateError}</p>}

              <button
                type="submit"
                disabled={generateLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all duration-250"
              >
                {generateLoading ? 'Generating email draft...' : 'Generate Email Draft'}
              </button>
            </form>
          </div>

          {/* AI Email Draft Preview Panel */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-base font-black text-slate-900">Application Email Draft</h2>
            
            {sendSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl p-4 text-xs font-bold">
                ✓ {sendSuccessMsg}
              </div>
            )}

            {!generatedDraftId ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-450 text-xs italic">
                Please complete the form details and trigger email draft generation.
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                    AI generated draft ready
                  </span>
                  <div className="flex gap-2">
                    {/* REGENERATE button */}
                    <button
                      onClick={handleGenerateEmail}
                      disabled={generateLoading}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 transition-all duration-200"
                    >
                      {generateLoading ? 'Regenerating...' : '🔄 Regenerate'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase block">Subject Line</label>
                    <input
                      type="text"
                      value={draftSubject}
                      onChange={e => setDraftSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-all duration-200 font-bold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase block">Email Body</label>
                    <textarea
                      value={draftBody}
                      onChange={e => setDraftBody(e.target.value)}
                      rows={12}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-all duration-200 leading-relaxed font-mono resize-none text-slate-750"
                    />
                  </div>
                </div>

                {sendError && <p className="text-[10px] font-bold text-red-600">{sendError}</p>}

                <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                  <span className="text-[10.5px] text-slate-400">Recipient: <span className="font-bold text-slate-700">{applyHrEmail}</span></span>
                  <button
                    onClick={handleSendEmail}
                    disabled={sendLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all duration-250"
                  >
                    {sendLoading ? 'Dispatched via SMTP...' : '🚀 Approve & Send Email'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. APPLICATIONS TAB */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          {!selectedApplication ? (
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-200 bg-slate-50/20">
                <h2 className="text-sm font-black text-slate-900">Submitted Applications ({applications.length})</h2>
              </div>
              
              {applications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs italic">
                  No applications sent yet. Use the Manual Apply tab to start.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[9px] tracking-wider font-black">
                        <th className="p-4">Company</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Resume Version</th>
                        <th className="p-4">Date Applied</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {applications.map(app => (
                        <tr
                          key={app.id}
                          className="hover:bg-slate-50/50 cursor-pointer transition-all duration-150"
                          onClick={() => selectApplicationForDetail(app.id)}
                        >
                          <td className="p-4 font-bold text-slate-900">{app.companyName}</td>
                          <td className="p-4 text-slate-650">{app.role}</td>
                          <td className="p-4 font-mono text-[10.5px]">v{app.resumeVersion?.version || 1}</td>
                          <td className="p-4 text-slate-500">{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Draft'}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase border ${
                              app.status === 'DRAFT' ? 'bg-slate-100 border-slate-200 text-slate-700' :
                              app.status === 'SENT' ? 'bg-indigo-50 border-indigo-150 text-indigo-700' :
                              app.status === 'OPENED' ? 'bg-amber-50 border-amber-250 text-amber-700' :
                              app.status === 'FEEDBACK_RECEIVED' ? 'bg-pink-50 border-pink-150 text-pink-700' :
                              app.status === 'REJECTED' ? 'bg-red-50 border-red-150 text-red-700' :
                              app.status === 'OFFER_RECEIVED' ? 'bg-emerald-50 border-emerald-250 text-emerald-700' :
                              'bg-indigo-50 border-indigo-200 text-indigo-700'
                            }`}>
                              {app.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => selectApplicationForDetail(app.id)}
                              className="text-xs font-bold text-indigo-650 hover:underline"
                            >
                              Details →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* 4B. APPLICATION DETAILS PANEL */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main details and status updates */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                    <div>
                      <button
                        onClick={() => setSelectedApplication(null)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-900 block mb-2"
                      >
                        ← Back to Applications List
                      </button>
                      <h2 className="text-base font-black text-slate-900">
                        {selectedApplication.companyName}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Role: <span className="font-bold text-slate-700">{selectedApplication.role}</span></p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-bold text-slate-400">Current Status:</span>
                      <select
                        value={selectedApplication.status}
                        onChange={e => handleUpdateApplicationStatus(selectedApplication.id, e.target.value)}
                        className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold outline-none focus:border-indigo-500 transition-all duration-200 text-indigo-750"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="SENT">Sent</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="OPENED">Opened</option>
                        <option value="FEEDBACK_RECEIVED">Feedback Received</option>
                        <option value="INTERVIEW_ROUND_1">Interview Round 1</option>
                        <option value="INTERVIEW_ROUND_2">Interview Round 2</option>
                        <option value="FINAL_INTERVIEW">Final Interview</option>
                        <option value="OFFER_RECEIVED">Offer Received</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {/* Recruiter feedback detail */}
                  {selectedApplication.status === 'FEEDBACK_RECEIVED' && selectedApplication.feedbackType && (
                    <div className="bg-pink-50/50 border border-pink-150 rounded-2xl p-5 space-y-2">
                      <span className="text-[10px] font-black uppercase text-pink-700 block">Recruiter Feedback Details</span>
                      <div className="text-xs space-y-1.5 text-slate-750">
                        <p><strong>Reason:</strong> {selectedApplication.feedbackType.replace(/_/g, ' ')}</p>
                        {selectedApplication.feedbackText && (
                          <p className="italic bg-white/60 p-2.5 rounded-xl border border-pink-100">
                            &quot;{selectedApplication.feedbackText}&quot;
                          </p>
                        )}
                        <p className="text-[10px] text-slate-450">Received on: {selectedApplication.feedbackReceivedAt ? new Date(selectedApplication.feedbackReceivedAt).toLocaleString() : 'N/A'}</p>
                      </div>
                    </div>
                  )}

                  {/* Application Info info */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-450 uppercase block">HR Recipient</span>
                      <p className="font-bold text-slate-800 mt-1">{selectedApplication.hrName || 'Hiring Team'}</p>
                      <p className="text-slate-500 font-mono text-[10.5px] mt-0.5">{selectedApplication.hrEmail}</p>
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-450 uppercase block">Resume Profile Used</span>
                      <p className="font-bold text-slate-800 mt-1">{selectedApplication.resumeVersion?.resume?.name}</p>
                      <p className="text-slate-500 text-[10.5px] mt-0.5">Version {selectedApplication.resumeVersion?.version}</p>
                    </div>
                  </div>

                  {/* Interview notes logs */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Interview Rounds notes</h3>
                    
                    {selectedApplication.interviewNotes && selectedApplication.interviewNotes.length > 0 ? (
                      <div className="space-y-3">
                        {selectedApplication.interviewNotes.map(n => (
                          <div key={n.id} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-xs space-y-2">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                              <span className="font-bold text-slate-950">{n.roundName}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                n.result === 'Pass' ? 'bg-emerald-50 border-emerald-150 text-emerald-700' :
                                n.result === 'Fail' ? 'bg-red-50 border-red-150 text-red-700' :
                                'bg-slate-100 border-slate-200 text-slate-700'
                              }`}>{n.result}</span>
                            </div>
                            {n.scheduledAt && <p className="text-[10px] text-slate-450">Scheduled: {new Date(n.scheduledAt).toLocaleDateString()}</p>}
                            {n.questionsAsked && (
                              <p className="text-[11px] text-slate-700">
                                <strong>Questions:</strong> {n.questionsAsked}
                              </p>
                            )}
                            {n.notes && (
                              <p className="text-[11px] text-slate-700">
                                <strong>Notes:</strong> {n.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-450 italic">No interview rounds logged yet.</p>
                    )}

                    {/* Add note form */}
                    <form onSubmit={handleSaveInterviewRound} className="bg-slate-50/30 border border-slate-100 rounded-2xl p-4 space-y-3">
                      <h4 className="text-[11px] font-bold text-slate-900">Log Interview Round</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-450 block">Round Name</label>
                          <input
                            type="text"
                            value={interviewRoundName}
                            onChange={e => setInterviewRoundName(e.target.value)}
                            placeholder="e.g. Technical Round 1"
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-450 block">Scheduled Date (Optional)</label>
                          <input
                            type="date"
                            value={interviewDate}
                            onChange={e => setInterviewDate(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1 col-span-2">
                          <label className="text-[10px] font-bold text-slate-450 block">Questions Asked</label>
                          <input
                            type="text"
                            value={interviewQuestions}
                            onChange={e => setInterviewQuestions(e.target.value)}
                            placeholder="e.g. Reverse a linked list, react hooks hooks lifecycle"
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-450 block">Notes</label>
                          <input
                            type="text"
                            value={interviewNotes}
                            onChange={e => setInterviewNotes(e.target.value)}
                            placeholder="e.g. Went well, answered 4/5 questions."
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-450 block">Result</label>
                          <select
                            value={interviewResult}
                            onChange={e => setInterviewResult(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 font-bold"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Pass">Pass</option>
                            <option value="Fail">Fail</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={interviewSaveLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-2 rounded-lg shadow-sm transition-all duration-200"
                      >
                        {interviewSaveLoading ? 'Saving...' : 'Save Interview Round'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Sidebar Timeline tracker */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-slate-900">Application Timeline</h3>
                  
                  <div className="relative border-l border-slate-200 ml-3 pl-5 space-y-6 py-2">
                    {selectedApplication.tracking?.map((event, idx) => (
                      <div key={idx} className="relative">
                        <span className={`absolute -left-[27.5px] top-0.5 w-3.5 h-3.5 rounded-full border-2 ${
                          idx === selectedApplication.tracking.length - 1
                            ? 'bg-indigo-600 border-indigo-200 animate-pulse'
                            : 'bg-slate-200 border-white'
                        }`} />
                        <h4 className="text-[11px] font-bold text-slate-950 uppercase">{event.status.replace(/_/g, ' ')}</h4>
                        <p className="text-[10.5px] text-slate-500 mt-0.5">{event.notes}</p>
                        <span className="text-[9px] text-slate-400 mt-1 block">{new Date(event.createdAt).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* 5. ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Applications Sent', value: totalApplications, icon: '🚀', color: 'from-blue-500 to-indigo-600' },
              { label: 'Emails Opened', value: totalOpened, icon: '👁', color: 'from-amber-500 to-orange-600' },
              { label: 'Feedback Received', value: totalFeedback, icon: '💬', color: 'from-pink-500 to-rose-600' },
              { label: 'Interviews Scheduled', value: totalInterviews, icon: '🗓', color: 'from-purple-500 to-violet-600' },
              { label: 'Offers Received', value: totalOffers, icon: '🏆', color: 'from-emerald-500 to-teal-650' }
            ].map((card, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl">{card.icon}</span>
                  {card.label.includes('Opened') && totalApplications > 0 && (
                    <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {openRate}% Rate
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-950 block">{card.value}</span>
                  <span className="text-[10.5px] text-slate-450 font-bold uppercase tracking-wider block mt-1">{card.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900">Success Criteria</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
              Currently calculated from your active applications list. This tracks manual apply metrics. Advanced comparison charts and success predictions are part of upcoming dashboard features.
            </p>
          </div>
        </div>
      )}

      {/* 6. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <h2 className="text-base font-black text-slate-900">Preferences & Setup</h2>
            
            {settingsSaveSuccess && (
              <div className="bg-emerald-50 border border-emerald-250 text-emerald-700 rounded-2xl p-4 text-xs font-bold">
                ✓ Preferences updated successfully.
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-450 uppercase block">Default Email Signature</label>
                <textarea
                  value={settingsSignature}
                  onChange={e => setSettingsSignature(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-all duration-200 leading-relaxed font-mono resize-none text-slate-800"
                  placeholder="e.g. Best regards, Ashish"
                />
                <span className="text-[9.5px] text-slate-400 block mt-1">This text signature will automatically append to your generated AI email drafts.</span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">Resume Preferences</span>
                  <label className="flex items-center gap-2 mt-2 font-medium text-slate-650 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                    Always use active resume version
                  </label>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">Email Preferences</span>
                  <label className="flex items-center gap-2 mt-2 font-medium text-slate-650 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                    Include recruiter feedback portal link
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 text-right">
              <button
                onClick={() => {
                  setSettingsSaveSuccess(true)
                  setTimeout(() => setSettingsSaveSuccess(false), 3000)
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all duration-200"
              >
                Save Preferences
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 h-fit">
            <h3 className="text-sm font-black text-slate-900">Profile Settings</h3>
            <div className="space-y-3.5 text-xs font-medium">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Contact Email</span>
                <span className="text-slate-950 font-bold">{getUser()?.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Workspace status</span>
                <span className="text-emerald-700 font-bold uppercase">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
