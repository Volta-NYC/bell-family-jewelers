import Link from 'next/link'
import type { Product } from '@/lib/types'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden hover:border-amber-300/60 transition-colors">
      <Link href={`/products/${product.slug}`}>
        <img
          src={product.imagePaths[0] ?? '/media/fallback-generic.png'}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
      </Link>
      <div className="p-4 space-y-2">
        <p className="text-xs tracking-[0.12em] uppercase text-zinc-400">{product.category}</p>
        <h3 className="font-medium text-zinc-100 leading-snug line-clamp-2">{product.name}</h3>
        <p className="text-xs text-zinc-400">Style #{product.specifications?.styleNumber ?? 'N/A'}</p>
        <p className="text-sm text-amber-200">{product.priceNote ?? 'Inquire with store for pricing'}</p>
      </div>
    </article>
  )
}
