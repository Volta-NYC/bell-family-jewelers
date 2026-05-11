import { products } from '@/lib/data'
import ShopControls from '@/lib/components/shop-controls'

export default function ShopPage() {
  return (
    <div className="site-container py-12 sm:py-16">
      <div className="scroll-reveal mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b7353]">Shop</p>
        <h1 className="mt-3 font-display text-5xl leading-tight text-[#191714] sm:text-6xl">Search the Bell catalog</h1>
        <p className="mt-5 text-lg leading-8 text-[#5c5145]">
          Browse the locally extracted product catalog by category, material, name, or style number. Prices were not present in the source product listings.
        </p>
      </div>
      <ShopControls products={products} />
    </div>
  )
}
