'use client'

import { useState } from 'react'
import Link from 'next/link'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-500 to-purple-400">
              ⚡ AiGateway
            </span>
          </Link>

          {/* Desktop nav */}
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
                className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="http://localhost:3001/login"
              className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200"
            >
              Client Login
            </Link>
            <Link
              href="/contact"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-bold text-white transition-all shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white focus:outline-none p-1"
            onClick={() => setOpen(!open)}
          >
            <span className="text-xl">{open ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-slate-800/80 py-4 space-y-2 bg-slate-950/95 backdrop-blur-md">
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
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2 px-3">
              <Link
                href="http://localhost:3001/login"
                onClick={() => setOpen(false)}
                className="text-center rounded-xl border border-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-all"
              >
                Client Login
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="text-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg"
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
