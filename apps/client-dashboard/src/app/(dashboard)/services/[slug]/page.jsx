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
  
  // Data for Lead Gen / Job Seeker workflows
  const [leads, setLeads] = useState([])
  const [outreachLogs, setOutreachLogs] = useState([])
  
  // Form submission states
  const [actionStatus, setActionStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')
  
  // Form inputs
  const [jobForm, setJobForm] = useState({
    recruiterName: '',
    recruiterEmail: '',
    companyName: '',
    jobRole: '',
    jobDescription: '',
  })
  
  const [leadForm, setLeadForm] = useState({
    keyword: '',
    location: '',
    limit: 10,
    sources: ['Google Maps'],
  })

  const [whatsappInstructions, setWhatsappInstructions] = useState('')

  useEffect(() => {
    const user = getUser()
    if (!user?.client?.id) {
      setLoading(false)
      return
    }

    Promise.all([
      api.get(`/api/v1/clients/${user.client.id}`),
      api.get(`/api/v1/clients/${user.client.id}/leads`).catch(() => ({ data: [] })),
      api.get(`/api/v1/clients/${user.client.id}/outreach-logs`).catch(() => ({ data: [] }))
    ])
      .then(([clientRes, leadsRes, outreachRes]) => {
        if (clientRes?.success && clientRes.data) {
          setClient(clientRes.data)
          // Find assignment matching this slug
          const found = clientRes.data.serviceAssignments?.find(sa => {
            const type = sa.service?.type
            const serviceSlug = getSlugForType(type)
            return serviceSlug === slug
          })
          setAssignment(found || null)
        }
        if (leadsRes?.data) setLeads(leadsRes.data)
        if (outreachRes?.data) setOutreachLogs(outreachRes.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  const getSlugForType = (type) => {
    switch (type) {
      case 'LEAD_GENERATION': return 'lead-generation'
      case 'EMAIL_AUTOMATION': return 'email-automation'
      case 'REELS_AUTOMATION': return 'reels-automation'
      case 'WHATSAPP_AUTOMATION': return 'whatsapp-automation'
      case 'LINKEDIN_OUTREACH': return 'linkedin-automation'
      case 'JOB_SEEKER': return 'job-seeker'
      default: return 'custom'
    }
  }

  const handleJobSubmit = async (e) => {
    e.preventDefault()
    setActionStatus('loading')
    setErrorMsg('')
    try {
      const res = await api.post(`/api/v1/clients/${client.id}/job-seeker/apply`, jobForm)
      if (res.success) {
        setActionStatus('success')
        setJobForm({ recruiterName: '', recruiterEmail: '', companyName: '', jobRole: '', jobDescription: '' })
        // Refresh outreach logs & leads
        const [lRes, oRes] = await Promise.all([
          api.get(`/api/v1/clients/${client.id}/leads`),
          api.get(`/api/v1/clients/${client.id}/outreach-logs`)
        ])
        if (lRes?.data) setLeads(lRes.data)
        if (oRes?.data) setOutreachLogs(oRes.data)
      } else {
        setActionStatus('error')
        setErrorMsg('Failed to apply.')
      }
    } catch (err) {
      setActionStatus('error')
      setErrorMsg(err.message || 'Something went wrong.')
    }
  }

  const handleLeadSubmit = async (e) => {
    e.preventDefault()
    setActionStatus('loading')
    setErrorMsg('')
    try {
      const res = await api.post(`/api/v1/clients/${client.id}/lead-generation/search`, leadForm)
      if (res.success) {
        setActionStatus('success')
        // Refresh leads
        const lRes = await api.get(`/api/v1/clients/${client.id}/leads`)
        if (lRes?.data) setLeads(lRes.data)
      } else {
        setActionStatus('error')
        setErrorMsg('Search failed.')
      }
    } catch (err) {
      setActionStatus('error')
      setErrorMsg(err.message || 'Something went wrong.')
    }
  }

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      // Create a task to simulate lead status change or update locally
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
    } catch (err) {
      console.error(err)
    }
  }

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
        <p className="text-xs text-slate-550">
          This AI automation service is not assigned to your active plan.
        </p>
        <Link href="/services" className="inline-block text-xs font-semibold text-indigo-650 hover:underline">
          ← View My Services
        </Link>
      </div>
    )
  }

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-3xl">
            {slug === 'job-seeker' ? '💼' :
             slug === 'lead-generation' ? '🎯' :
             slug === 'email-automation' ? '📧' :
             slug === 'whatsapp-automation' ? '💬' :
             slug === 'linkedin-automation' ? '🔗' : '🎬'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{assignment.service?.name}</h1>
            <p className="text-xs text-slate-500 mt-1">{assignment.service?.description}</p>
          </div>
        </div>
      </div>

      {/* ─── JOB SEEKER WORKSPACE ────────────────────────────────────────────── */}
      {slug === 'job-seeker' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Apply Form */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4.5 shadow-sm">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Generate Outreach & Send Application</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Customized with your resume using AI matching</p>
            </div>

            {actionStatus === 'success' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-xs text-emerald-700 flex justify-between items-center">
                <span>🎉 Application generated and email sent successfully!</span>
                <button onClick={() => setActionStatus('idle')} className="underline text-[10px]">Dismiss</button>
              </div>
            )}

            {actionStatus === 'error' && (
              <div className="bg-red-55/60 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-700">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleJobSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Recruiter Name</label>
                  <input
                    type="text"
                    required
                    value={jobForm.recruiterName}
                    onChange={e => setJobForm(prev => ({ ...prev, recruiterName: e.target.value }))}
                    placeholder="e.g. Shruti Gupta"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Recruiter Email *</label>
                  <input
                    type="email"
                    required
                    value={jobForm.recruiterEmail}
                    onChange={e => setJobForm(prev => ({ ...prev, recruiterEmail: e.target.value }))}
                    placeholder="hr@targetcompany.com"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.jobRole}
                    onChange={e => setJobForm(prev => ({ ...prev, jobRole: e.target.value }))}
                    placeholder="e.g. React Developer"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.companyName}
                    onChange={e => setJobForm(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="e.g. TechCorp"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target Job Description *</label>
                <textarea
                  required
                  rows={4}
                  value={jobForm.jobDescription}
                  onChange={e => setJobForm(prev => ({ ...prev, jobDescription: e.target.value }))}
                  placeholder="Paste the target job description here. The AI will cross-reference with your resume link to generate personalized ATS-tailored pitches."
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={actionStatus === 'loading'}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 text-xs transition-all disabled:opacity-50 shadow-md shadow-indigo-600/10"
              >
                {actionStatus === 'loading' ? 'Matching ATS & Sending Email...' : '⚡ Generate ATS Outreach & Apply'}
              </button>
            </form>
          </div>

          {/* Resume / Parameters Info */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate Configuration</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Target Locations</span>
                <p className="text-xs text-slate-850">{assignment.config?.target_locations || 'Bangalore, Remote'}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Experience Level</span>
                <p className="text-xs text-slate-850">{assignment.config?.experience_level || 'Junior (1-3yr)'}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Resume Document</span>
                <a
                  href={assignment.config?.resume_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-650 hover:underline truncate block"
                >
                  🔗 View Resume Link
                </a>
              </div>
            </div>
          </div>

          {/* Applications outreach log */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Sent Job Applications & Outreach Logs</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    <th className="pb-3">Role / Company</th>
                    <th className="pb-3">Recruiter Email</th>
                    <th className="pb-3">Date Applied</th>
                    <th className="pb-3">ATS Status</th>
                    <th className="pb-3 text-right">Track Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {outreachLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 font-light">No outreach applications logged yet.</td>
                    </tr>
                  ) : (
                    outreachLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-3 font-semibold text-slate-900">
                          {log.lead?.companyName}
                        </td>
                        <td className="py-3 text-slate-500">{log.lead?.email}</td>
                        <td className="py-3 text-slate-400">
                          {new Date(log.sentAt || log.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3">
                          <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 text-right text-slate-400 flex items-center justify-end gap-1.5">
                          <span className="text-emerald-600">👁️</span> Opened (1)
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── LEAD GENERATION WORKSPACE ───────────────────────────────────────── */}
      {slug === 'lead-generation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Trigger Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4.5 shadow-sm">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Trigger Lead Finder</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Scrapes Google Maps, LinkedIn & directories</p>
            </div>

            {actionStatus === 'success' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-xs text-emerald-700">
                🎉 Scraper completed! Mock leads populated.
              </div>
            )}

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Search Keyword</label>
                <input
                  type="text"
                  required
                  value={leadForm.keyword}
                  onChange={e => setLeadForm(prev => ({ ...prev, keyword: e.target.value }))}
                  placeholder="e.g. Gyms, Dentists, Real Estate"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target Location</label>
                <input
                  type="text"
                  required
                  value={leadForm.location}
                  onChange={e => setLeadForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g. Mumbai, New York"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Max Lead Limit</label>
                <select
                  value={leadForm.limit}
                  onChange={e => setLeadForm(prev => ({ ...prev, limit: parseInt(e.target.value) }))}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value={5}>5 Leads</option>
                  <option value={10}>10 Leads</option>
                  <option value={20}>20 Leads</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={actionStatus === 'loading'}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 text-xs transition-colors"
              >
                {actionStatus === 'loading' ? 'Searching...' : 'Search Leads'}
              </button>
            </form>
          </div>

          {/* Scraped Leads List */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Scraped Prospects Pipeline</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    <th className="pb-3">Company</th>
                    <th className="pb-3">Contact Name</th>
                    <th className="pb-3">Email / Phone</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 font-light">No prospects found. Run a scraper search above to start generating leads.</td>
                    </tr>
                  ) : (
                    leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-slate-50">
                        <td className="py-3 font-semibold text-slate-900">{lead.companyName}</td>
                        <td className="py-3 text-slate-500">{lead.contactName || 'N/A'}</td>
                        <td className="py-3 text-slate-550">
                          <div>{lead.email || 'N/A'}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{lead.phone || ''}</div>
                        </td>
                        <td className="py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                            lead.status === 'WON' ? 'bg-green-50 border border-green-200 text-green-700' :
                            lead.status === 'LOST' ? 'bg-red-55 border border-red-200 text-red-700' :
                            'bg-indigo-50 border border-indigo-200 text-indigo-700'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-1.5">
                          {lead.status === 'COLD' && (
                            <>
                              <button onClick={() => updateLeadStatus(lead.id, 'WON')} className="text-[10px] bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 px-2 py-1 rounded-lg">
                                Won Deal
                              </button>
                              <button onClick={() => updateLeadStatus(lead.id, 'LOST')} className="text-[10px] bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-2 py-1 rounded-lg">
                                Lost
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── EMAIL AUTOMATION WORKSPACE ──────────────────────────────────────── */}
      {slug === 'email-automation' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Emails Sent</span>
              <p className="text-xl font-extrabold text-slate-900">450 / Month</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Delivered</span>
              <p className="text-xl font-extrabold text-emerald-600">99.2%</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Open Rate</span>
              <p className="text-xl font-extrabold text-indigo-650">64.5%</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Meetings Booked</span>
              <p className="text-xl font-extrabold text-slate-900">12</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Outreach Templates</h3>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
                <p className="text-xs font-bold text-slate-900">Sequence A: Cold Pitch</p>
                <p className="text-xs text-slate-605 mt-2 italic leading-relaxed">
                  "Hi [Name], we help business automate sales. Can we connect for a brief 10-minute demo on Tuesday?"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── WHATSAPP AUTOMATION WORKSPACE ───────────────────────────────────── */}
      {slug === 'whatsapp-automation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">AI Assistant Response Config</h3>
            <div>
              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider mb-1.5">Business Tone & FAQs</label>
              <textarea
                value={whatsappInstructions}
                onChange={e => setWhatsappInstructions(e.target.value)}
                placeholder="Instruct the AI: e.g. You are a friendly coordinator. Answers about prices should say 'prices start from ₹1000'."
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-40 focus:bg-white"
              />
            </div>
            <button className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 text-xs transition-all shadow-md shadow-indigo-600/10">
              Save AI Instructions
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Number details</h3>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
              <div className="text-[9px] text-slate-400 font-bold uppercase">WhatsApp Business Number</div>
              <p className="text-slate-800 font-semibold">{assignment.config?.whatsapp_number || '+91 98765 43210'}</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── LINKEDIN OUTREACH WORKSPACE ─────────────────────────────────────── */}
      {slug === 'linkedin-automation' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-900">LinkedIn Connection Settings</h3>
            <p className="text-[11px] text-slate-500">Managing connection limits and sequences</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Target Job Titles</span>
              <p className="text-slate-900 font-semibold">{assignment.config?.target_title || 'HR Manager, Founder, CTO'}</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Target Industry</span>
              <p className="text-slate-900 font-semibold">{assignment.config?.target_industry || 'SaaS, Tech'}</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── REELS AUTOMATION WORKSPACE ──────────────────────────────────────── */}
      {slug === 'reels-automation' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Reels Content calendar</h3>
            <p className="text-[11px] text-slate-550">Automatically generating content niche scheduling</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-550 font-semibold">Instagram Handle</span>
              <span className="text-slate-900 font-bold">{assignment.config?.instagram_handle || '@brand_niche'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-550 font-semibold">Content Niche</span>
              <span className="text-slate-900 font-bold">{assignment.config?.content_niche || 'Fitness Motivation'}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
