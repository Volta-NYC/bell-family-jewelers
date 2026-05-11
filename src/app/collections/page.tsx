import { collections } from '@/lib/data'
import CollectionCard from '@/lib/components/collection-card'

export default function CollectionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold">Collections</h1>
      <p className="text-zinc-300">Explore Bell Family Jewelers categories extracted from the original catalog source.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <CollectionCard key={collection.slug} collection={collection} />
        ))}
      </div>
    </div>
  )
}
