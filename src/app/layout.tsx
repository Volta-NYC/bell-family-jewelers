import './globals.css'
import Navbar from '@/lib/components/navbar'
import Footer from '@/lib/components/footer'
import AnnouncementBanner from '@/lib/components/announcement-banner'

export const metadata = {
  title: 'Bell Family Jewelers | Bayside, NY',
  description: 'Luxury jewelry collections, custom design, repairs, and engagement rings at Bell Family Jewelers in Bayside, NY.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
        <AnnouncementBanner />
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
