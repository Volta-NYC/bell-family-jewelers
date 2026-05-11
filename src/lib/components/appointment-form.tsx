'use client'

import { useState } from 'react'

export default function AppointmentForm() {
  const [sent, setSent] = useState(false)

  return (
    <form
      className="border border-[#dfd4c4] bg-[#fbf8f2] p-5 shadow-[0_18px_50px_rgb(40_28_14_/_0.10)] sm:p-7"
      aria-label="Appointment request form"
      onSubmit={(event) => {
        event.preventDefault()
        setSent(true)
      }}
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b7353]">Appointment</p>
        <h2 className="mt-2 font-display text-3xl text-[#191714]">Request a visit</h2>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="block">
          <span className="mb-2 block text-sm text-[#4d463e]">Full name</span>
          <input className="focus-ring w-full border border-[#d8cbbb] bg-white px-4 py-3 text-sm" required />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-[#4d463e]">Email</span>
          <input className="focus-ring w-full border border-[#d8cbbb] bg-white px-4 py-3 text-sm" type="email" required />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-[#4d463e]">Phone</span>
          <input className="focus-ring w-full border border-[#d8cbbb] bg-white px-4 py-3 text-sm" type="tel" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-[#4d463e]">How can we help?</span>
          <textarea className="focus-ring min-h-32 w-full border border-[#d8cbbb] bg-white px-4 py-3 text-sm" required />
        </label>
      </div>

      <button
        type="submit"
        className="focus-ring mt-5 w-full bg-[#191714] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#fbf5e8] transition-colors hover:bg-[#3a3024]"
      >
        Send Request
      </button>

      {sent && (
        <p className="mt-4 border border-[#c9a45f] bg-[#f7efd9] px-4 py-3 text-sm text-[#4d3920]" role="status">
          Request captured in this website mockup. Please call or email the store to send it.
        </p>
      )}
    </form>
  )
}
