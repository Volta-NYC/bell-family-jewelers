import { business, pages } from '@/lib/data'

export default function AboutPage() {
  const aboutPage = pages.find((page) => page.slug === 'about')

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-semibold">About Bell Family Jewelers</h1>
      <p className="text-zinc-300 max-w-3xl">{business.homepageCopy[1]}</p>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-3 text-zinc-300">
        <h2 className="text-xl text-zinc-100">From the Source Material</h2>
        {aboutPage?.contentPreview.slice(0, 8).map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  )
}
