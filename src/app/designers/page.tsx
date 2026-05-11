import Link from 'next/link'
import { business } from '@/lib/data'

export default function DesignersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold">Designers & Brands</h1>
      <p className="text-zinc-300">Featured brands listed in the Bell Family Jewelers source material.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {business.designers.map((designer) => (
          <Link key={designer.slug} href={`/designers/${designer.slug}`} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 hover:border-amber-300/70">
            <h2 className="text-xl">{designer.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  )
}
