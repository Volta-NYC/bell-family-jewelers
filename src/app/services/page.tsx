import Link from 'next/link'
import { business } from '@/lib/data'

export default function ServicesPage() {
  return (
    <div>
      <section className="bg-[#191714] text-[#fbf5e8]">
        <div className="site-container py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a45f]">Services</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl leading-tight sm:text-6xl">Care for the pieces that matter.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#d8cdbd]">{business.homepageCopy[1]}</p>
        </div>
      </section>

      <section className="site-container py-12 sm:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {business.services.map((service) => (
            <article key={service.slug} className="border border-[#dfd4c4] bg-[#fbf8f2] p-6">
              <h2 className="font-display text-2xl text-[#191714]">{service.name}</h2>
              {service.description && <p className="mt-4 text-sm leading-6 text-[#6c6258]">{service.description}</p>}
            </article>
          ))}
        </div>

        <div className="mt-10 border border-[#dfd4c4] bg-[#efe5d6] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[#191714]">Need help choosing a service?</h2>
              <p className="mt-2 text-sm text-[#5c5145]">Call the store or request an appointment using the contact form.</p>
            </div>
            <Link href="/contact" className="focus-ring inline-flex justify-center bg-[#191714] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#fbf5e8]">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
