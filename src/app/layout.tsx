import './globals.css'
import Navbar from '@/lib/components/navbar'
import Footer from '@/lib/components/footer'
import AnnouncementBanner from '@/lib/components/announcement-banner'
import ScrollMotion from '@/lib/components/scroll-motion'

export const metadata = {
  title: 'Bell Family Jewelers | Bayside, NY',
  description: 'Bell Family Jewelers in Bayside, NY: engagement rings, wedding bands, fine jewelry, repair, appraisal, and custom design services.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col bg-[#f6f1e8] text-[#191714]">
        <ScrollMotion />
        <AnnouncementBanner />
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
