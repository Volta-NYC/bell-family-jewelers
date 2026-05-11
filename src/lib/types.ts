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
  gemstoneDetails?: string[]
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
  type: string
  description: string
  subcategories: string[]
  sourcePages: string[]
  sourceMarkdownFiles: string[]
  imagePaths: string[]
  productCount: number
}

export type Service = {
  name: string
  slug: string
  description: string | null
}

export type Designer = {
  name: string
  slug: string
  sourcePageUrl: string | null
  sourceMarkdownFile: string | null
  description: string | null
  imagePaths: string[]
}

export type Business = {
  name: string
  address: string
  phones: string[]
  emails: string[]
  hours: Record<string, string>
  hoursSources: { source: string; hours: Record<string, string> }[]
  social: Record<string, string>
  promotions: string[]
  homepageCopy: string[]
  about: string[]
  services: Service[]
  policies: string[]
  designers: Designer[]
}

export type SitePage = {
  slug: string
  title: string
  sourceUrl: string
  sourceMarkdownFile: string
  type: string
  headings: string[]
  contentPreview: string[]
  promotions: string[]
  mediaUrls: string[]
  mediaPaths: string[]
  productCount: number
}
