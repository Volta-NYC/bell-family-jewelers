import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { designerBySlug, pageBySlug } from '@/lib/data'

export default async function DesignerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const designer = designerBySlug(slug)
  if (!designer) notFound()

  const sourcePage = pageBySlug(slug)
  const image = sourcePage?.mediaPaths.find((path) => !path.includes('4057345') && !path.includes('e1aa082'))
  const copy = sourcePage?.contentPreview?.filter((line) => !line.includes('blocked')) ?? []

  return (
    <div className="site-container py-12 sm:py-16">
      <Link href="/designers" className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b7353]">Designers</Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <h1 className="font-display text-5xl leading-tight text-[#191714] sm:text-6xl">{designer.name}</h1>
          <p className="mt-5 text-lg leading-8 text-[#5c5145]">
            Brand profile generated only from the local source markdown for this page.
          </p>
          <dl className="mt-8 space-y-3 border border-[#dfd4c4] bg-[#fbf8f2] p-5 text-sm">
            <div>
              <dt className="text-[#8f8271]">Source page</dt>
              <dd className="mt-1 break-words text-[#191714]">{sourcePage?.sourceUrl ?? 'Not captured'}</dd>
            </div>
            <div>
              <dt className="text-[#8f8271]">Source markdown</dt>
              <dd className="mt-1 break-words text-[#191714]">{sourcePage?.sourceMarkdownFile ?? designer.sourceMarkdownFile ?? 'Not captured'}</dd>
            </div>
          </dl>
        </section>

        <section className="space-y-5">
          {image && (
            <div className="relative aspect-[16/10] border border-[#dfd4c4] bg-[#fbf8f2]">
              <Image src={image} alt={designer.name} fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-contain p-8" />
            </div>
          )}
          <div className="border border-[#dfd4c4] bg-[#fbf8f2] p-6">
            {copy.length > 0 ? (
              <div className="space-y-4">
                {copy.slice(0, 8).map((line) => (
                  <p key={line} className="text-sm leading-7 text-[#5c5145]">{line}</p>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-7 text-[#5c5145]">No expanded brand copy was captured in the source markdown.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
