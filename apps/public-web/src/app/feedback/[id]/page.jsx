'use client'

import { useState, useEffect } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

const feedbackOptions = [
  { value: 'SKILLS_MISMATCH', label: "Skills Don't Match", icon: '🎯', description: 'The candidate\'s technical skills do not align with our requirements.' },
  { value: 'EXPERIENCE_MISMATCH', label: "Experience Doesn't Match", icon: '📊', description: 'The candidate lacks the required level of professional experience.' },
  { value: 'LOCATION_MISMATCH', label: 'Location Mismatch', icon: '📍', description: 'The candidate\'s location or availability doesn\'t match our needs.' },
  { value: 'POSITION_FILLED', label: 'Position Already Filled', icon: '✅', description: 'This role has already been filled by another candidate.' },
  { value: 'HIRING_CLOSED', label: 'Hiring Closed', icon: '🔒', description: 'We are no longer accepting applications for this position.' },
  { value: 'RESUME_IMPROVEMENT', label: 'Resume Needs Improvement', icon: '📝', description: 'The resume could be improved in structure, content, or formatting.' },
  { value: 'OTHER', label: 'Other Reason', icon: '💬', description: 'A different reason not listed above.' },
]

export default function RecruiterFeedbackPage({ params }) {
  const applicationId = params?.id || ''

  const [selectedType, setSelectedType] = useState('')
  const [feedbackText, setFeedbackText] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [applicationInfo, setApplicationInfo] = useState(null)

  // Fetch minimal application info for context (optional — won't block submission)
  useEffect(() => {
    if (!applicationId) return
    // Read query parameters to preselect feedback type if present
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const type = searchParams.get('type')
      if (type && feedbackOptions.some(opt => opt.value === type)) {
        setSelectedType(type)
      }
    }
  }, [applicationId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedType) {
      setError('Please select a feedback reason before submitting.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${BASE_URL}/api/v1/smart-apply/applications/${applicationId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbackType: selectedType,
          feedbackText: feedbackText.trim() || undefined,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSubmitted(true)
      } else {
        setError(data.error?.message || 'Failed to submit feedback. The application may no longer exist.')
      }
    } catch (err) {
      setError('Network error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (!applicationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10 text-center max-w-md">
          <span className="text-5xl block mb-4">⚠️</span>
          <h1 className="text-xl font-black text-slate-900">Invalid Feedback Link</h1>
          <p className="text-sm text-slate-500 mt-2">This feedback link appears to be invalid or expired.</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-200 p-10 text-center max-w-lg w-full space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Thank You for Your Feedback</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Your response has been recorded and shared with the candidate. 
            This helps them improve their future applications and professional growth.
          </p>
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Powered by <span className="font-bold text-slate-600">AiGateway</span> — AI-Powered Career Automation
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <span className="text-2xl">💼</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Recruiter Feedback Portal</h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Thank you for reviewing this application. Your feedback is valuable and will be shared with the candidate to help them improve.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Feedback Type Selection */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Select Feedback Reason</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {feedbackOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => { setSelectedType(option.value); setError('') }}
                  className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 group ${
                    selectedType === option.value
                      ? 'border-indigo-500 bg-indigo-50/50 shadow-md shadow-indigo-100'
                      : 'border-slate-150 bg-slate-50/30 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">{option.icon}</span>
                    <div>
                      <span className={`text-xs font-bold block ${
                        selectedType === option.value ? 'text-indigo-700' : 'text-slate-800'
                      }`}>
                        {option.label}
                      </span>
                      <span className="text-[10.5px] text-slate-450 mt-0.5 block leading-relaxed">
                        {option.description}
                      </span>
                    </div>
                  </div>
                  
                  {/* Selected indicator */}
                  {selectedType === option.value && (
                    <div className="mt-2 flex justify-end">
                      <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Selected</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Text Feedback */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-3">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Additional Comments <span className="text-slate-400 font-medium normal-case text-xs">(Optional)</span></h2>
            <textarea
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              rows={4}
              placeholder='e.g. "You need stronger backend experience." or "Great profile, but we already filled the position."'
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all duration-200 leading-relaxed resize-none text-slate-800 placeholder:text-slate-350"
            />
            <p className="text-[10.5px] text-slate-400 leading-relaxed">
              Your text feedback helps candidates understand specific areas for improvement. This is optional but greatly appreciated.
            </p>
          </div>

          {/* Error display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-xs font-bold">
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || !selectedType}
              className={`px-8 py-3.5 rounded-2xl text-sm font-black shadow-lg transition-all duration-200 ${
                loading || !selectedType
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </div>

          {/* Privacy note */}
          <p className="text-center text-[10px] text-slate-400">
            Your feedback is anonymous and will only be visible to the applicant. We do not store any personal information about you.
          </p>
        </form>
      </div>
    </div>
  )
}
