import { business } from '@/lib/data'

export default function ContactPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="space-y-5">
        <h1 className="text-4xl font-semibold">Contact & Appointments</h1>
        <p className="text-zinc-300">Visit us in Bayside, call, or send us an appointment request.</p>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-2 text-zinc-300">
          <p><span className="text-zinc-100">Address:</span> {business.address}</p>
          <p><span className="text-zinc-100">Phone:</span> {business.phones[0]}</p>
          <p><span className="text-zinc-100">Email:</span> {business.emails[0]}</p>
        </div>
      </section>

      <form className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-4" aria-label="Appointment request form">
        <h2 className="text-xl">Request an Appointment</h2>
        <input className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3" placeholder="Full name" />
        <input className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3" placeholder="Email" type="email" />
        <input className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3" placeholder="Phone" />
        <textarea className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 min-h-28" placeholder="How can we help?" />
        <button type="button" className="px-6 py-3 rounded-full bg-amber-300 text-zinc-900 text-sm font-medium">Send Request</button>
      </form>
    </div>
  )
}
