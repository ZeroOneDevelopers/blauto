'use client';

import { ShowroomVehicle, formatCurrency } from '@/lib/vehicles';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SHIMMER_DATA_URL } from '@/lib/images';
import Carousel from '@/components/ui/Carousel';
import { getBrandLogo } from '@/lib/brands';
import { useRouter } from 'next/navigation';
import type { KeyboardEventHandler } from 'react';

const MotionDiv = motion.div;

export default function CarCard({ vehicle, index }: { vehicle: ShowroomVehicle; index: number }) {
  const router = useRouter();
  const images = [vehicle.primaryImage, ...vehicle.secondaryImages].filter(Boolean);
  const logo = getBrandLogo(vehicle.make);
  const slides = images.map((src, index) => ({
    key: `${vehicle.id}-${index}`,
    label: `${vehicle.title} image ${index + 1}`,
    render: () => (
      <div className="relative h-[230px] w-full overflow-hidden bg-black sm:h-[260px] lg:h-[280px]">
        <Image
          src={src}
          alt={`${vehicle.title} image ${index + 1}`}
          fill
          quality={94}
          sizes="(max-width:640px) 92vw, (max-width:1024px) 44vw, 30vw"
          className="object-cover object-center"
          placeholder="blur"
          blurDataURL={SHIMMER_DATA_URL}
          priority={vehicle.featured && index === 0}
          loading={vehicle.featured && index === 0 ? 'eager' : 'lazy'}
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" aria-hidden />
      </div>
    )
  }));

  const navigateToDetails = () => {
    router.push(`/showroom/${vehicle.slug}`);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLElement> = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      navigateToDetails();
    }
  };

  return (
    <MotionDiv
      className="h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: 'easeOut' }}
    >
      <article
        role="link"
        tabIndex={0}
        aria-label={`View details for ${vehicle.title}`}
        onClick={navigateToDetails}
        onKeyDown={handleKeyDown}
        className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl surface-panel-strong transition-shadow duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        <div className="relative z-20">
          <Carousel
            slides={slides}
            ariaLabel={`${vehicle.title} preview images`}
            className="h-full"
            controlsClassName="px-4"
          />
        </div>
        <div className="relative z-10 flex flex-1 flex-col gap-5 px-6 pb-6 pt-6 sm:px-7">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-silver/60">
              {logo ? (
                <span
                  aria-hidden="true"
                  className="relative inline-flex h-6 w-6 overflow-hidden rounded-md border border-black/10 bg-white/20"
                >
                  <Image src={logo} alt={`${vehicle.make} logo`} fill sizes="28px" className="object-cover" />
                </span>
              ) : null}
              <span className="line-clamp-1">{vehicle.make}</span>
            </div>
            <h3 className="font-heading text-xl text-white line-clamp-2">{vehicle.title}</h3>
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-silver/50 line-clamp-1">
              <span>{vehicle.make}</span>
              <span aria-hidden>·</span>
              <span>{vehicle.model}</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-[0.65rem] uppercase tracking-[0.25em] text-silver/60 sm:grid-cols-3">
            <div>
              <p className="text-silver/40">Power</p>
              <p className="mt-1 text-sm text-white">{vehicle.hp} HP</p>
            </div>
            <div>
              <p className="text-silver/40">Engine</p>
              <p className="mt-1 text-sm text-white">{vehicle.engine_cc.toLocaleString()} cc</p>
            </div>
            <div>
              <p className="text-silver/40">Transmission</p>
              <p className="mt-1 text-sm text-white">{vehicle.transmission}</p>
            </div>
          </div>
          {vehicle.description && <p className="text-sm text-silver/70 line-clamp-3">{vehicle.description}</p>}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 text-white">
            <span className="text-lg font-semibold">{formatCurrency(vehicle.price)}</span>
            <span className="text-xs uppercase tracking-[0.35em] text-silver/70 transition-colors group-hover:text-white">
              View Details
            </span>
          </div>
        </div>
      </article>
    </MotionDiv>
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
