import Link from 'next/link'
import Image from 'next/image'
import type { Collection } from '@/lib/types'

export default function CollectionCard({ collection }: { collection: Collection }) {
  const image = collection.imagePaths[0] ?? '/media/719e3f-679deac65f954f829a025478838844b1f000-dcf918e32644.webp'

  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group block overflow-hidden border border-[#dfd4c4] bg-[#fbf8f2] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45f] hover:shadow-[0_18px_50px_rgb(40_28_14_/_0.12)]"
    >
      <div className="relative aspect-[16/11] bg-[#efe4d4]">
        <Image
          src={image}
          alt={collection.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b7353]">Collection</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl text-[#191714]">{collection.name}</h3>
            <p className="mt-1 text-sm text-[#6c6258]">{collection.productCount} catalog pieces</p>
          </div>
          <svg className="h-5 w-5 shrink-0 text-[#9b793c] transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h13m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
