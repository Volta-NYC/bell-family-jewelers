import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { collectionBySlug, productBySlug } from '@/lib/data'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = productBySlug(slug)
  if (!product) notFound()

  const styleNumber = product.specifications?.styleNumber
  const collection = collectionBySlug(product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
  const image = product.imagePaths[0] ?? '/media/thumbnail-c885fd6789be.webp'
  const note = product.priceNote ?? 'inquire with store for pricing'

  return (
    <div>
      <section className="site-container grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="surface-card scroll-reveal border border-[#dfd4c4] bg-[#fbf8f2] p-4 luxury-shadow">
          <div className="relative aspect-square overflow-hidden bg-[#f2eadf]">
            <Image src={image} alt={product.name} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="scroll-image object-contain p-8 sm:p-12" />
          </div>
        </div>

        <div className="scroll-sticky lg:sticky lg:top-28 lg:self-start">
          <div className="border-b border-[#dfd4c4] pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b7353]">{product.category}</p>
            <h1 className="mt-3 font-display text-5xl leading-tight text-[#191714] sm:text-6xl">{product.name}</h1>
            {product.subcategory && <p className="mt-4 text-lg text-[#5c5145]">{product.subcategory}</p>}
          </div>

          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div className="surface-card scroll-card border border-[#dfd4c4] bg-[#fbf8f2] p-4">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b7353]">Style</dt>
              <dd className="mt-2 text-[#191714]">{styleNumber ?? 'Not specified'}</dd>
            </div>
            <div className="surface-card scroll-card border border-[#dfd4c4] bg-[#fbf8f2] p-4">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b7353]">Pricing</dt>
              <dd className="mt-2 text-[#191714]">{note}</dd>
            </div>
            <div className="surface-card scroll-card border border-[#dfd4c4] bg-[#fbf8f2] p-4">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b7353]">Availability</dt>
              <dd className="mt-2 text-[#191714]">{product.availability === 'not_specified' ? 'Not specified in source' : product.availability}</dd>
            </div>
            <div className="surface-card scroll-card border border-[#dfd4c4] bg-[#fbf8f2] p-4">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b7353]">Source</dt>
              <dd className="mt-2 truncate text-[#191714]">{product.sourceMarkdownFile}</dd>
            </div>
          </dl>

          {(product.materials.length > 0 || product.variants.length > 0) && (
            <div className="surface-card scroll-card mt-6 border border-[#dfd4c4] bg-[#fbf8f2] p-5">
              <h2 className="font-display text-2xl">Extracted details</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {[...product.materials, ...product.variants].map((detail) => (
                  <span key={detail} className="border border-[#d8cbbb] px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-[#5c5145]">
                    {detail}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="scroll-card mt-6 border border-[#191714] bg-[#191714] p-5 text-[#fbf5e8]">
            <h2 className="font-display text-3xl">Cart preview</h2>
            <div className="mt-4 space-y-3 text-sm text-[#d8cdbd]">
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                <span>{product.name}</span>
                <span>{styleNumber ? `#${styleNumber}` : ''}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                <span>Price</span>
                <span>{note}</span>
              </div>
              <p>Checkout is handled by contacting the store for assisted purchase.</p>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="focus-ring inline-flex justify-center bg-[#c9a45f] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#17130f]">
                Request This Piece
              </Link>
              {collection && (
                <Link href={`/collections/${collection.slug}`} className="focus-ring inline-flex justify-center border border-[#8d7a5d] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#fbf5e8]">
                  Back to Collection
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
