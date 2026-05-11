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

const categoryPriority = ['Engagement Rings', 'Wedding Bands', 'Color Rings', 'Earrings', 'Pendants', 'Bracelets']
const sourcePlaceholderMarkers = ['thumbnail-', 'transparent-', 'svg-', 'default-pin', 'icon-', 'pager-arrow', 'i-desc-arrow', 'rotatingimage']

const hasDisplayImage = (product: Product) =>
  product.imagePaths.some((path) => !sourcePlaceholderMarkers.some((marker) => path.toLowerCase().includes(marker)))

const displayFirst = (items: Product[]) =>
  [...items].sort((a, b) => Number(hasDisplayImage(b)) - Number(hasDisplayImage(a)) || a.name.localeCompare(b.name))

export const featuredCollections = [...collections].sort((a, b) => {
  const aIndex = categoryPriority.indexOf(a.name)
  const bIndex = categoryPriority.indexOf(b.name)
  return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex)
})

export const featuredProducts = [
  ...displayFirst(products.filter((product) => product.category === 'Engagement Rings')).slice(0, 4),
  ...displayFirst(products.filter((product) => product.category === 'Wedding Bands')).slice(0, 2),
  ...displayFirst(products.filter((product) => product.category === 'Bracelets')).slice(0, 2),
  ...displayFirst(products.filter((product) => product.category === 'Earrings')).slice(0, 2),
  ...displayFirst(products.filter((product) => product.category === 'Pendants')).slice(0, 2),
]

export const productsByCollectionSlug = (slug: string) => {
  const collection = collections.find((item) => item.slug === slug)
  if (!collection) return []
  return displayFirst(products.filter((item) => item.category === collection.name))
}

export const productBySlug = (slug: string) => products.find((item) => item.slug === slug)

export const collectionBySlug = (slug: string) => collections.find((item) => item.slug === slug)

export const pageBySlug = (slug: string) => pages.find((item) => item.slug === slug)

export const pagesByType = (type: string) => pages.filter((item) => item.type === type)

export const educationPages = pagesByType('education').sort((a, b) => a.title.localeCompare(b.title))

export const designerBySlug = (slug: string) => business.designers.find((item) => item.slug === slug)

export const homePage = pageBySlug('home')
