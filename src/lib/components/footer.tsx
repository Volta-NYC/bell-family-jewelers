import Link from 'next/link'
import { business } from '@/lib/data'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-20 bg-black text-zinc-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-sm">
        <div>
          <h3 className="text-zinc-100 uppercase tracking-[0.16em] text-xs mb-3">Bell Family Jewelers</h3>
          <p>{business.address}</p>
          <p className="mt-2">{business.phones[0]}</p>
          <p>{business.emails[0]}</p>
        </div>

        <div>
          <h3 className="text-zinc-100 uppercase tracking-[0.16em] text-xs mb-3">Hours</h3>
          <ul className="space-y-1">
            {Object.entries(business.hours).map(([day, hour]) => (
              <li key={day}>
                {day}: {hour}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-zinc-100 uppercase tracking-[0.16em] text-xs mb-3">Explore</h3>
          <ul className="space-y-1">
            <li><Link href="/collections">Collections</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/designers">Designers</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-zinc-100 uppercase tracking-[0.16em] text-xs mb-3">Social</h3>
          <ul className="space-y-1">
            <li><a href={business.social.facebook} target="_blank" rel="noreferrer">Facebook</a></li>
            <li><a href={business.social.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-800 py-4 px-4 sm:px-6 text-xs text-zinc-500 max-w-7xl mx-auto">
        © {new Date().getFullYear()} Bell Family Jewelers
      </div>
    </footer>
  )
}
