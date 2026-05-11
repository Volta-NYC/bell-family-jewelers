'use client'

import Link from 'next/link'
import { useState } from 'react'
import { business } from '@/lib/data'

const links = [
  { href: '/shop', label: 'Shop' },
  { href: '/collections', label: 'Collections' },
  { href: '/services', label: 'Services' },
  { href: '/designers', label: 'Designers' },
  { href: '/education', label: 'Education' },
  { href: '/about', label: 'About' },
  { href: '/cart', label: 'Bag' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-[#d9cdbb] bg-[#f8f3ea]/92 text-[#191714] backdrop-blur-xl">
      <div className="site-container flex items-center justify-between py-4">
        <Link href="/" className="group leading-none" aria-label="Bell Family Jewelers home">
          <span className="block font-display text-xl sm:text-2xl tracking-wide">Bell</span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6d6256] group-hover:text-[#9b793c] transition-colors">
            Family Jewelers
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-[13px] font-medium uppercase tracking-[0.12em] lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-[#4d463e] transition-colors hover:text-[#9b793c]">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={`tel:${business.phones[0]}`} className="text-xs font-semibold tracking-[0.12em] text-[#6d6256]">
            {business.phones[0]}
          </a>
          <Link
            href="/contact"
            className="focus-ring rounded-full bg-[#191714] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#f8f1df] transition-colors hover:bg-[#3a3024]"
          >
            Book Appointment
          </Link>
        </div>

        <button
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#c9bda9] text-[#191714] lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Menu</span>
          <span className="relative block h-4 w-5">
            <span className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`absolute left-0 top-2 h-px w-5 bg-current transition-opacity ${open ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`absolute left-0 top-4 h-px w-5 bg-current transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </span>
        </button>
      </div>

      {open && (
        <nav className="border-t border-[#d9cdbb] bg-[#f8f3ea] px-4 pb-5 pt-3 lg:hidden">
          <div className="mx-auto flex max-w-xl flex-col gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 font-medium uppercase tracking-[0.12em] text-[#3b332b] hover:bg-[#ede1d0]"
            >
              {link.label}
            </Link>
          ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-[#191714] px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#f8f1df]"
            >
              Book Appointment
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
