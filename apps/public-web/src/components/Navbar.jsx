'use client'

import { useState } from 'react'
import Link from 'next/link'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-indigo-600">⚡ AiGateway</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: '/services', label: 'Services' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="http://localhost:3001/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Client Login
            </Link>
            <Link
              href="/contact"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-slate-600"
            onClick={() => setOpen(!open)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1">
            {[
              { href: '/services', label: 'Services' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="block mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
