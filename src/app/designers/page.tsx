import Link from 'next/link'
import { business, pageBySlug } from '@/lib/data'

export default function DesignersPage() {
  return (
    <div className="site-container py-12 sm:py-16">
      <div className="scroll-reveal mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b7353]">Designers</p>
        <h1 className="mt-3 font-display text-5xl leading-tight text-[#191714] sm:text-6xl">Brands from the source site</h1>
        <p className="mt-5 text-lg leading-8 text-[#5c5145]">
          These designer and brand names were listed in the scraped Bell Family Jewelers navigation.
        </p>
      </div>
      <div className="scroll-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {business.designers.map((designer) => {
          const page = pageBySlug(designer.slug)
          const hasCopy = Boolean(page?.contentPreview?.length)
          return (
            <Link key={designer.slug} href={`/designers/${designer.slug}`} className="surface-card scroll-card group border border-[#dfd4c4] bg-[#fbf8f2] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#c9a45f]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b7353]">Designer</p>
              <h2 className="mt-3 font-display text-3xl text-[#191714]">{designer.name}</h2>
              <p className="mt-4 text-sm leading-6 text-[#6c6258]">
                {hasCopy ? 'Source page content is available.' : 'No expanded brand copy was captured in the source markdown.'}
              </p>
              <span className="mt-6 inline-flex text-sm font-semibold uppercase tracking-[0.16em] text-[#7b5c27] group-hover:text-[#191714]">View source profile</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
