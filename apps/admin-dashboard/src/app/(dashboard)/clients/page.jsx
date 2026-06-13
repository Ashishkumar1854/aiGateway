'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = async (page = 1) => {
    setLoading(true)
    try {
      const res = await api.get(`/api/v1/clients?page=${page}&limit=10&search=${search}`)
      setClients(res.data)
      setMeta(res.meta)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [search])

  const statusColor = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-slate-100 text-slate-500',
    suspended: 'bg-red-100 text-red-700',
  }

  return (
    <div className="p-6">
      <PageHeader title="Clients" subtitle={`${meta.total} total clients`} />
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>
      {loading ? <LoadingSpinner /> : clients.length === 0 ? (
        <EmptyState title="No clients found" description="Add your first client to get started" icon="🏢" />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-500">Company</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Contact</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Industry</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Plan / Hosting</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => {
                const sub = client.subscriptions?.[0]
                return (
                  <tr key={client.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{client.companyName}</td>
                    <td className="px-4 py-3 text-slate-500">{client.user?.name}<br /><span className="text-xs">{client.user?.email}</span></td>
                    <td className="px-4 py-3 text-slate-500">{client.industry || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {sub ? (
                        <div>
                          <span className="font-bold text-slate-800">{sub.plan}</span>
                          <span className={`block text-[10px] font-extrabold uppercase mt-0.5 ${
                            sub.status === 'ACTIVE' ? 'text-indigo-600' :
                            sub.status === 'TRIAL' ? 'text-emerald-600' :
                            sub.status === 'EXPIRED' ? 'text-orange-500' : 'text-slate-400'
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[client.status] || 'bg-slate-100 text-slate-500'}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <a href={`/clients/${client.id}`} className="text-xs font-medium text-slate-900 hover:underline">View →</a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}