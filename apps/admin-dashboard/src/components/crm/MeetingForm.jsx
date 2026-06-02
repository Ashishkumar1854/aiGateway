'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

export function MeetingForm({ leadId, onSuccess, onCancel }) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(10, 0, 0, 0)

  const [form, setForm] = useState({
    title: 'Discovery Call',
    description: '',
    scheduledAt: tomorrow.toISOString().slice(0, 16),
    duration: 30,
    meetingUrl: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/v1/crm/meetings', {
        ...form,
        leadId,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        duration: parseInt(form.duration),
      })
      onSuccess()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Meeting Title *</label>
        <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
          required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Date & Time *</label>
          <input type="datetime-local" value={form.scheduledAt}
            onChange={e => setForm({...form, scheduledAt: e.target.value})}
            required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Duration (min)</label>
          <select value={form.duration} onChange={e => setForm({...form, duration: e.target.value})}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={45}>45 min</option>
            <option value={60}>60 min</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Meeting Link (optional)</label>
        <input value={form.meetingUrl} onChange={e => setForm({...form, meetingUrl: e.target.value})}
          placeholder="https://meet.google.com/..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
        <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
          rows={2} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none" />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">
          {loading ? 'Scheduling...' : 'Schedule Meeting'}
        </button>
      </div>
    </form>
  )
}
