import Hero from '@/components/sections/Hero';
import Highlights from '@/components/sections/Highlights';
import GlowButton from '@/components/ui/GlowButton';
import CarCard from '@/components/sections/CarCard';
import { prisma } from '@/lib/prisma';
import { enrichVehicle } from '@/lib/vehicles';
import PageBackground from '@/components/layout/PageBackground';

export const revalidate = 0;
type Slide = { src: string; alt: string };

const HOME_HERO_SLIDES: Slide[] = [
  {
    src: 'https://lh3.googleusercontent.com/p/AF1QipPEuQJ4gtwXEfzXPdjF5puoZ1JxospM5dZblV6j=s1360-w1360-h1020-rw',
    alt: 'Ferrari SF90 parked inside a dimly lit concrete atrium'
  },
  {
    src: 'https://lh3.googleusercontent.com/p/AF1QipNhyV71YbqktMn1_nAa5fxxIKvxnmxhE-eclpKS=s1360-w1360-h1020-rw',
    alt: 'Bentley interior with quilted leather and illuminated console'
  },
  {
    src: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqVorWJzX_XPFW9rlHFiYc7nRba9CucvTT-007CCfKzlK7ieXHV_K4K0gDFvL-a2TXtmWReDK8SgvY4p60NBp22EscyF26kdAjP59dBAQfOIGbXgQzF5MfwIXcpdPYjnujCiIw=s1360-w1360-h1020-rw',
    alt: 'Lamborghini Aventador accelerating through a tunnel at night'
  }
] as const;

export default async function HomePage() {
  const featuredVehicles = await prisma.vehicle.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
    take: 8
  });
  const showroomVehicles = featuredVehicles.map(enrichVehicle);

  return (
    <>
      <PageBackground page="home" />
      <Hero slides={HOME_HERO_SLIDES} />
      <Highlights />
      <section className="section-padding">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 text-center">
            <p className="text-xs uppercase tracking-[0.55em] text-silver/60">Featured Fleet</p>
            <h2 className="font-heading text-4xl text-white md:text-5xl">Showroom Highlights</h2>
            <p className="text-sm text-silver/70">
              A curated glimpse of the executive vehicles currently in the spotlight. Discover the craftsmanship, provenance and
              cinematic presentation awaiting inside the showroom.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {showroomVehicles.slice(0, 6).map((vehicle, index) => (
              <CarCard key={vehicle.id} vehicle={vehicle} index={index} />
            ))}
            {showroomVehicles.length === 0 && (
              <div className="sm:col-span-2 xl:col-span-3 surface-panel rounded-3xl p-8 text-sm text-silver/70">
                Feature vehicles from the dashboard to elevate this showcase on the homepage.
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-transparent p-12 text-center shadow-innerGlow">
          <p className="text-xs uppercase tracking-[0.5em] text-silver/60">Private Lounge</p>
          <h2 className="mt-4 font-heading text-4xl text-white">Reserve Your Bespoke Consultation</h2>
          <p className="mt-6 text-sm text-silver/70">
            Connect directly with our executive liaison team for acquisition sourcing, discreet trade-ins, or to curate a
            tailor-made driving experience. Every enquiry is handled with absolute confidentiality.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <GlowButton href="/test-drive" className="w-full sm:w-auto">
              Book Test Drive
            </GlowButton>
            <GlowButton href="mailto:liaison@iliadis.gr" variant="secondary" className="w-full sm:w-auto">
              Email Our Curators
            </GlowButton>
          </div>
        </div>
      </section>
    </>
  );
}
