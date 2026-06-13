'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function ClientBillingPage() {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCheckout, setShowCheckout] = useState(null) // plan key if showing checkout
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242')
  const [cardExpiry, setCardExpiry] = useState('12/28')
  const [cardCvc, setCardCvc] = useState('123')

  const loadSubscription = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/v1/onboarding/my-services')
      if (res.success && res.data) {
        setSubscription(res.data.subscription)
      }
    } catch (err) {
      console.error('[Billing] Failed to load subscription:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubscription()
  }, [])

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    )
  }

  // Generate mock invoices
  const generateMockInvoices = () => {
    if (!subscription) return []
    const invoices = []
    const amount = subscription.plan === 'STARTER' ? '₹9,999' : subscription.plan === 'PRO' ? '₹24,999' : 'Custom'
    const expiresAt = subscription.expiresAt ? new Date(subscription.expiresAt) : new Date()

    if (subscription.status === 'ACTIVE') {
      invoices.push({
        id: `INV-${expiresAt.getFullYear()}-${String(expiresAt.getMonth() + 1).padStart(2, '0')}-01`,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { dateStyle: 'medium' }),
        amount: amount,
        status: 'PAID',
        method: 'Credit Card (Stripe)'
      })
    } else if (subscription.status === 'TRIAL') {
      invoices.push({
        id: `INV-TRIAL-${expiresAt.getFullYear()}-01`,
        date: new Date(expiresAt.getTime() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { dateStyle: 'medium' }),
        amount: '₹0',
        status: 'TRIAL ACTIVE',
        method: 'Free Trial Deployment'
      })
    }
    return invoices
  }

  const invoices = generateMockInvoices()

  const PLAN_DETAILS = {
    STARTER: {
      name: 'Starter Plan',
      price: '₹9,999',
      period: '/month',
      limits: '2 active services · 500 leads/month · email outreach'
    },
    PRO: {
      name: 'Pro Plan',
      price: '₹24,999',
      period: '/month',
      limits: '5 active services · 2,000 leads/month · multi-agent workflows'
    },
    ENTERPRISE: {
      name: 'Enterprise Plan',
      price: 'Custom Pricing',
      period: '',
      limits: 'Unlimited services · custom Python integrations'
    }
  }

  const handleSimulatePayment = (e) => {
    e.preventDefault()
    setPaymentSuccess(true)
    setShowCheckout(null)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 relative">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Billing & Subscriptions</h1>
        <p className="text-xs text-slate-400 mt-1">Manage pricing plans, billing methods, and simulate mock invoice payouts.</p>
      </div>

      {paymentSuccess && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <span>🎉</span>
            <h3>Mock Payment Checkout Completed!</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your upgrade request has been registered in simulation mode. In a production build, your trial will be converted automatically using Stripe checkout. 
            <br />
            <strong className="text-white">Please head to the Admin Dashboard (Client Onboarding section) and click "Convert Trial to Paid" to finalize this upgrade.</strong>
          </p>
        </div>
      )}

      {/* Main Billing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active plan or Trial Status */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 lg:col-span-2 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                subscription?.status === 'ACTIVE'
                  ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                  : subscription?.status === 'TRIAL'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                {subscription?.status === 'ACTIVE' ? 'Active Subscription' : subscription?.status === 'TRIAL' ? 'Trial Subscription' : 'Trial Expired'}
              </span>
              {subscription?.status !== 'ACTIVE' && (
                <span className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  Upgrade Required
                </span>
              )}
            </div>
            
            <div className="mt-4 flex items-baseline gap-2">
              <h2 className="text-3xl font-extrabold text-white">
                {subscription?.plan || 'Starter'} Plan {subscription?.status === 'TRIAL' && '(Trial)'} {subscription?.status === 'EXPIRED' && '(Expired)'}
              </h2>
              <span className="text-sm text-slate-400">
                {subscription ? PLAN_DETAILS[subscription.plan]?.price : '₹9,999'}/mo
              </span>
            </div>
            
            <p className="text-xs text-slate-400 mt-2">
              Limits: {subscription ? PLAN_DETAILS[subscription.plan]?.limits : PLAN_DETAILS.STARTER.limits}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/60">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Status</p>
              <p className={`text-sm font-extrabold mt-1 uppercase ${
                subscription?.status === 'ACTIVE' ? 'text-indigo-400' :
                subscription?.status === 'TRIAL' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {subscription?.status || 'INACTIVE'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">
                {subscription?.status === 'TRIAL' ? 'TRIAL ENDS AT' : 'RENEWAL DATE'}
              </p>
              <p className="text-sm font-semibold text-white mt-1">
                {subscription?.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString() : 'No Expiry'}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Profile Details */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Payment Method</h3>
          <div className="rounded-xl bg-slate-950/40 border border-slate-800/80 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💳</span>
              <div>
                <p className="text-xs font-semibold text-white">Visa ending in 4242</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Expires 12/28</p>
              </div>
            </div>
            <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700/60 font-semibold uppercase">Primary</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Your card details will be billed automatically once upgraded to a permanent hosting node.
          </p>
        </div>
      </div>

      {/* Plan Selection Grid for Trials/Expired Users */}
      {subscription?.status !== 'ACTIVE' && (
        <div className="space-y-6 pt-4">
          <div>
            <h3 className="text-lg font-bold text-white">Available Hosting Plans</h3>
            <p className="text-xs text-slate-400 mt-1">Select a plan to convert your trial instance into permanent live agent hosting.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Starter Plan card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all duration-300">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">Starter Plan</h4>
                <p className="text-2xl font-black text-white">₹9,999<span className="text-xs text-slate-400 font-normal">/mo</span></p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Best for small businesses getting started with automated AI worker processes.
                </p>
                <ul className="space-y-1.5 pt-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">✓ 2 active services</li>
                  <li className="flex items-center gap-2">✓ 500 leads research/mo</li>
                  <li className="flex items-center gap-2">✓ Dynamic email Outreach</li>
                  <li className="flex items-center gap-2">✓ Client Dashboard Access</li>
                </ul>
              </div>
              <button
                onClick={() => setShowCheckout('STARTER')}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors mt-4"
              >
                Upgrade to Starter
              </button>
            </div>

            {/* Pro Plan card */}
            <div className="rounded-2xl border border-indigo-500/25 bg-indigo-950/10 p-6 space-y-4 flex flex-col justify-between hover:border-indigo-500/40 transition-all duration-300 relative">
              <span className="absolute -top-3 right-4 bg-indigo-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                Recommended
              </span>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">Pro Plan</h4>
                <p className="text-2xl font-black text-white">₹24,999<span className="text-xs text-slate-400 font-normal">/mo</span></p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Perfect for growing operations running multi-agent orchestrator pipelines.
                </p>
                <ul className="space-y-1.5 pt-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">✓ 5 active services</li>
                  <li className="flex items-center gap-2">✓ 2,000 leads research/mo</li>
                  <li className="flex items-center gap-2">✓ Multi-agent orchestrators</li>
                  <li className="flex items-center gap-2">✓ Priority setup & support</li>
                </ul>
              </div>
              <button
                onClick={() => setShowCheckout('PRO')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs border border-slate-850 hover:border-slate-700 transition-colors mt-4"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Table */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/20">
          <h3 className="text-sm font-bold text-white">Billing History</h3>
        </div>
        {invoices.length === 0 ? (
          <p className="text-center text-xs text-slate-500 py-8">No invoice history found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800/60 bg-slate-950/10 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="px-6 py-3.5">Invoice ID</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Method</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-850/50">
                    <td className="px-6 py-4 font-mono font-medium text-indigo-400">{inv.id}</td>
                    <td className="px-6 py-4">{inv.date}</td>
                    <td className="px-6 py-4 text-white font-bold">{inv.amount}</td>
                    <td className="px-6 py-4 text-slate-400">{inv.method}</td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-medium">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline">
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mock Checkout Modal Overlay */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Mock Checkout — {PLAN_DETAILS[showCheckout].name}</h3>
              <p className="text-xs text-slate-400 mt-1">Simulate Stripe card verification to confirm upgrade.</p>
            </div>

            <form onSubmit={handleSimulatePayment} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Total Billing Amount</label>
                <div className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm font-bold text-white">
                  {PLAN_DETAILS[showCheckout].price} / month
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Expiration</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">CVC</label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="123"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheckout(null)}
                  className="flex-1 rounded-xl border border-slate-800 hover:border-slate-700 bg-transparent py-3 text-xs font-semibold text-slate-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-indigo-650 hover:bg-indigo-500 text-white font-bold py-3 text-xs transition-colors"
                >
                  Confirm Simulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
