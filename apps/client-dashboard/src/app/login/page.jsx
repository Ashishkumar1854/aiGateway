'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { saveAuth } from '@/lib/auth'

export default function ClientLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Blur Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-cyan-500/4 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 mb-5">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AiGateway
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm">Client Workspace Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xl shadow-slate-100">
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

          <div className="mt-6 pt-5 border-t border-slate-150">
            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              Access credentials are sent by email when your service is activated by our team.
              <br />
              <span className="text-slate-400">Contact support if you have not received your credentials.</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-400 mt-6">
          © 2025 AiGateway · AI-Powered Business Automation
        </p>
      </div>
    </div>
  )
}
