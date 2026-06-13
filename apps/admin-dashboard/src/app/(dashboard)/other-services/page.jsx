'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'

const STATUS_BADGES = {
  COLD: 'bg-slate-100 text-slate-700 border border-slate-250',
  WARM: 'bg-orange-100 text-orange-850 border border-orange-250',
  QUALIFIED: 'bg-blue-100 text-blue-850 border border-blue-250',
  PROPOSAL: 'bg-purple-100 text-purple-850 border border-purple-250',
  NEGOTIATION: 'bg-yellow-100 text-yellow-850 border border-yellow-250',
  WON: 'bg-green-100 text-green-850 border border-green-250',
  LOST: 'bg-red-100 text-red-850 border border-red-250',
}

function parseNotes(notesStr) {
  try {
    if (!notesStr) return { projectName: 'Bespoke Automation', requirements: 'No requirements description.', budget: 'Not Specified' }
    return JSON.parse(notesStr)
  } catch (e) {
    return {
      projectName: 'Bespoke Request',
      requirements: notesStr,
      budget: 'Not Specified',
    }
  }
}

export default function CustomRequestsPage() {
  const [requests, setRequests] = useState([])
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest') // newest | budget | score

  const load = async (page = 1) => {
    setLoading(true)
    try {
      // Fetch specifically with source=other_services
      const res = await api.get(`/api/v1/crm/leads?page=${page}&limit=50&source=other_services&search=${search}`)
      
      let items = res.data.map(lead => {
        const parsed = parseNotes(lead.notes)
        return {
          ...lead,
          projectName: parsed.projectName || 'Bespoke Automation Request',
          requirements: parsed.requirements || 'No specifications provided.',
          budget: parsed.budget || 'Not Specified',
        }
      })

      // Client-side sorting
      if (sortBy === 'newest') {
        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      } else if (sortBy === 'score') {
        items.sort((a, b) => b.score - a.score)
      } else if (sortBy === 'budget') {
        const getBudgetValue = (bStr) => {
          if (!bStr) return 0
          if (bStr.includes('2,00,000+')) return 200000
          if (bStr.includes('75,000')) return 75000
          if (bStr.includes('30,000')) return 30000
          if (bStr.includes('15,000')) return 15000
          return 0
        }
        items.sort((a, b) => getBudgetValue(b.budget) - getBudgetValue(a.budget))
      }

      setRequests(items)
      setMeta(res.meta)
    } catch (err) {
      console.error('Failed to load custom requests:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [search, sortBy])

  return (
    <div className="p-6">
      <PageHeader
        title="Custom Project Requests"
        subtitle={`${meta.total} bespoke freelancer / IT automation scopes submitted`}
      />

      {/* Filters & Sorting */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search requests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        />

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white cursor-pointer"
          >
            <option value="newest">Submission Date</option>
            <option value="budget">Estimated Budget</option>
            <option value="score">Lead Score</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : requests.length === 0 ? (
        <EmptyState
          title="No custom requests found"
          description="Submit a scope via the public website (/other-services) to populate this dashboard list."
          icon="⚙️"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    {req.companyName}
                  </span>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_BADGES[req.status] || 'bg-slate-100 text-slate-600'}`}>
                    {req.status}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 line-clamp-1 mb-2">
                  {req.projectName}
                </h3>
                
                <p className="text-xs text-slate-600 line-clamp-3 mb-4 min-h-[48px] leading-relaxed">
                  {req.requirements}
                </p>

                <div className="space-y-2 border-t border-slate-100 pt-3 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Contact:</span>
                    <span className="font-medium text-slate-800">{req.contactName || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Email:</span>
                    <a href={`mailto:${req.email}`} className="text-indigo-650 hover:underline">{req.email}</a>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Budget Range:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {req.budget}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Score</span>
                  <span className={`text-xs font-black ${req.score >= 80 ? 'text-green-600' : req.score >= 50 ? 'text-orange-500' : 'text-slate-500'}`}>
                    {req.score}/100
                  </span>
                </div>
                <a
                  href={`/crm/leads/${req.id}`}
                  className="rounded-lg bg-slate-900 hover:bg-slate-800 px-3.5 py-2 text-xs font-bold text-white transition-colors"
                >
                  Manage Lead →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
