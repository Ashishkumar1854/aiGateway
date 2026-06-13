'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PageHeader } from '@/components/shared/PageHeader'

export default function OnboardingRequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id

  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [successData, setSuccessData] = useState(null) // activation credentials
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get(`/api/v1/onboarding/${id}`)
      setRequest(res.data)
    } catch (err) {
      setError(err.message || 'Failed to load onboarding request')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) load()
  }, [id])

  const handleActivate = async () => {
    setActionLoading(true)
    setError('')
    try {
      const res = await api.post(`/api/v1/onboarding/${id}/activate`)
      setSuccessData(res.data)
      load() // Reload new request status (ACTIVATED)
    } catch (err) {
      setError(err.message || 'Failed to activate service')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    setError('')
    try {
      await api.post(`/api/v1/onboarding/${id}/reject`, { reason: rejectReason })
      setShowRejectForm(false)
      load() // Reload new request status (REJECTED)
    } catch (err) {
      setError(err.message || 'Failed to reject request')
    } finally {
      setActionLoading(false)
    }
  }

  const handleConvert = async () => {
    setActionLoading(true)
    setError('')
    try {
      await api.post(`/api/v1/onboarding/${id}/convert`)
      load() // Reload new request status (CONVERTED)
    } catch (err) {
      setError(err.message || 'Failed to convert trial')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <div className="p-8"><LoadingSpinner /></div>

  if (error && !request) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
        <button onClick={() => router.push('/onboarding')} className="mt-4 text-xs font-bold text-slate-900 underline">
          ← Back to Requests
        </button>
      </div>
    )
  }

  const requirementsList = request.requirements
    ? Object.entries(request.requirements).filter(([_, val]) => val)
    : []

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/onboarding')}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          ← Back to Onboarding Requests
        </button>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
            request.requestType === 'TRIAL' ? 'bg-emerald-50 text-emerald-700 border border-emerald-250' : 'bg-indigo-50 text-indigo-700 border border-indigo-250'
          }`}>
            {request.requestType} REQUEST
          </span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
            request.status === 'ACTIVATED' ? 'bg-emerald-100 text-emerald-800' :
            request.status === 'CONVERTED' ? 'bg-indigo-100 text-indigo-800' :
            request.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
            request.status === 'EXPIRED' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-700'
          }`}>
            STATUS: {request.status}
          </span>
        </div>
      </div>

      <PageHeader
        title={request.companyName}
        subtitle={`Submitted by ${request.name} on ${new Date(request.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}`}
      />

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Activation Success Modal/Banner */}
      {successData && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <span>🎉</span>
            <h3>Service Activated Successfully!</h3>
          </div>
          <p className="text-xs text-emerald-700">
            Share these login details with the client so they can access their dashboard portal.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/70 backdrop-blur border border-emerald-100 p-4 rounded-lg font-mono text-xs">
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Login URL</span>
              <a href={successData.loginUrl} target="_blank" rel="noreferrer" className="text-indigo-650 underline break-all font-bold">
                {successData.loginUrl}
              </a>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Client Username</span>
              <span className="text-slate-800 font-bold break-all">{request.email}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Temporary Password</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-bold select-all">
                {successData.tempPassword}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Specs & message */}
        <div className="lg:col-span-2 space-y-6">
          {/* User/Company Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-400">Contact Name</p>
                <p className="font-semibold text-slate-900 mt-0.5">{request.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Email Address</p>
                <p className="font-semibold text-slate-900 mt-0.5">
                  <a href={`mailto:${request.email}`} className="text-indigo-650 hover:underline">{request.email}</a>
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Phone Number</p>
                <p className="font-semibold text-slate-900 mt-0.5">{request.phone || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Industry</p>
                <p className="font-semibold text-slate-900 mt-0.5">{request.industry || '—'}</p>
              </div>
            </div>

            {request.message && (
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400">Additional Message</p>
                <p className="text-slate-700 mt-1.5 leading-relaxed text-sm whitespace-pre-wrap">{request.message}</p>
              </div>
            )}
          </div>

          {/* Service Requirements Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Service & Setup Configuration</h3>
            <div className="flex items-center gap-3 py-2 px-3 bg-slate-50 rounded-lg border border-slate-150">
              <span className="text-xl">🤖</span>
              <div>
                <p className="text-xs text-slate-400">Requested Bot Niche</p>
                <p className="text-sm font-bold text-slate-900">{request.serviceName}</p>
              </div>
            </div>

            {requirementsList.length > 0 ? (
              <div className="space-y-4 pt-2">
                {requirementsList.map(([key, val]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-slate-800 text-xs whitespace-pre-wrap leading-relaxed">
                      {String(val)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No custom setup specifications provided. Service will be deployed with default parameters.</p>
            )}
          </div>
        </div>

        {/* Right Column: Flow Controls */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Action Panel</h3>

            {request.status === 'PENDING' && (
              <div className="space-y-3">
                <button
                  onClick={handleActivate}
                  disabled={actionLoading}
                  className="w-full rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-2.5 text-xs transition-colors shadow-sm"
                >
                  {actionLoading ? 'Activating...' : `Activate ${request.requestType === 'TRIAL' ? '🎁 Trial Node' : '🚀 Paid Node'}`}
                </button>

                {!showRejectForm ? (
                  <button
                    onClick={() => setShowRejectForm(true)}
                    disabled={actionLoading}
                    className="w-full rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold py-2.5 text-xs transition-colors"
                  >
                    Reject/Decline Request
                  </button>
                ) : (
                  <form onSubmit={handleReject} className="space-y-3 pt-3 border-t border-slate-100">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Reason for Rejection</label>
                      <input
                        type="text"
                        placeholder="e.g. SPAM, out of service region"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full rounded-lg border border-slate-350 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowRejectForm(false)}
                        className="flex-1 rounded-lg border border-slate-200 text-slate-500 py-1.5 text-xs font-semibold hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="flex-1 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white py-1.5 text-xs font-semibold transition-colors"
                      >
                        Confirm Decline
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {request.status === 'ACTIVATED' && request.requestType === 'TRIAL' && (
              <div className="space-y-3">
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 leading-relaxed">
                  Trial node is active. Expires on:{' '}
                  <strong>{new Date(request.expiresAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</strong>
                </div>

                <button
                  onClick={handleConvert}
                  disabled={actionLoading}
                  className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-2.5 text-xs transition-colors shadow-sm"
                >
                  {actionLoading ? 'Converting...' : 'Convert Trial to Paid'}
                </button>
              </div>
            )}

            {request.status === 'CONVERTED' && (
              <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-3 text-xs text-indigo-800 leading-relaxed">
                🎉 This client has been converted to a full active paid hosting plan. Expiry date has been removed.
              </div>
            )}

            {request.status === 'EXPIRED' && (
              <div className="rounded-lg bg-orange-50 border border-orange-200 p-3 text-xs text-orange-850 leading-relaxed">
                ⚠️ The free trial for this node has expired. Access on client dashboard is locked.
              </div>
            )}

            {request.status === 'REJECTED' && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-800 leading-relaxed">
                ❌ This request was rejected or declined.
              </div>
            )}

            {request.clientId && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Linked Profile</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Client Profile:</span>
                  <a href={`/clients`} className="font-bold text-indigo-650 hover:underline">
                    View Client Directory →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
