import { products } from '@/lib/data'
import ProductCard from '@/lib/components/product-card'

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold">All Products</h1>
      <p className="text-zinc-300">Browse all jewelry products from Bell Family Jewelers.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={`${product.slug}-${product.sourceMarkdownFile}`} product={product} />
        ))}
      </div>
    </div>
  )
}
