import Link from 'next/link'
import { business, featuredCollections, featuredProducts } from '@/lib/data'
import CollectionCard from '@/lib/components/collection-card'
import ProductCard from '@/lib/components/product-card'

export default function HomePage() {
  return (
    <div className="space-y-14">
      <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-8 sm:p-12">
        <p className="uppercase tracking-[0.18em] text-xs text-amber-300">Bayside, New York</p>
        <h1 className="text-4xl sm:text-6xl font-semibold leading-tight mt-4">Luxury Jewelry. Crafted to Last.</h1>
        <p className="text-zinc-300 mt-6 max-w-2xl">
          {business.homepageCopy[0]}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop" className="px-6 py-3 rounded-full bg-amber-300 text-zinc-900 text-sm font-medium">Shop Collections</Link>
          <Link href="/contact" className="px-6 py-3 rounded-full border border-zinc-700 text-sm">Book Appointment</Link>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-medium">Featured Collections</h2>
          <Link href="/collections" className="text-sm text-amber-300">View all</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCollections.map((collection) => (
            <CollectionCard key={collection.slug} collection={collection} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl sm:text-3xl font-medium">Selected Pieces</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={`${product.slug}-${product.sourceMarkdownFile}`} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
