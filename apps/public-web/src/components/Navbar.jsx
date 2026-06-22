'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const saasServices = [
  { icon: '🎯', name: 'Lead Generation', href: '/services/lead-generation', desc: 'Find ideal prospects with AI' },
  { icon: '📧', name: 'Email Automation', href: '/services/email-automation', desc: 'Personalized outreach at scale' },
  { icon: '💬', name: 'WhatsApp Automation', href: '/services/whatsapp-automation', desc: 'Broadcasts, flows & auto-replies' },
  { icon: '🔗', name: 'LinkedIn Automation', href: '/services/linkedin-automation', desc: 'Connect & follow up on LinkedIn' },
  { icon: '🎬', name: 'Reels Automation', href: '/services/reels-automation', desc: 'Scripts, scheduling & analytics' },
]

const brandingServices = [
  { icon: '🌐', name: 'Personal Website', href: '/personal-branding' },
  { icon: '🏢', name: 'Business Website', href: '/personal-branding' },
  { icon: '📊', name: 'CRM Development', href: '/personal-branding' },
  { icon: '💬', name: 'WhatsApp CRM', href: '/personal-branding' },
  { icon: '🤖', name: 'Custom AI Bots', href: '/personal-branding' },
  { icon: '⚙️', name: 'Automation Workflows', href: '/personal-branding' },
  { icon: '🎨', name: 'Brand Identity', href: '/personal-branding' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [mobileAccordion, setMobileAccordion] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md transition-all duration-300 shadow-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6" ref={dropdownRef}>
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
              <span className="text-indigo-600 font-black">⚡</span>
              AiGateway
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('services')}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeDropdown === 'services' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Services
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {activeDropdown === 'services' && (
                <div className="absolute top-full left-0 mt-2 w-[340px] rounded-2xl border border-slate-100 bg-white/95 backdrop-blur-xl shadow-xl shadow-slate-200/60 p-2">
                  <div className="px-3 pt-2 pb-2 border-b border-slate-100 mb-1">
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">SaaS Services</p>
                  </div>
                  {saasServices.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <span className="text-lg w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors flex-shrink-0">{s.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{s.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{s.desc}</p>
                      </div>
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <Link
                      href="/services"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-xs text-slate-500 hover:text-indigo-600 font-medium"
                    >
                      View All Services <span>→</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Personal Branding Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('branding')}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeDropdown === 'branding' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Personal Branding
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'branding' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {activeDropdown === 'branding' && (
                <div className="absolute top-full left-0 mt-2 w-[280px] rounded-2xl border border-slate-100 bg-white/95 backdrop-blur-xl shadow-xl shadow-slate-200/60 p-2">
                  <div className="px-3 pt-2 pb-2 border-b border-slate-100 mb-1">
                    <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">Custom Solutions</p>
                  </div>
                  {brandingServices.map((s) => (
                    <Link
                      key={s.name}
                      href={s.href}
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <span className="text-base">{s.icon}</span>
                      <span className="text-xs font-medium text-slate-700 group-hover:text-purple-600 transition-colors">{s.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/case-studies" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200 rounded-lg">
              Case Studies
            </Link>
            <Link href="/about" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200 rounded-lg">
              About
            </Link>
            <Link href="/contact" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200 rounded-lg">
              Contact
            </Link>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              href="/contact"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm px-5 py-2.5 transition-all shadow-md shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-slate-600 hover:text-slate-900 focus:outline-none p-1.5 rounded-lg border border-slate-200 bg-white"
            onClick={() => { setMobileOpen(!mobileOpen); setMobileAccordion(null) }}
            aria-label="Toggle menu"
          >
            <span className="text-xl leading-none flex items-center justify-center w-5 h-5">{mobileOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 py-4 space-y-1 bg-white">
            <div>
              <button
                onClick={() => setMobileAccordion(mobileAccordion === 'services' ? null : 'services')}
                className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all"
              >
                Services
                <svg className={`w-4 h-4 transition-transform ${mobileAccordion === 'services' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {mobileAccordion === 'services' && (
                <div className="pl-4 pr-2 pb-2 space-y-0.5">
                  {saasServices.map((s) => (
                    <Link key={s.href} href={s.href} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all">
                      <span>{s.icon}</span> {s.name}
                    </Link>
                  ))}
                  <Link href="/services" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-indigo-600 font-semibold hover:bg-indigo-50 transition-all">
                    View All →
                  </Link>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setMobileAccordion(mobileAccordion === 'branding' ? null : 'branding')}
                className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all"
              >
                Personal Branding
                <svg className={`w-4 h-4 transition-transform ${mobileAccordion === 'branding' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {mobileAccordion === 'branding' && (
                <div className="pl-4 pr-2 pb-2 space-y-0.5">
                  {brandingServices.map((s) => (
                    <Link key={s.name} href={s.href} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all">
                      <span>{s.icon}</span> {s.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {[
              { href: '/case-studies', label: 'Case Studies' },
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' },
            ].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all">
                {item.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3 px-4">
              <Link href="/login" onClick={() => setMobileOpen(false)}
                className="text-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all">
                Login
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)}
                className="text-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
