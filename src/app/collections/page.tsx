import { collections } from '@/lib/data'
import CollectionCard from '@/lib/components/collection-card'

export default function CollectionsPage() {
  return (
    <div className="site-container py-12 sm:py-16">
      <div className="mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b7353]">Collections</p>
        <h1 className="mt-3 font-display text-5xl leading-tight text-[#191714] sm:text-6xl">Fine jewelry categories</h1>
        <p className="mt-5 text-lg leading-8 text-[#5c5145]">
          Six product categories were present in the scraped catalog pages, each with fifteen extracted source products.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <CollectionCard key={collection.slug} collection={collection} />
        ))}
      </div>
    </div>
  )
}
