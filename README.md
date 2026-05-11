# Bell Family Jewelers (Luxury Redesign)

A full Next.js + TypeScript + Tailwind rebuild of Bell Family Jewelers using scraped markdown source files in `raw messy data/`.

## What this project includes

- Premium, mobile-first redesign
- Data-driven pages from local JSON datasets
- Local media references via `/public/media/`
- Search + filtering on `/shop`
- Dynamic collection and product routes
- Contact/appointment form UI
- Services and designer pages

## Data pipeline

Source markdown files are parsed from:

- `raw messy data/**/*.md`

Generated outputs:

- `data/business.json`
- `data/collections.json`
- `data/pages.json`
- `data/products.json`
- `data/media-map.json`

Run the pipeline:

```bash
npm run generate:data
```

Note: if some external media hosts are unreachable from the execution environment, deterministic local fallback images are generated so all rendered pages still reference local media paths.

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```
