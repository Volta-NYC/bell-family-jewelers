import Image from 'next/image'
import Link from 'next/link'
import { featuredProducts } from '@/lib/data'

export default function CartPage() {
  const previewItems = featuredProducts.slice(0, 3)

  return (
    <div className="site-container py-12 sm:py-16">
      <div className="scroll-reveal mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b7353]">Cart Preview</p>
        <h1 className="mt-3 font-display text-5xl leading-tight text-[#191714] sm:text-6xl">Assisted checkout</h1>
        <p className="mt-5 text-lg leading-8 text-[#5c5145]">
          The scrape did not include a checkout flow. This cart-style view keeps selected pieces organized for an in-store or phone request.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="scroll-grid space-y-4">
          {previewItems.map((product) => (
            <article key={product.slug} className="surface-card scroll-card grid grid-cols-[112px_1fr] gap-4 border border-[#dfd4c4] bg-[#fbf8f2] p-4 sm:grid-cols-[150px_1fr_auto] sm:items-center">
              <div className="relative aspect-square bg-[#f2eadf]">
                <Image src={product.imagePaths[0]} alt={product.name} fill sizes="150px" className="object-contain p-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b7353]">{product.category}</p>
                <h2 className="mt-2 font-display text-2xl text-[#191714]">{product.name}</h2>
                <p className="mt-2 text-sm text-[#6c6258]">Style #{product.specifications?.styleNumber}</p>
              </div>
              <p className="col-span-2 text-sm text-[#5c5145] sm:col-span-1">{product.priceNote}</p>
            </article>
          ))}
        </div>

        <aside className="scroll-sticky border border-[#191714] bg-[#191714] p-6 text-[#fbf5e8] lg:self-start">
          <h2 className="font-display text-3xl">Request summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between border-b border-white/10 pb-3">
              <dt className="text-[#b7aa9a]">Items</dt>
              <dd>{previewItems.length}</dd>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-3">
              <dt className="text-[#b7aa9a]">Pricing</dt>
              <dd>Inquire with store</dd>
            </div>
          </dl>
          <Link href="/contact" className="focus-ring mt-6 inline-flex w-full justify-center bg-[#c9a45f] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#17130f]">
            Contact Store
          </Link>
        </aside>
      </div>
    </div>
  )
}
