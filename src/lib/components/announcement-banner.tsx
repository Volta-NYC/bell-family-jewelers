import { business } from '@/lib/data'

export default function AnnouncementBanner() {
  const sale = business.promotions.find((item) => item.includes('30 - 50%')) ?? business.promotions[0]
  const message = [sale, 'All online jewelry', 'In store only'].filter(Boolean).join(' / ')

  return (
    <div className="bg-[#191714] text-[#f8f1df] text-[11px] sm:text-xs tracking-[0.18em] uppercase text-center py-2.5 px-4">
      {message}
    </div>
  )
}
