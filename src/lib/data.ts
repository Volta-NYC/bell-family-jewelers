import productsData from '../../data/products.json'
import collectionsData from '../../data/collections.json'
import businessData from '../../data/business.json'
import pagesData from '../../data/pages.json'
import type { Business, Collection, Product, SitePage } from './types'

export const products = (productsData as Product[]).sort((a, b) => a.name.localeCompare(b.name))

export const collections = (collectionsData as Collection[])
  .filter((item) => item.productCount > 0)
  .sort((a, b) => b.productCount - a.productCount)

export const business = businessData as Business
export const pages = pagesData as SitePage[]

export const featuredCollections = collections.slice(0, 6)
export const featuredProducts = products.slice(0, 12)

export const productsByCollectionSlug = (slug: string) => {
  const collection = collections.find((item) => item.slug === slug)
  if (!collection) return []
  return products.filter((item) => item.category === collection.name)
}

export const productBySlug = (slug: string) => products.find((item) => item.slug === slug)

export const collectionBySlug = (slug: string) => collections.find((item) => item.slug === slug)
