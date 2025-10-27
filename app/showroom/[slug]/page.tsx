export const runtime = 'nodejs';
export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
import GlowButton from '@/components/ui/GlowButton';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { enrichVehicle, formatCurrency } from '@/lib/vehicles';
import VehicleGallery from '@/components/sections/VehicleGallery';
import LuxAudioPlayer from '@/components/ui/LuxAudioPlayer';
import VehicleEnquiryForm from '@/components/sections/VehicleEnquiryForm';
import PageBackground from '@/components/layout/PageBackground';
import CarCard from '@/components/sections/CarCard';
import { getBrandLogo } from '@/lib/brands';
import Image from 'next/image';

type Props = {
  params: { slug: string };
};


// export async function generateStaticParams() {
//   const vehicles = await prisma.vehicle.findMany({ select: { slug: true } });
//   return vehicles.map((vehicle) => ({ slug: vehicle.slug }));
// }


export async function generateMetadata({ params }: Props) {
  const vehicle = await prisma.vehicle.findUnique({ where: { slug: params.slug } });
  if (!vehicle) return {};
  const showroomVehicle = enrichVehicle(vehicle);
  return {
    title: `${showroomVehicle.title} | Digital Showroom`,
    description: showroomVehicle.description ?? undefined,
    openGraph: {
      title: showroomVehicle.title,
      description: showroomVehicle.description ?? undefined,
      images: [{ url: showroomVehicle.primaryImage, width: 1200, height: 675, alt: showroomVehicle.title }]
    }
  };
}

