import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { pageBySlug } from '@/lib/data'

export default async function EducationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = pageBySlug(slug)
  if (!page || page.type !== 'education') notFound()

  const heroImage = page.mediaPaths.find((path) => !path.includes('4057345') && !path.includes('e1aa082'))

  return (
    <div>
      <section className="bg-[#191714] text-[#fbf5e8]">
        <div className="site-container grid gap-8 py-12 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="scroll-reveal">
            <Link href="/education" className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a45f]">Education</Link>
            <h1 className="mt-4 font-display text-5xl leading-tight sm:text-6xl">{page.title}</h1>
          </div>
          {heroImage && (
            <div className="scroll-reveal relative aspect-[16/9] overflow-hidden border border-[#5c5145] bg-[#fbf8f2]">
              <Image src={heroImage} alt={page.title} fill priority sizes="(min-width: 1024px) 52vw, 100vw" className="scroll-image object-cover" />
            </div>
          )}
        </div>
      </section>

      <article className="site-container scroll-reveal max-w-4xl py-12 sm:py-16">
        <div className="space-y-6">
          {page.contentPreview.slice(0, 34).map((line) => {
            const looksHeading = line.length < 46 && !line.endsWith('.') && !line.includes(',')
            return looksHeading ? (
              <h2 key={line} className="pt-4 font-display text-3xl text-[#191714]">{line}</h2>
            ) : (
              <p key={line} className="text-lg leading-9 text-[#4d463e]">{line}</p>
            )
          })}
        </div>
        <div className="mt-10 border-t border-[#dfd4c4] pt-6 text-xs uppercase tracking-[0.14em] text-[#8b7353]">
          Source: {page.sourceMarkdownFile}
        </div>
      </article>
    </div>
  )
}
