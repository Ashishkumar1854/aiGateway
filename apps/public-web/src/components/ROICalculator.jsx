'use client'

import { useState } from 'react'

const presets = [
  { label: 'Lead Generation', cost: 15000 },
  { label: 'Email Outreach', cost: 12000 },
  { label: 'WhatsApp Marketing', cost: 10000 },
  { label: 'Social Media', cost: 20000 },
  { label: 'Full Sales Team', cost: 50000 },
]

const aiGatewayCost = 999

export function ROICalculator() {
  const [manualCost, setManualCost] = useState(15000)
  const savings = manualCost - aiGatewayCost

  return (
    <section className="py-24 bg-white border-b border-slate-100" id="roi">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            ROI Calculator
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-5 sm:text-5xl tracking-tight">Calculate your savings</h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            See how much you save by switching from manual operations to AiGateway automation.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl shadow-slate-100/80">
          {/* Preset Quick Select */}
          <div className="mb-8">
            <p className="text-xs text-slate-500 font-medium mb-3">Quick select a category:</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setManualCost(p.cost)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border ${
                    manualCost === p.cost
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Slider */}
          <div className="mb-10">
            <label className="flex items-center justify-between text-xs text-slate-500 mb-3">
              <span>Your current monthly cost</span>
              <span className="text-slate-900 font-black text-lg">₹{manualCost.toLocaleString('en-IN')}/mo</span>
            </label>
            <input
              type="range"
              min={5000}
              max={100000}
              step={1000}
              value={manualCost}
              onChange={(e) => setManualCost(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-slate-200 cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
              <span>₹5,000</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-center">
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mb-2">Manual Cost</p>
              <p className="text-2xl font-black text-red-500">₹{manualCost.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-slate-400 mt-1">per month</p>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5 text-center">
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mb-2">AiGateway</p>
              <p className="text-2xl font-black text-indigo-600">₹{aiGatewayCost.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-slate-400 mt-1">per month</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5 text-center">
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-2">You Save</p>
              <p className="text-2xl font-black text-emerald-600">₹{savings.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-slate-400 mt-1">per month</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              That&apos;s{' '}
              <span className="text-emerald-600 font-bold">{((savings / manualCost) * 100).toFixed(0)}% savings</span>{' '}
              every month —{' '}
              <span className="text-slate-800 font-semibold">₹{(savings * 12).toLocaleString('en-IN')}/year</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
