import AppointmentForm from '@/lib/components/appointment-form'
import { business } from '@/lib/data'

export default function ContactPage() {
  return (
    <div className="site-container grid gap-10 py-12 sm:py-16 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="scroll-reveal">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b7353]">Contact</p>
        <h1 className="mt-3 font-display text-5xl leading-tight text-[#191714] sm:text-6xl">Visit Bell Family Jewelers</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5c5145]">
          Visit us in Bayside, call the store, or request an appointment.
        </p>

        <div className="mt-8 grid gap-4">
          <div className="surface-card scroll-card border border-[#dfd4c4] bg-[#fbf8f2] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b7353]">Address</p>
            <p className="mt-2 text-lg text-[#191714]">{business.address}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="surface-card scroll-card border border-[#dfd4c4] bg-[#fbf8f2] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b7353]">Phone</p>
              <a href={`tel:${business.phones[0]}`} className="mt-2 block text-lg text-[#191714]">{business.phones[0]}</a>
            </div>
            <div className="surface-card scroll-card border border-[#dfd4c4] bg-[#fbf8f2] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b7353]">Email</p>
              <a href={`mailto:${business.emails[0]}`} className="mt-2 block break-words text-lg text-[#191714]">{business.emails[0]}</a>
            </div>
          </div>
        </div>

        <div className="scroll-card mt-8 border border-[#dfd4c4] bg-[#191714] p-5 text-[#fbf5e8]">
          <h2 className="font-display text-3xl">Opening hours</h2>
          <dl className="mt-5 space-y-3 text-sm">
            {Object.entries(business.hours).map(([day, hour]) => (
              <div key={day} className="flex justify-between gap-4 border-b border-white/10 pb-3">
                <dt className="text-[#b7aa9a]">{day}</dt>
                <dd>{hour}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-5 text-[#8f8271]">
            The home and contact pages list slightly different hours in the scrape; the contact page hours are shown here.
          </p>
        </div>
      </section>

      <AppointmentForm />
    </div>
  )
}
