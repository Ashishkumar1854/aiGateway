import { ContactForm } from '@/components/ContactForm'

export const metadata = {
  title: 'Contact — AiGateway',
  description: 'Get in touch with AiGateway to start automating your business.',
}

export default function ContactPage() {
  return (
    <section className="py-16 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Let's talk</h1>
            <p className="mt-4 text-lg text-slate-500">
              Tell us about your business and we'll show you exactly how AiGateway can automate your growth.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: '⚡', title: 'Fast setup', desc: 'Your automation runs within 48 hours of signing up.' },
                { icon: '🤖', title: 'Human oversight', desc: 'Every AI action needs your approval. You stay in control.' },
                { icon: '📊', title: 'Real results', desc: 'Track every lead, email, and conversion in your dashboard.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
