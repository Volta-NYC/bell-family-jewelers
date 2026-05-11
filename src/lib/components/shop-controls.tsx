'use client'

import { useMemo, useState } from 'react'
import type { Product } from '@/lib/types'
import ProductCard from './product-card'

export default function ShopControls({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category))).sort()],
    [products],
  )

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category
      const q = query.toLowerCase().trim()
      const matchesQuery =
        q.length === 0 ||
        product.name.toLowerCase().includes(q) ||
        (product.specifications?.styleNumber ?? '').toLowerCase().includes(q)

      return matchesCategory && matchesQuery
    })
  }, [products, category, query])

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="sm:col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm"
          placeholder="Search by name or style number"
          aria-label="Search products"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm"
          aria-label="Filter by category"
        >
          {categories.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <p className="text-sm text-zinc-400">Showing {filtered.length} of {products.length} products</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={`${product.slug}-${product.sourceMarkdownFile}`} product={product} />
        ))}
      </div>
    </div>
  )
}
