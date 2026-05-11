'use client'

import Link from 'next/link'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/collections', label: 'Collections' },
  { href: '/services', label: 'Services' },
  { href: '/designers', label: 'Designers' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-zinc-800 bg-black/90 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-[0.2em] text-xs sm:text-sm uppercase">
          Bell Family Jewelers
        </Link>

        <button
          className="sm:hidden border border-zinc-700 rounded px-3 py-1 text-xs"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          Menu
        </button>

        <nav className="hidden sm:flex gap-5 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-zinc-300 hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {open && (
        <nav className="sm:hidden border-t border-zinc-800 px-4 pb-4 flex flex-col gap-3 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-zinc-300 hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
