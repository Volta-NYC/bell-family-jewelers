import Link from 'next/link'
import type { Collection } from '@/lib/types'

export default function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 hover:border-amber-300/70 transition-colors"
    >
      <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Collection</p>
      <h3 className="text-xl text-zinc-100 mt-2">{collection.name}</h3>
      <p className="text-zinc-400 text-sm mt-2">{collection.productCount} curated pieces</p>
    </Link>
  )
}
