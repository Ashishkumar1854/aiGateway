import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <span className="text-lg font-bold text-indigo-600">⚡ AiGateway</span>
            <p className="mt-2 text-sm text-slate-500">
              AI-powered business automation for modern companies.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Services</h3>
            <ul className="mt-3 space-y-2">
              {['Lead Generation', 'Email Automation', 'Reels Automation', 'WhatsApp'].map((s) => (
                <li key={s}>
                  <Link href="/services" className="text-sm text-slate-500 hover:text-slate-900">{s}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Company</h3>
            <ul className="mt-3 space-y-2">
              {[
                { label: 'About', href: '/about' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-slate-500 hover:text-slate-900">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Legal</h3>
            <ul className="mt-3 space-y-2">
              {['Privacy Policy', 'Terms of Service'].map((s) => (
                <li key={s}>
                  <span className="text-sm text-slate-400">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-200 pt-6 text-center">
          <p className="text-sm text-slate-400">© 2026 AiGateway. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
