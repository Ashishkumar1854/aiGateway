import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Logo */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                <span className="text-indigo-600">⚡</span>
                AiGateway
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              AI-powered business automation platform for modern companies. India, UK, USA, Canada, Dubai.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all text-xs font-bold">
                in
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-pink-600 hover:border-pink-200 transition-all text-xs">
                📷
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-600 hover:border-red-200 transition-all text-xs">
                ▶
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Services</h3>
            <ul className="mt-4 space-y-2">
              {[
                { label: 'Lead Generation', href: '/services/lead-generation' },
                { label: 'Email Automation', href: '/services/email-automation' },
                { label: 'WhatsApp Automation', href: '/services/whatsapp-automation' },
                { label: 'LinkedIn Automation', href: '/services/linkedin-automation' },
                { label: 'Reels Automation', href: '/services/reels-automation' },
                { label: 'Job Seeker', href: '/services/job-seeker' },
              ].map((s) => (
                <li key={s.label}>
                  <Link href={s.href} className="text-xs text-slate-500 hover:text-indigo-600 transition-colors duration-200">{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Personal Branding */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Custom</h3>
            <ul className="mt-4 space-y-2">
              {[
                { label: 'Personal Branding', href: '/personal-branding' },
                { label: 'Case Studies', href: '/case-studies' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-xs text-slate-500 hover:text-indigo-600 transition-colors duration-200">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Getting Started */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Get Started</h3>
            <ul className="mt-4 space-y-2">
              {[
                { label: 'Start Free Trial', href: '/signup' },
                { label: 'Book Demo', href: '/book-demo' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Login', href: '/login' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-xs text-slate-500 hover:text-indigo-600 transition-colors duration-200">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((s) => (
                <li key={s}>
                  <span className="text-xs text-slate-400 cursor-not-allowed">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-400">© 2026 AiGateway. All rights reserved.</p>
          <p className="text-[11px] text-slate-400">Global: India · UK · USA · Canada · Dubai</p>
        </div>
      </div>
    </footer>
  )
}
