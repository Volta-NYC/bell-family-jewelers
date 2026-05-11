import Image from 'next/image'
import Link from 'next/link'
import { educationPages } from '@/lib/data'

export default function EducationPage() {
  return (
    <div className="site-container py-12 sm:py-16">
      <div className="mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b7353]">Education</p>
        <h1 className="mt-3 font-display text-5xl leading-tight text-[#191714] sm:text-6xl">Guides from the original site</h1>
        <p className="mt-5 text-lg leading-8 text-[#5c5145]">
          Diamond, gemstone, metal, pearl, ring-size, and necklace resources extracted from the source markdown.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {educationPages.map((page) => {
          const image = page.mediaPaths.find((path) => !path.includes('4057345') && !path.includes('e1aa082'))
          return (
            <Link key={page.slug} href={`/education/${page.slug}`} className="group overflow-hidden border border-[#dfd4c4] bg-[#fbf8f2] transition-all hover:-translate-y-1 hover:border-[#c9a45f]">
              <div className="relative aspect-[16/10] bg-[#efe5d6]">
                {image ? (
                  <Image src={image} alt={page.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-3xl text-[#8b7353]">{page.title}</div>
                )}
              </div>
              <div className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b7353]">Guide</p>
                <h2 className="mt-2 font-display text-3xl text-[#191714]">{page.title}</h2>
                {page.contentPreview[0] && <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6c6258]">{page.contentPreview[0]}</p>}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
