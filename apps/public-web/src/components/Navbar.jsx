'use client'

import { useState } from 'react'
import Link from 'next/link'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#08080f]/80 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span className="text-indigo-500 font-black">⚡</span>
              AiGateway
            </span>
          </Link>

          {/* Desktop Nav - Center */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: '/services', label: 'Services' },
              { href: '/other-services', label: 'Personal Branding' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/contact', label: 'Contact' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs - Right */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              href="http://localhost:3001/login"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
            >
              Client Login
            </Link>
            <Link
              href="/contact"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-5 py-2.5 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white focus:outline-none p-1.5 rounded-lg border border-slate-800 bg-slate-900/30"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className="text-xl leading-none flex items-center justify-center w-5 h-5">{open ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-slate-900 py-5 space-y-3 bg-[#08080f]/95 backdrop-blur-lg animate-in fade-in slide-in-from-top-5 duration-200">
            {[
              { href: '/services', label: 'Services' },
              { href: '/other-services', label: 'Personal Branding' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/contact', label: 'Contact' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900/50 transition-all"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-900 flex flex-col gap-3 px-4">
              <Link
                href="http://localhost:3001/login"
                onClick={() => setOpen(false)}
                className="text-center rounded-xl border border-slate-850 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900/40 transition-all"
              >
                Client Login
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="text-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/10"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
