import Link from 'next/link'
import { business, featuredCollections } from '@/lib/data'

export default function Footer() {
  return (
    <footer className="scroll-reveal mt-20 bg-[#191714] text-[#d8cdbd]">
      <div className="site-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="font-display text-3xl text-[#fbf5e8]">Bell Family Jewelers</Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[#b7aa9a]">{business.homepageCopy[1]}</p>
          <div className="mt-6 space-y-1 text-sm">
            <p>{business.address}</p>
            <p>{business.phones[0]}</p>
            <p>{business.emails[0]}</p>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a45f]">Hours</h3>
          <ul className="space-y-2 text-sm">
            {Object.entries(business.hours).map(([day, hour]) => (
              <li key={day} className="flex justify-between gap-4 border-b border-white/10 pb-2">
                <span>{day}</span>
                <span className="text-right text-[#fbf5e8]">{hour}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-5 text-[#8f8271]">Hours are shown from the contact page in the scraped source.</p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a45f]">Collections</h3>
          <ul className="space-y-2 text-sm">
            {featuredCollections.map((collection) => (
              <li key={collection.slug}>
                <Link href={`/collections/${collection.slug}`} className="hover:text-[#fbf5e8]">{collection.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a45f]">Visit</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/contact" className="hover:text-[#fbf5e8]">Contact & Appointments</Link></li>
            <li><Link href="/services" className="hover:text-[#fbf5e8]">Jewelry Services</Link></li>
            <li><Link href="/education" className="hover:text-[#fbf5e8]">Education</Link></li>
            <li><a href={business.social.facebook} target="_blank" rel="noreferrer" className="hover:text-[#fbf5e8]">Facebook</a></li>
            <li><a href={business.social.instagram} target="_blank" rel="noreferrer" className="hover:text-[#fbf5e8]">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="site-container flex flex-col gap-2 py-5 text-xs text-[#8f8271] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Bell Family Jewelers</p>
          <p>Local data and media generated from scraped source markdown.</p>
        </div>
      </div>
    </footer>
  )
}
