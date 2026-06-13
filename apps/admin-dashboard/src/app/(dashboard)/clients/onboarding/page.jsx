'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import Link from 'next/link'

export default function OnboardingRequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('PENDING') // PENDING | ACTIVATED | REJECTED

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/api/v1/onboarding?status=${statusFilter}`)
      setRequests(res.data || [])
    } catch (err) {
      console.error('Failed to load onboarding requests:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [statusFilter])

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Client Onboarding Requests"
        subtitle="Manage product trial deployments and paid service activation requests"
      />

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {['PENDING', 'ACTIVATED', 'REJECTED'].map((tabKey) => {
          const isActive = statusFilter === tabKey
          const label = tabKey === 'PENDING' ? '📥 Pending Approval' :
                        tabKey === 'ACTIVATED' ? '🚀 Activated/Live' : '❌ Rejected'
          return (
            <button
              key={tabKey}
              onClick={() => setStatusFilter(tabKey)}
              className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
                isActive
                  ? 'border-slate-900 text-slate-900 border-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : requests.length === 0 ? (
        <EmptyState
          title={`No ${statusFilter.toLowerCase()} requests`}
          description="Requests submitted from the public website onboarding forms will appear here."
          icon="📥"
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-500">Company</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Contact</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Requested Service</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Type</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Submitted At</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {req.companyName}
                    {req.industry && <span className="block text-[10px] text-slate-400 font-normal">{req.industry}</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {req.name}
                    <span className="block text-[10px] text-slate-400">{req.email}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{req.serviceName}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-bold ${
                      req.requestType === 'TRIAL'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    }`}>
                      {req.requestType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(req.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      req.status === 'ACTIVATED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-250' :
                      req.status === 'CONVERTED' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                      req.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      req.status === 'EXPIRED' ? 'bg-orange-100 text-orange-850' : 'bg-slate-100 text-slate-650'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/clients/onboarding/${req.id}`}
                      className="text-xs font-bold text-slate-900 hover:text-indigo-650 hover:underline"
                    >
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
