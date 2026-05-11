import Link from 'next/link'
import { business } from '@/lib/data'

export default function AboutPage() {
  return (
    <div>
      <section className="bg-[#191714] text-[#fbf5e8]">
        <div className="site-container py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a45f]">About</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl leading-tight sm:text-6xl">A family jeweler rooted in Bayside.</h1>
        </div>
      </section>

      <section className="site-container grid gap-10 py-12 sm:py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="border border-[#dfd4c4] bg-[#fbf8f2] p-6 lg:self-start">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b7353]">Business info</p>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-[#8f8271]">Address</dt>
              <dd className="mt-1 text-[#191714]">{business.address}</dd>
            </div>
            <div>
              <dt className="text-[#8f8271]">Phone</dt>
              <dd className="mt-1 text-[#191714]">{business.phones[0]}</dd>
            </div>
            <div>
              <dt className="text-[#8f8271]">Email</dt>
              <dd className="mt-1 break-words text-[#191714]">{business.emails[0]}</dd>
            </div>
          </dl>
          <Link href="/contact" className="focus-ring mt-6 inline-flex bg-[#191714] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#fbf5e8]">
            Contact
          </Link>
        </aside>

        <article className="space-y-6">
          {business.about.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-9 text-[#4d463e]">
              {paragraph}
            </p>
          ))}
        </article>
      </section>
    </div>
  )
}
