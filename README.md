# Bell Family Jewelers Luxury Redesign

A complete Next.js, TypeScript, and Tailwind rebuild of Bell Family Jewelers from the scraped markdown source material in `raw messy data/`.

The site is data-driven, mobile-first, and does not render media from the original website or CDN. All product, collection, service, designer, business, and policy content comes from the local markdown scrape.

## Included

- Luxury responsive homepage with announcement banner, editorial hero, featured collections, selected jewelry, services, and appointment flow
- Collection/category pages and dynamic product detail pages
- Search, category, material, and sort controls on `/shop`
- About, contact, services, designers, education, and assisted cart-style pages
- Local normalized datasets in `data/`
- Downloaded, deduplicated, optimized local media in `public/media/`
- Accessible semantic layout, keyboard-friendly controls, and responsive navigation

## Data Pipeline

Source:

```text
raw messy data/**/*.md
```

Generated files:

```text
data/business.json
data/collections.json
data/pages.json
data/products.json
data/media-map.json
```

Regenerate data and media:

```bash
npm run generate:data
```

Current extraction summary:

- 43 markdown files processed
- 90 products extracted
- 6 product collections generated
- 977 media source records mapped
- 194 optimized local media files written
- 0 missing media fallbacks in the current run

## Development

```bash
npm install
npm run generate:data
npm run dev
```

Open `http://localhost:3000`.

## Production Check

```bash
npm run lint
npm run build
npm run start
```

## Key Routes

- `/`
- `/shop`
- `/collections`
- `/collections/[slug]`
- `/products/[slug]`
- `/services`
- `/designers`
- `/education`
- `/about`
- `/contact`
- `/cart`