export default async function CarDetailsPage({ params }: Props) {
  const vehicle = await prisma.vehicle.findUnique({ where: { slug: params.slug } });
  if (!vehicle) {
    return notFound();
  }

  const showroomVehicle = enrichVehicle(vehicle);
  const relatedVehiclesRaw = await prisma.vehicle.findMany({
    where: {
      id: { not: showroomVehicle.id },
      OR: [{ make: showroomVehicle.make }, { body: showroomVehicle.body }]
    },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    take: 6
  });
  const relatedVehicles = relatedVehiclesRaw.map(enrichVehicle);
  const makeLogo = getBrandLogo(showroomVehicle.make);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: showroomVehicle.title,
    brand: showroomVehicle.make,
    model: showroomVehicle.model,
    vehicleEngine: {
      '@type': 'EngineSpecification',
      enginePower: `${showroomVehicle.hp} hp`,
      fuelType: showroomVehicle.fuel
    },
    vehicleTransmission: showroomVehicle.transmission,
    mileageFromOdometer: showroomVehicle.mileage,
    vehicleInteriorColor: showroomVehicle.color ?? 'Custom',
    vehicleBodyType: showroomVehicle.body,
    offers: {
      '@type': 'Offer',
      price: showroomVehicle.price,
      priceCurrency: 'EUR'
    }
  } as const;

  return (
    <section className="section-padding">
      <PageBackground page="details" />
      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <VehicleGallery
            images={[showroomVehicle.primaryImage, ...showroomVehicle.secondaryImages]}
            title={showroomVehicle.title}
            priority
            variant="hero"
            fit="cover"
            enableLightbox
          />
          <div className="surface-panel-strong space-y-6 rounded-3xl p-8 sm:p-10">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.55em] text-silver/60">
              {makeLogo ? (
                <span className="relative inline-flex h-8 w-8 sm:h-9 sm:w-9 overflow-hidden rounded-md border border-black/10 bg-white/20">
                  <Image src={makeLogo} alt={`${showroomVehicle.make} logo`} fill sizes="36px" className="object-cover" />
                </span>
              ) : null}
              <span>{showroomVehicle.make}</span>
            </div>
            <h1 className="font-heading text-4xl text-white md:text-5xl">{showroomVehicle.title}</h1>
            <div className="grid grid-cols-2 gap-4 text-xs uppercase tracking-[0.3em] text-silver/60">
              <div>
                <p className="text-silver/40">Power</p>
                <p className="mt-1 text-lg text-white">{showroomVehicle.hp} HP</p>
              </div>
              <div>
                <p className="text-silver/40">Engine</p>
                <p className="mt-1 text-lg text-white">{showroomVehicle.engine_cc.toLocaleString()} cc</p>
              </div>
              <div>
                <p className="text-silver/40">Mileage</p>
                <p className="mt-1 text-lg text-white">{showroomVehicle.mileage.toLocaleString()} km</p>
              </div>
              <div>
                <p className="text-silver/40">Transmission</p>
                <p className="mt-1 text-lg text-white">{showroomVehicle.transmission}</p>
              </div>
              <div>
                <p className="text-silver/40">Fuel</p>
                <p className="mt-1 text-lg text-white">{showroomVehicle.fuel}</p>
              </div>
              <div>
                <p className="text-silver/40">Investment</p>
                <p className="mt-1 text-lg text-white">{formatCurrency(showroomVehicle.price)}</p>
              </div>
            </div>
            <LuxAudioPlayer
              src={showroomVehicle.audioSample ? encodeURI(showroomVehicle.audioSample) : '/sounds/engine-start.mp3'}
            />


            <p className="text-xs uppercase tracking-[0.3em] text-silver/50">
              Engine audio placeholder — replace with bespoke rev sample from dashboard upload.
            </p>
          </div>
        </div>
        <section
          aria-labelledby="vehicle-actions"
          className="surface-panel-strong rounded-3xl p-8 sm:p-10"
        >
          <h2 id="vehicle-actions" className="sr-only">
            Vehicle actions
          </h2>
          <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-4">
            <GlowButton
              href={`/test-drive?vehicle=${encodeURIComponent(showroomVehicle.title)}`}
              className="w-full sm:w-auto sm:min-w-[200px] lg:flex-1"
            >
              Book Test Drive
            </GlowButton>
            <GlowButton
              href="https://wa.me/302101234567"
              variant="secondary"
              className="w-full sm:w-auto sm:min-w-[200px] lg:flex-1"
            >
              WhatsApp Concierge
            </GlowButton>
            <GlowButton
              href="#enquiry"
              variant="secondary"
              className="w-full sm:w-auto sm:min-w-[200px] lg:flex-1"
            >
              Enquire
            </GlowButton>
          </div>
        </section>
        {showroomVehicle.description && (
          <div className="mx-auto max-w-4xl space-y-4 rounded-3xl surface-panel p-8 text-silver/70">
            <h2 className="font-heading text-2xl text-white">Vehicle Narrative</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed">{showroomVehicle.description}</p>
          </div>
        )}
        {relatedVehicles.length > 0 && (
          <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-silver/60">Curated Suggestions</p>
                <h2 className="mt-2 font-heading text-2xl text-white">Related Vehicles</h2>
              </div>
              <GlowButton href="/showroom" variant="secondary" className="whitespace-nowrap self-start sm:self-auto">
                View Full Showroom
              </GlowButton>
            </div>
            <div className="grid gap-6 pt-2 md:grid-cols-2 xl:grid-cols-3">
              {relatedVehicles.map((item, relatedIndex) => (
                <CarCard key={item.id} vehicle={item} index={relatedIndex} />
              ))}
            </div>
          </div>
        )}
        <div id="enquiry">
          <VehicleEnquiryForm vehicleId={showroomVehicle.id} vehicleTitle={showroomVehicle.title} />
        </div>
        <div className="surface-panel rounded-3xl p-10 text-sm text-silver/70">
          <p>
            Interested in acquiring the {showroomVehicle.title}? Submit a request for a private test drive or connect with our
            acquisition specialists to tailor financing, trade-ins or custom delivery.
          </p>
        </div>
      </div>
      <Script id={`vehicle-schema-${showroomVehicle.slug}`} type="application/ld+json">
        {JSON.stringify(schema)}
      </Script>
    </section>
  );
}

// REQUIRED ASSETS (not included):
// public/brands/porsche.svg
// public/brands/ferrari.svg
// public/brands/lamborghini.svg
// public/brands/mercedes.svg
// public/brands/audi.svg
// public/brands/bmw.svg
// public/brands/bentley.svg
// public/brands/rolls-royce.svg
// public/brands/maserati.svg
// public/brands/aston-martin.svg
