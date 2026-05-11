import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductCard from '@/lib/components/product-card'
import { collectionBySlug, productsByCollectionSlug } from '@/lib/data'

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const collection = collectionBySlug(slug)
  if (!collection) notFound()

  const items = productsByCollectionSlug(slug)
  const heroImage = collection.imagePaths[0] ?? items[0]?.imagePaths[0]

  return (
    <div>
      <section className="bg-[#191714] text-[#fbf5e8]">
        <div className="site-container grid gap-8 py-12 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="scroll-reveal">
            <Link href="/collections" className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a45f]">Collections</Link>
            <h1 className="mt-4 font-display text-5xl leading-tight sm:text-6xl">{collection.name}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#d8cdbd]">{collection.description}</p>
            <p className="mt-5 text-sm text-[#b7aa9a]">{items.length} source catalog pieces</p>
          </div>
          {heroImage && (
            <div className="scroll-reveal relative aspect-[16/10] overflow-hidden border border-[#5c5145] bg-[#f7f1e8]">
              <Image src={heroImage} alt={collection.name} fill sizes="(min-width: 1024px) 48vw, 100vw" className="scroll-image object-contain p-10" priority />
            </div>
          )}
        </div>
      </section>

      <section className="site-container section-rule py-12 sm:py-16">
        <div className="scroll-reveal mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b7353]">Catalog</p>
            <h2 className="mt-2 font-display text-4xl text-[#191714]">Available source entries</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7b5c27] hover:text-[#191714]">
            Search all
          </Link>
        </div>
        <div className="scroll-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
