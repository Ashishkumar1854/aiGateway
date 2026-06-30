'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { saveAuth } from '@/lib/auth'

export default function ClientLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Forgot Password flow states
  const [isForgotMode, setIsForgotMode] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState('')
  const [forgotSuccessLink, setForgotSuccessLink] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const emailParam = params.get('email')
      if (emailParam) {
        setEmail(emailParam)
        setForgotEmail(emailParam)
      }
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/api/v1/auth/login', { email, password })
      const { user, accessToken, refreshToken } = res.data

      // Guard: Only allow CLIENT users to login to this dashboard
      if (user.role !== 'CLIENT') {
        setError('Access denied. This dashboard is for clients only.')
        setLoading(false)
        return
      }

      saveAuth(accessToken, refreshToken, user)
      router.push('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!forgotEmail) {
      setForgotError('Please enter your email address.')
      return
    }

    setForgotLoading(true)
    setForgotError('')
    setForgotSuccessLink('')
    try {
      const res = await api.post('/api/v1/auth/forgot-password', { email: forgotEmail })
      if (res.success && res.data?.token) {
        const link = `http://localhost:3001/reset-password?token=${res.data.token}`
        setForgotSuccessLink(link)
      } else {
        setForgotError(res.error?.message || 'Failed to request reset password link.')
      }
    } catch (err) {
      setForgotError(err.message || 'Failed to request reset password link.')
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Blur Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 mb-5">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight text-center">
            AiGateway
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm">Client Workspace Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xl shadow-slate-100">
          
          {/* FORGOT PASSWORD MODE */}
          {isForgotMode ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Reset your password</h2>
                <p className="text-slate-500 text-xs mt-1">We will simulate sending a reset link to your email</p>
              </div>

              {forgotError && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-650 flex items-center gap-2 font-medium">
                  <span>⚠️</span>
                  {forgotError}
                </div>
              )}

              {forgotSuccessLink ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-250 p-5 text-xs text-emerald-700 font-bold space-y-3">
                  <span className="text-3xl block">✓</span>
                  <p>Password reset link simulated in console log!</p>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 text-slate-700 font-normal leading-relaxed break-all text-center">
                    <p className="font-bold text-indigo-700 mb-1 text-[10.5px]">SIMULATED LINK:</p>
                    <a href={forgotSuccessLink} className="underline text-indigo-600 hover:text-indigo-800 break-all text-[11px]">
                      {forgotSuccessLink}
                    </a>
                  </div>
                  <button
                    onClick={() => {
                      setIsForgotMode(false)
                      setForgotSuccessLink('')
                      setForgotEmail('')
                    }}
                    className="w-full text-[11px] font-bold text-indigo-700 hover:underline pt-2"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-400 focus:bg-white"
                      placeholder="client@company.com"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:-translate-y-0.5 mt-2"
                  >
                    {forgotLoading ? 'Processing...' : 'Request Reset Link →'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotMode(false)}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* NORMAL SIGN IN MODE */
            <>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900">Sign in to your workspace</h2>
                <p className="text-slate-500 text-xs mt-1">Enter your credentials sent by AiGateway admin</p>
              </div>

              {error && (
                <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-650 flex items-center gap-2">
                  <span>⚠️</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="client-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-400 focus:bg-white"
                    placeholder="client@company.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotMode(true)
                        setForgotEmail(email)
                        setForgotError('')
                        setForgotSuccessLink('')
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    id="client-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-400 focus:bg-white"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                </div>

                <button
                  id="client-login-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:-translate-y-0.5 disabled:translate-y-0 mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Authenticating...
                    </span>
                  ) : 'Sign In →'}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-150 text-center space-y-4">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Use the email and password you created during trial registration or service booking.
                </p>
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] text-slate-450 mb-2 font-medium">Don&apos;t have an account yet?</p>
                  <a
                    href="http://localhost:3000/services"
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"
                  >
                    Select Services & Register →
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-400 mt-6">
          © 2025 AiGateway · AI-Powered Business Automation
        </p>
      </div>
    </div>
  )
}
