import { products } from '@/lib/data'
import ShopControls from '@/lib/components/shop-controls'

export default function ProductsPage() {
  return (
    <div className="site-container py-12 sm:py-16">
      <div className="mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b7353]">Products</p>
        <h1 className="mt-3 font-display text-5xl leading-tight text-[#191714] sm:text-6xl">All products</h1>
        <p className="mt-5 text-lg leading-8 text-[#5c5145]">
          All product entries are generated from the local markdown source and rendered with local media.
        </p>
      </div>
      <ShopControls products={products} />
    </div>
  )
}
