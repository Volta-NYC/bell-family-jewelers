import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types'

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const styleNumber = product.specifications?.styleNumber
  const note = product.priceNote ?? 'inquire with store for pricing'
  const visibleBadges = product.badges.filter((badge) => badge !== 'image-unavailable-in-source').slice(0, 2)
  const loadingProps = priority ? { priority: true } : { loading: 'lazy' as const }

  return (
    <article className="group overflow-hidden border border-[#dfd4c4] bg-[#fbf8f2] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45f] hover:shadow-[0_18px_50px_rgb(40_28_14_/_0.12)]">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="image-sheen relative aspect-[4/5] bg-[#f2eadf]">
          <Image
            src={product.imagePaths[0] ?? '/media/thumbnail-c885fd6789be.webp'}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
            {...loadingProps}
          />
        </div>
      </Link>
      <div className="space-y-3 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b7353]">{product.category}</p>
          {styleNumber && <p className="text-[11px] uppercase tracking-[0.12em] text-[#817366]">#{styleNumber}</p>}
        </div>
        <h3 className="min-h-[3rem] font-display text-xl leading-6 text-[#191714]">{product.name}</h3>
        {visibleBadges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {visibleBadges.map((badge) => (
              <span key={badge} className="border border-[#dfd4c4] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#6c6258]">
                {badge.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-end justify-between gap-3 pt-2">
          <p className="text-sm text-[#6c6258]">{note}</p>
          <svg className="h-5 w-5 shrink-0 text-[#9b793c] transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h13m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </article>
  )
}
