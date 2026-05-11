export type Product = {
  name: string
  slug: string
  category: string
  subcategory: string | null
  price: number | null
  compareAtPrice: number | null
  availability: string
  badges: string[]
  fullDescription: string | null
  specifications: Record<string, string>
  materials: string[]
  variants: string[]
  imagePaths: string[]
  priceNote: string | null
  sourcePageUrl: string | null
  sourceMarkdownFile: string
  productPageUrl: string
}

export type Collection = {
  name: string
  slug: string
  description: string
  sourcePages: string[]
  imageUrls: string[]
  imagePaths: string[]
  productCount: number
}

export type Business = {
  name: string
  address: string
  phones: string[]
  emails: string[]
  hours: Record<string, string>
  social: Record<string, string>
  promotions: string[]
  homepageCopy: string[]
  services: string[]
  designers: { name: string; slug: string }[]
}

export type SitePage = {
  slug: string
  title: string
  sourceUrl: string
  sourceMarkdownFile: string
  headings: string[]
  contentPreview: string[]
  promotions: string[]
  mediaUrls: string[]
}
