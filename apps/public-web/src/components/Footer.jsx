import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              ⚡ AiGateway
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              AI-powered sales automation and cooperate workforce systems for modern companies.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Services</h3>
            <ul className="mt-4 space-y-2">
              {['Lead Generation', 'Email Automation', 'Reels Producer', 'WhatsApp API'].map((s) => (
                <li key={s}>
                  <Link href="/services" className="text-xs text-slate-500 hover:text-white transition-colors duration-200">{s}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              {[
                { label: 'Services details', href: '/services' },
                { label: 'Personal Branding', href: '/other-services' },
                { label: 'Plans & Pricing', href: '/pricing' },
                { label: 'Contact Support', href: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-xs text-slate-500 hover:text-white transition-colors duration-200">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              {['Privacy Policy', 'Terms of Service'].map((s) => (
                <li key={s}>
                  <span className="text-xs text-slate-600 cursor-not-allowed">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-600">© 2026 AiGateway. All rights reserved.</p>
          <p className="text-[11px] text-slate-600">Built with Next.js, FastAPI & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}
