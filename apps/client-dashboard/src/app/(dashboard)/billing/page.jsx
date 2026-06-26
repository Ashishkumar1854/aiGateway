'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

const PLAN_DETAILS = {
  STARTER: {
    name: 'Starter',
    inr: '₹9,999',
    usd: '$119',
    period: '/month',
    description: 'Best for small businesses getting started with AI automation.',
    limits: [
      '2 active services',
      '500 leads research/month',
      'Dynamic email outreach',
      'Client dashboard access',
      'Standard support',
    ],
    color: 'slate',
  },
  PRO: {
    name: 'Pro',
    inr: '₹24,999',
    usd: '$299',
    period: '/month',
    description: 'Perfect for growing operations running multi-agent workflows.',
    limits: [
      '5 active services',
      '2,000 leads research/month',
      'Multi-agent orchestrators',
      'Priority setup & support',
      'Custom workflow design',
    ],
    color: 'indigo',
    recommended: true,
  },
  ENTERPRISE: {
    name: 'Enterprise',
    inr: 'Custom',
    usd: 'Custom',
    period: '',
    description: 'Dedicated infrastructure, custom Python integrations, and white-glove setup.',
    limits: [
      'Unlimited active services',
      'Unlimited leads research',
      'Custom integrations & APIs',
      'Dedicated account manager',
      'Custom SLA & contracts',
    ],
    color: 'purple',
  },
}

