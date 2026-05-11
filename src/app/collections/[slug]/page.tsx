import { notFound } from 'next/navigation'
import ProductCard from '@/lib/components/product-card'
import { collectionBySlug, productsByCollectionSlug } from '@/lib/data'

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const collection = collectionBySlug(slug)
  if (!collection) notFound()

  const items = productsByCollectionSlug(slug)

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold">{collection.name}</h1>
      <p className="text-zinc-300">{collection.description}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={`${product.slug}-${product.sourceMarkdownFile}`} product={product} />
        ))}
      </div>
    </div>
  )
}
