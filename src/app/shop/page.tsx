import { products } from '@/lib/data'
import ShopControls from '@/lib/components/shop-controls'

export default function ShopPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold">Shop Jewelry</h1>
      <p className="text-zinc-300">Search and filter products from locally generated Bell Family Jewelers datasets.</p>
      <ShopControls products={products} />
    </div>
  )
}
