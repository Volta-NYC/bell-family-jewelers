import { notFound } from 'next/navigation'
import { business, pages } from '@/lib/data'

export default async function DesignerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const designer = business.designers.find((item) => item.slug === slug)
  if (!designer) notFound()

  const sourcePage = pages.find((page) => page.slug === slug)

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold">{designer.name}</h1>
      <p className="text-zinc-300">Brand profile extracted from available source pages.</p>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-3 text-zinc-300">
        {(sourcePage?.contentPreview ?? ['No expanded brand copy was captured in the source markdown.']).slice(0, 8).map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  )
}
