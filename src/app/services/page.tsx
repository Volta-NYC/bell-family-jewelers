import { business } from '@/lib/data'

export default function ServicesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-semibold">Jewelry Services</h1>
      <p className="text-zinc-300 max-w-3xl">Professional in-store services from Bell Family Jewelers, preserved from the source material.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {business.services.map((service) => (
          <article key={service} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="text-zinc-100">{service.replace(/\u00a0/g, ' ')}</h2>
          </article>
        ))}
      </div>
    </div>
  )
}