function PlanCard({ planKey, details, currentPlan, currentStatus, onUpgrade }) {
  const isCurrentPlan = currentPlan === planKey
  const isEnterprise = planKey === 'ENTERPRISE'
  const isUpgrade =
    (currentPlan === 'STARTER' && planKey === 'PRO') ||
    (currentPlan === 'STARTER' && planKey === 'ENTERPRISE') ||
    (currentPlan === 'PRO' && planKey === 'ENTERPRISE') ||
    (!currentPlan && !isEnterprise)

  return (
    <div className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 ${
      isCurrentPlan
        ? 'border-indigo-300 bg-indigo-50/50 ring-1 ring-indigo-500/10 shadow-lg shadow-indigo-100'
        : details.recommended && !isCurrentPlan
        ? 'border-indigo-200 bg-white hover:border-indigo-300 hover:shadow-lg hover:shadow-slate-100'
        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100'
    }`}>
      {/* Labels */}
      {isCurrentPlan && (
        <span className="absolute -top-3 left-4 bg-indigo-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
          Current Plan
        </span>
      )}
      {details.recommended && !isCurrentPlan && (
        <span className="absolute -top-3 right-4 bg-indigo-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
          Recommended
        </span>
      )}

      <div className="space-y-4">
        {/* Plan name + price */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{details.name} Plan</p>
          {isEnterprise ? (
            <p className="text-2xl font-black text-slate-900">Custom</p>
          ) : (
            <>
              <p className="text-2xl font-black text-slate-900">
                {details.inr}
                <span className="text-sm font-normal text-slate-500">{details.period}</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">≈ {details.usd}/mo internationally</p>
            </>
          )}
          <p className="text-[11px] text-slate-650 leading-relaxed mt-2">{details.description}</p>
        </div>

        {/* Feature list */}
        <ul className="space-y-2">
          {details.limits.map(limit => (
            <li key={limit} className="flex items-center gap-2 text-xs text-slate-700">
              <span className="text-indigo-600 font-bold flex-shrink-0">✓</span>
              {limit}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-5">
        {isCurrentPlan ? (
          <div className="w-full rounded-xl border border-indigo-200 bg-indigo-50 py-2.5 text-xs font-bold text-indigo-700 text-center">
            ✓ Current Plan
          </div>
        ) : isEnterprise ? (
          <a
            href="http://localhost:3000/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100/60 text-purple-700 text-xs font-bold py-2.5 text-center transition-all"
          >
            Contact Sales →
          </a>
        ) : isUpgrade ? (
          <button
            id={`upgrade-${planKey.toLowerCase()}-btn`}
            onClick={() => onUpgrade(planKey)}
            className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all ${
              details.recommended
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            Upgrade to {details.name} →
          </button>
        ) : (
          <div className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-400 text-center">
            Downgrade (Contact Support)
          </div>
        )}
      </div>
    </div>
  )
}

function MockCheckoutModal({ planKey, onClose, onSuccess }) {
  const plan = PLAN_DETAILS[planKey]
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242')
  const [cardExpiry, setCardExpiry] = useState('12/28')
  const [cardCvc, setCardCvc] = useState('123')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate payment processing delay
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    onSuccess(planKey)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Checkout — {plan.name} Plan</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Simulated Stripe secure checkout</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Amount */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Total Due Today</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{plan.inr}<span className="text-slate-500 text-sm font-normal">/mo</span></p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500">≈ {plan.usd}/mo</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Billed monthly</p>
            </div>
          </div>

          {/* Card details */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Cardholder Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Card Number</label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">VISA</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Expiry</label>
              <input
                type="text"
                value={cardExpiry}
                onChange={e => setCardExpiry(e.target.value)}
                placeholder="MM/YY"
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">CVC</label>
              <input
                type="text"
                value={cardCvc}
                onChange={e => setCardCvc(e.target.value)}
                placeholder="123"
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                required
              />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center">🔒 Secured by Stripe (simulation mode)</p>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 hover:border-slate-350 bg-transparent py-3 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 text-xs transition-all disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : `Pay ${plan.inr} →`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ClientBillingPage() {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCheckout, setShowCheckout] = useState(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [upgradedPlan, setUpgradedPlan] = useState(null)

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

  const handlePaymentSuccess = (planKey) => {
    setShowCheckout(null)
    setPaymentSuccess(true)
    setUpgradedPlan(planKey)
  }

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-800 border-t-indigo-500" />
      </div>
    )
  }

  const statusColors = {
    ACTIVE: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    TRIAL: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    EXPIRED: 'bg-red-500/10 border-red-500/20 text-red-400',
    INACTIVE: 'bg-slate-800 border-slate-700 text-slate-400',
  }
  const statusColor = statusColors[subscription?.status] || statusColors.INACTIVE

  // Generate mock invoices from subscription
  const invoices = (() => {
    if (!subscription) return []
    const planDets = PLAN_DETAILS[subscription.plan] || PLAN_DETAILS.STARTER
    const expiresAt = subscription.expiresAt ? new Date(subscription.expiresAt) : new Date()
    if (subscription.status === 'ACTIVE') {
      return [{
        id: `INV-${expiresAt.getFullYear()}-${String(expiresAt.getMonth() + 1).padStart(2, '0')}-001`,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { dateStyle: 'medium' }),
        amount: planDets.inr,
        method: 'Credit Card (Stripe)',
        status: 'PAID',
      }]
    }
    if (subscription.status === 'TRIAL') {
      return [{
        id: `INV-TRIAL-${expiresAt.getFullYear()}-001`,
        date: new Date(expiresAt.getTime() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { dateStyle: 'medium' }),
        amount: '₹0',
        method: 'Free Trial',
        status: 'TRIAL ACTIVE',
      }]
    }
    return []
  })()

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Billing & Subscriptions</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your plan, view invoices, and upgrade your subscription.</p>
      </div>

      {/* Payment Success Banner */}
      {paymentSuccess && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <span>🎉</span>
            <h3>Mock Checkout Completed!</h3>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Your upgrade to <strong className="text-slate-900">{upgradedPlan && PLAN_DETAILS[upgradedPlan]?.name} Plan</strong> has been registered in simulation mode.
            In production, Stripe will automatically convert your subscription.
            <br />
            <strong className="text-emerald-800">
              Please go to the Admin Dashboard → Client Onboarding → click "Convert Trial to Paid" to finalize.
            </strong>
          </p>
        </div>
      )}

      {/* Current Plan Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${statusColor}`}>
                {subscription?.status || 'Inactive'}
              </span>
              {subscription?.status !== 'ACTIVE' && (
                <span className="text-[10px] text-amber-700 font-bold bg-amber-50 border border-amber-250 px-2 py-0.5 rounded-full">
                  Upgrade Available
                </span>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              {PLAN_DETAILS[subscription?.plan]?.name || 'Starter'} Plan
              {subscription?.status === 'TRIAL' && (
                <span className="ml-2 text-lg text-emerald-600">(Trial)</span>
              )}
              {subscription?.status === 'EXPIRED' && (
                <span className="ml-2 text-lg text-red-650">(Expired)</span>
              )}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {PLAN_DETAILS[subscription?.plan]?.inr || '₹9,999'}/mo ·{' '}
              {PLAN_DETAILS[subscription?.plan]?.description || PLAN_DETAILS.STARTER.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
              <p className={`text-sm font-extrabold uppercase ${
                subscription?.status === 'ACTIVE' ? 'text-indigo-650' :
                subscription?.status === 'TRIAL' ? 'text-emerald-600' :
                subscription?.status === 'EXPIRED' ? 'text-red-650' : 'text-slate-500'
              }`}>
                {subscription?.status || 'Inactive'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {subscription?.status === 'TRIAL' ? 'Trial Ends' : 'Renewal Date'}
              </p>
              <p className="text-sm font-semibold text-slate-850">
                {subscription?.expiresAt
                  ? new Date(subscription.expiresAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })
                  : '—'}
              </p>
            </div>
            {subscription?.status === 'TRIAL' && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Days Left</p>
                <p className={`text-sm font-extrabold ${
                  (subscription.daysRemaining || 0) <= 1 ? 'text-red-650' :
                  (subscription.daysRemaining || 0) <= 2 ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {subscription.daysRemaining ?? 0} {subscription.daysRemaining === 1 ? 'day' : 'days'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900">Payment Method</h3>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">💳</span>
              <div>
                <p className="text-xs font-semibold text-slate-900">Visa ending in 4242</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Expires 12/28</p>
              </div>
              <span className="ml-auto text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200 font-semibold uppercase">Primary</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Your card will be billed automatically on subscription renewal. Contact support to update payment details.
          </p>
        </div>
      </div>

      {/* Plan Comparison Grid — Always Show */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Available Plans</h3>
          <p className="text-xs text-slate-500 mt-0.5">Compare plans and upgrade your subscription at any time.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Object.entries(PLAN_DETAILS).map(([key, details]) => (
            <PlanCard
              key={key}
              planKey={key}
              details={details}
              currentPlan={subscription?.plan || null}
              currentStatus={subscription?.status}
              onUpgrade={(planKey) => setShowCheckout(planKey)}
            />
          ))}
        </div>
      </div>

      {/* Invoice / Billing History */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-150 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">Billing History</h3>
        </div>
        {invoices.length === 0 ? (
          <p className="text-center text-xs text-slate-500 py-10">No invoice history yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="px-6 py-3.5">Invoice ID</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Method</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-55">
                    <td className="px-6 py-4 font-mono font-medium text-indigo-650">{inv.id}</td>
                    <td className="px-6 py-4">{inv.date}</td>
                    <td className="px-6 py-4 text-slate-900 font-bold">{inv.amount}</td>
                    <td className="px-6 py-4 text-slate-500">{inv.method}</td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        id={`download-invoice-${inv.id}`}
                        className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <MockCheckoutModal
          planKey={showCheckout}
          onClose={() => setShowCheckout(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}
