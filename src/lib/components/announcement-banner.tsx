import { business } from '@/lib/data'

export default function AnnouncementBanner() {
  const message = business.promotions[0] ?? 'Discover Bell Family Jewelers collections.'

  return (
    <div className="bg-amber-100 text-amber-950 text-xs sm:text-sm tracking-wide text-center py-2 px-4 border-b border-amber-200">
      {message}
    </div>
  )
}
