import Link from 'next/link'
import { CTASection } from './CTASection'
import { ServicePricingCards } from './ServicePricingCards'

export function ServiceDetailPage({ service }) {
  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100 pt-24 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-indigo-100/60 rounded-full blur-[120px] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 relative z-10">
          <span className="text-5xl mb-5 block">{service.icon}</span>
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            {service.badge}
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-6xl tracking-tight mt-5 leading-tight">
            {service.title}
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            {service.description}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/contact?service=${encodeURIComponent(service.name)}&type=trial`}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-3.5 text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
            >
              Start Free Trial →
            </Link>
            <Link
              href={`/contact?service=${encodeURIComponent(service.name)}&type=book`}
              className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-8 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5"
            >
              Book Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">Key Features</h2>
            <p className="mt-3 text-sm text-slate-500">Everything included when you activate {service.name}.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/60 transition-all duration-300"
              >
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-sm font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">How {service.name} Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {service.steps.map((step, i) => (
              <div key={step} className="rounded-2xl border border-slate-200 bg-white p-5 text-center hover:border-indigo-200 hover:shadow-lg transition-all">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 block mb-3">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing — 3 Cards (dark section embedded) ─── */}
      <ServicePricingCards serviceSlug={service.slug} serviceName={service.name} />

      <CTASection />
    </div>
  )
}
