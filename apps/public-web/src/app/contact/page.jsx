import { OnboardingForm } from '@/components/OnboardingForm'
import { ContactForm } from '@/components/ContactForm'

export const metadata = {
  title: 'Contact — AiGateway',
  description: 'Get in touch with AiGateway to start automating your business.',
}

export default function ContactPage({ searchParams }) {
  const preSelectedService = searchParams?.service || ''
  const requestType = searchParams?.type || ''   // 'trial' | 'book' | ''

  const isTrial = requestType === 'trial'
  const isBook  = requestType === 'book'
  const isOnboarding = (isTrial || isBook) && preSelectedService

  return (
    <section className="py-24 bg-slate-950 min-h-screen relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-start">

          {/* ── Left column — context ── */}
          <div className="space-y-6 lg:sticky lg:top-8">
            {isOnboarding ? (
              <>
                {/* Trial badge or Book badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
                  isTrial
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                    : 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400'
                }`}>
                  {isTrial ? '🎁 3-Day Free Trial' : '📋 Book Service'}
                </div>

                <h1 className="text-4xl font-extrabold text-white sm:text-5xl leading-tight">
                  {isTrial ? 'Start Your Free Trial' : 'Book This Service'}
                  <br />
                  <span className={isTrial ? 'text-emerald-400' : 'text-indigo-400'}>
                    {preSelectedService}
                  </span>
                </h1>

                <p className="text-sm text-slate-400 leading-relaxed">
                  {isTrial
                    ? `Fill in your details and service requirements. Your ${preSelectedService} trial will be activated within 1 hour — live for 3 full days.`
                    : `Fill in your details. Our team will contact you to confirm payment and activate your ${preSelectedService} permanently.`
                  }
                </p>

                {/* What's included */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  {(isTrial ? [
                    { icon: '⚡', title: 'Activated within 1 hour', desc: 'Admin reviews and activates your trial instantly.' },
                    { icon: '🔓', title: '3 days full access', desc: 'Complete service access — no credit card required.' },
                    { icon: '📩', title: 'Login credentials by email', desc: 'Watch your inbox for your client dashboard login.' },
                    { icon: '🔄', title: 'Easy upgrade', desc: 'After trial, continue for ₹9,999/mo or cancel anytime.' },
                  ] : [
                    { icon: '✅', title: 'Manual payment verification', desc: 'Our team confirms payment and activates your service.' },
                    { icon: '⚡', title: 'Live within 48 hours', desc: 'Service goes live once payment is confirmed.' },
                    { icon: '🛡️', title: 'Human-in-the-loop control', desc: 'Every action needs your approval — no rogue automation.' },
                    { icon: '📈', title: 'Full client dashboard', desc: 'Track all service activity in your client portal.' },
                  ]).map(item => (
                    <div key={item.title} className="flex items-start gap-3">
                      <span className="text-lg p-2 bg-slate-900 border border-slate-800 rounded-lg flex-shrink-0">{item.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-white">{item.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-extrabold text-white sm:text-5xl leading-tight">Let&apos;s build together</h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Tell us about your business goals, target industries, and what operations you want to automate.
                  We will custom-tailor a demo node for you.
                </p>
                <div className="space-y-4 pt-4 border-t border-slate-900">
                  {[
                    { icon: '⚡', title: 'Setup within 48h', desc: 'Your custom AI scraper and outreach model goes live within 48 hours.' },
                    { icon: '🛡️', title: 'Human-in-the-loop control', desc: 'No email or calendar slot is scheduled autonomously. You approve every step.' },
                    { icon: '📈', title: 'Actionable sales pipelines', desc: 'Watch your lead dashboard automatically fill up with qualified meetings.' },
                  ].map(item => (
                    <div key={item.title} className="flex items-start gap-4">
                      <span className="text-xl p-2 bg-slate-900 border border-slate-800 rounded-xl">{item.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-white">{item.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Right column — form ── */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 shadow-2xl relative">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-t from-transparent via-slate-800/20 to-slate-800/40 pointer-events-none" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
              {isOnboarding
                ? (isTrial ? `Start Trial — ${preSelectedService}` : `Book — ${preSelectedService}`)
                : 'Send Inquiry'
              }
            </h2>

            {/* Use OnboardingForm for Trial/Book, ContactForm for generic inquiries */}
            {isOnboarding
              ? <OnboardingForm
                  serviceName={preSelectedService}
                  requestType={requestType.toUpperCase()}
                />
              : <ContactForm preSelectedService={preSelectedService} />
            }
          </div>

        </div>
      </div>
    </section>
  )
}
