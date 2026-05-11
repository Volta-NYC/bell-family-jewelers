import Image from 'next/image'
import Link from 'next/link'
import { business, featuredCollections, featuredProducts, homePage } from '@/lib/data'
import CollectionCard from '@/lib/components/collection-card'
import ProductCard from '@/lib/components/product-card'
import AppointmentForm from '@/lib/components/appointment-form'

const heroImages = [
  homePage?.mediaPaths[4],
  homePage?.mediaPaths[5],
  featuredProducts[0]?.imagePaths[0],
].filter(Boolean) as string[]

export default function HomePage() {
  const aboutLine = business.about[0]
  const services = business.services.slice(0, 4)

  return (
    <div>
      <section className="bg-[#191714] text-[#fbf5e8]">
        <div className="site-container grid min-h-[calc(100svh-130px)] gap-10 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9a45f]">Bayside, New York</p>
            <h1 className="mt-5 font-display text-6xl leading-[0.94] tracking-normal sm:text-7xl lg:text-8xl">
              Bell Family Jewelers
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#d8cdbd]">
              {business.homepageCopy[0]}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="focus-ring inline-flex items-center justify-center bg-[#c9a45f] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#17130f] transition-colors hover:bg-[#e3c783]"
              >
                Shop Jewelry
              </Link>
              <Link
                href="/contact"
                className="focus-ring inline-flex items-center justify-center border border-[#8d7a5d] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#fbf5e8] transition-colors hover:border-[#c9a45f]"
              >
                Book Appointment
              </Link>
            </div>
            <dl className="mt-10 grid max-w-xl grid-cols-3 border-y border-white/10 py-5 text-sm">
              <div>
                <dt className="text-[#8f8271]">Catalog</dt>
                <dd className="mt-1 font-display text-2xl text-[#fbf5e8]">90</dd>
              </div>
              <div>
                <dt className="text-[#8f8271]">Collections</dt>
                <dd className="mt-1 font-display text-2xl text-[#fbf5e8]">6</dd>
              </div>
              <div>
                <dt className="text-[#8f8271]">Phone</dt>
                <dd className="mt-1 text-[#fbf5e8]">{business.phones[0]}</dd>
              </div>
            </dl>
          </div>

          <div className="relative min-h-[440px] lg:min-h-[620px]">
            <div className="absolute right-0 top-0 h-[72%] w-[74%] overflow-hidden border border-[#5c5145] bg-[#f7f1e8] luxury-shadow">
              <Image
                src={heroImages[0]}
                alt="Engagement ring from Bell Family Jewelers source imagery"
                fill
                priority
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-contain p-8"
              />
            </div>
            <div className="absolute bottom-8 left-0 h-[52%] w-[56%] overflow-hidden border border-[#5c5145] bg-[#f7f1e8] shadow-[0_24px_70px_rgb(0_0_0_/_0.35)]">
              <Image
                src={heroImages[1]}
                alt="Fine jewelry source imagery"
                fill
                priority
                sizes="(min-width: 1024px) 32vw, 86vw"
                className="object-contain p-6"
              />
            </div>
            <div className="absolute bottom-0 right-8 w-48 border border-[#c9a45f]/50 bg-[#211d18]/92 p-5 backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#c9a45f]">Source offer</p>
              <p className="mt-2 font-display text-3xl">30 - 50% OFF</p>
              <p className="mt-2 text-xs leading-5 text-[#b7aa9a]">All online jewelry / in store only</p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-14 sm:py-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b7353]">Collections</p>
            <h2 className="mt-2 font-display text-4xl text-[#191714] sm:text-5xl">Shop by occasion</h2>
          </div>
          <Link href="/collections" className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7b5c27] hover:text-[#191714]">
            View all collections
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCollections.map((collection) => (
            <CollectionCard key={collection.slug} collection={collection} />
          ))}
        </div>
      </section>

      <section className="bg-[#efe5d6] py-14 sm:py-20">
        <div className="site-container">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b7353]">Selected Pieces</p>
              <h2 className="mt-2 font-display text-4xl text-[#191714] sm:text-5xl">From the local catalog</h2>
            </div>
            <Link href="/shop" className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7b5c27] hover:text-[#191714]">
              Search all products
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.slug} product={product} priority />
            ))}
          </div>
        </div>
      </section>

      <section className="site-container grid gap-8 py-14 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b7353]">Services</p>
          <h2 className="mt-2 font-display text-4xl leading-tight text-[#191714] sm:text-5xl">Jewelry care, repair, and custom design.</h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#5c5145]">{business.homepageCopy[1]}</p>
          <Link
            href="/services"
            className="focus-ring mt-8 inline-flex bg-[#191714] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#fbf5e8] transition-colors hover:bg-[#3a3024]"
          >
            Explore services
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <article key={service.slug} className="border border-[#dfd4c4] bg-[#fbf8f2] p-6">
              <h3 className="font-display text-2xl text-[#191714]">{service.name}</h3>
              {service.description && <p className="mt-3 text-sm leading-6 text-[#6c6258]">{service.description}</p>}
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#191714] py-14 text-[#fbf5e8] sm:py-20">
        <div className="site-container grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a45f]">About</p>
            <h2 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">A family jewelry story in Bayside.</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#d8cdbd]">{aboutLine}</p>
            <Link href="/about" className="mt-8 inline-flex text-sm font-semibold uppercase tracking-[0.16em] text-[#c9a45f] hover:text-[#fbf5e8]">
              Read the story
            </Link>
          </div>
          <AppointmentForm />
        </div>
      </section>
    </div>
  )
}
