'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import GlowButton from '@/components/ui/GlowButton';
import type { ShowroomVehicle } from '@/lib/vehicles';

type Props = {
  vehicles: ShowroomVehicle[];
};

export default function CollectionTeaser({ vehicles }: Props) {
  const spotlight = vehicles.slice(0, 3);

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        {spotlight.map((vehicle, index) => (
          <motion.article
            key={vehicle.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
            className="card-hover surface-panel grid items-center gap-8 overflow-hidden rounded-3xl md:grid-cols-2"
          >
            <div className={`relative aspect-[4/3] w-full overflow-hidden bg-black md:h-full md:aspect-auto ${index % 2 === 1 ? 'md:order-last' : ''}`}>
              <Image
                src={vehicle.primaryImage}
                alt={vehicle.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                className="object-contain"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/10 to-transparent" />
            </div>
            <div className="relative space-y-6 p-10">
              <p className="text-xs uppercase tracking-[0.5em] text-silver/60">Showcase</p>
              <h3 className="font-heading text-3xl text-white">{vehicle.title}</h3>
              {vehicle.description && (
                <p className="text-sm leading-relaxed text-silver/70">{vehicle.description}</p>
              )}
              <GlowButton href={`/showroom/${vehicle.slug}`} variant="secondary" className="mt-8 w-full sm:w-auto">
                View Details
              </GlowButton>
            </div>
          </motion.article>
        ))}
        {spotlight.length === 0 && (
          <div className="surface-panel rounded-3xl p-10 text-center text-sm text-silver/70">
            No featured vehicles available yet. Add them from the dashboard to populate this spotlight.
          </div>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
        className="mx-auto mt-16 flex max-w-7xl justify-center px-4 sm:px-6 lg:px-8"
      >
        <GlowButton href="/showroom" className="uppercase">
          Discover the Full Fleet
        </GlowButton>
      </motion.div>
    </section>
  );
}
