'use client'

import { useMemo, useState } from 'react'
import type { Product } from '@/lib/types'
import ProductCard from './product-card'

export default function ShopControls({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [material, setMaterial] = useState('All')
  const [sort, setSort] = useState('category')

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category))).sort()],
    [products],
  )

  const materials = useMemo(
    () => ['All', ...Array.from(new Set(products.flatMap((p) => p.materials))).sort()],
    [products],
  )

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category
      const matchesMaterial = material === 'All' || product.materials.includes(material)
      const q = query.toLowerCase().trim()
      const matchesQuery =
        q.length === 0 ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        (product.subcategory ?? '').toLowerCase().includes(q) ||
        (product.specifications?.styleNumber ?? '').toLowerCase().includes(q)

      return matchesCategory && matchesMaterial && matchesQuery
    })

    return result.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'style') return (a.specifications?.styleNumber ?? '').localeCompare(b.specifications?.styleNumber ?? '')
      return a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
    })
  }, [products, category, material, query, sort])

  const clearFilters = () => {
    setQuery('')
    setCategory('All')
    setMaterial('All')
    setSort('category')
  }

  return (
    <div className="space-y-8">
      <div className="border border-[#dfd4c4] bg-[#fbf8f2] p-4 luxury-shadow sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b7353]">Search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="focus-ring w-full border border-[#d8cbbb] bg-white px-4 py-3 text-sm text-[#191714] placeholder:text-[#8f8271]"
              placeholder="Name, category, or style number"
              aria-label="Search products"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b7353]">Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="focus-ring w-full border border-[#d8cbbb] bg-white px-4 py-3 text-sm text-[#191714]"
              aria-label="Filter by category"
            >
              {categories.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b7353]">Material</span>
            <select
              value={material}
              onChange={(event) => setMaterial(event.target.value)}
              className="focus-ring w-full border border-[#d8cbbb] bg-white px-4 py-3 text-sm text-[#191714]"
              aria-label="Filter by material"
            >
              {materials.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b7353]">Sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="focus-ring w-full border border-[#d8cbbb] bg-white px-4 py-3 text-sm text-[#191714]"
              aria-label="Sort products"
            >
              <option value="category">Category</option>
              <option value="name">Name</option>
              <option value="style">Style number</option>
            </select>
          </label>

          <button
            type="button"
            onClick={clearFilters}
            className="focus-ring self-end border border-[#191714] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#191714] transition-colors hover:bg-[#191714] hover:text-[#fbf5e8]"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-b border-[#dfd4c4] pb-4 sm:flex-row sm:items-end sm:justify-between">
        <p aria-live="polite" className="font-display text-3xl text-[#191714]">{filtered.length} pieces</p>
        <p className="text-sm text-[#6c6258]">Showing {filtered.length} of {products.length} source catalog products</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={`${product.slug}-${product.sourceMarkdownFile}`} product={product} />
        ))}
      </div>
    </div>
  )
}
