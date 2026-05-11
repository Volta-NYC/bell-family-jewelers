import Link from 'next/link'
import { notFound } from 'next/navigation'
import { productBySlug } from '@/lib/data'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = productBySlug(slug)
  if (!product) notFound()

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <img
        src={product.imagePaths[0] ?? '/media/fallback-generic.png'}
        alt={product.name}
        className="w-full h-[420px] object-cover rounded-2xl border border-zinc-800 bg-zinc-900"
      />

      <div className="space-y-4">
        <p className="uppercase tracking-[0.18em] text-xs text-amber-300">{product.category}</p>
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <p className="text-zinc-300">{product.priceNote ?? 'Inquire with store for pricing'}</p>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm space-y-1 text-zinc-300">
          <p><span className="text-zinc-100">Style Number:</span> {product.specifications?.styleNumber ?? 'N/A'}</p>
          <p><span className="text-zinc-100">Availability:</span> {product.availability}</p>
          <p><span className="text-zinc-100">Source:</span> {product.sourceMarkdownFile}</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 space-y-3">
          <h2 className="text-lg">Cart Preview</h2>
          <div className="text-sm text-zinc-300 space-y-1">
            <p>1 × {product.name}</p>
            <p>Price: {product.priceNote ?? 'Inquire with store for pricing'}</p>
            <p>Checkout: Contact store for assisted purchase.</p>
          </div>
          <Link href="/contact" className="inline-flex px-5 py-2.5 rounded-full bg-amber-300 text-zinc-900 text-sm font-medium">
            Request This Piece
          </Link>
        </div>
      </div>
    </div>
  )
}
