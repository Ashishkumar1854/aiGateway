'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

const CHANNELS = ['email', 'whatsapp', 'linkedin', 'instagram', 'phone', 'meeting']

export function ConversationForm({ leadId, onSuccess, onCancel }) {
  const [form, setForm] = useState({ channel: 'email', direction: 'outbound', content: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/v1/crm/conversations', { ...form, leadId })
      onSuccess()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-600 mb-1">Channel</label>
          <select value={form.channel} onChange={e => setForm({...form, channel: e.target.value})}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
            {CHANNELS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-600 mb-1">Direction</label>
          <select value={form.direction} onChange={e => setForm({...form, direction: e.target.value})}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
            <option value="outbound">Outbound (we sent)</option>
            <option value="inbound">Inbound (they sent)</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Message / Notes *</label>
        <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})}
          required rows={4} placeholder="What was communicated..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none" />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">
          {loading ? 'Saving...' : 'Add Conversation'}
        </button>
      </div>
    </form>
  )
}
