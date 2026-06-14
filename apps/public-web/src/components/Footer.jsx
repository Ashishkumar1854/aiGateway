import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[#1e1e2e] bg-[#09090e] py-20 relative overflow-hidden">
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-900/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-900/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span className="text-indigo-500">⚡</span>
              AiGateway
            </span>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              AI-powered sales automation and cooperative virtual workforce systems for modern companies.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Services</h3>
            <ul className="mt-4 space-y-2">
              {['Lead Generation', 'Email Automation', 'Reels Producer', 'WhatsApp API'].map((s) => (
                <li key={s}>
                  <Link href="/services" className="text-xs text-slate-400 hover:text-white transition-colors duration-200">{s}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              {[
                { label: 'Services Details', href: '/services' },
                { label: 'Personal Branding', href: '/other-services' },
                { label: 'Plans & Pricing', href: '/pricing' },
                { label: 'Contact Support', href: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-xs text-slate-400 hover:text-white transition-colors duration-200">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              {['Privacy Policy', 'Terms of Service'].map((s) => (
                <li key={s}>
                  <span className="text-xs text-slate-500 cursor-not-allowed">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t border-[#1e1e2e] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500">© 2026 AiGateway. All rights reserved.</p>
          <p className="text-[11px] text-slate-500">Built with Next.js, FastAPI & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}
