'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import GlowButton from '@/components/ui/GlowButton';
import Carousel from '@/components/ui/Carousel';
import Image from 'next/image';
import { useRef, useEffect, useMemo } from 'react';

type HeroSlide = {
  src: string;
  alt: string;
  label?: string;
};

type HeroProps = {
  slides: HeroSlide[];
};

const FALLBACK_SLIDE: HeroSlide = {
  src: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80',
  alt: 'A red supercar parked inside a dark concrete gallery'
};

export default function Hero({ slides }: HeroProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);

  useEffect(() => {
    const audio = new Audio('/sounds/rev.mp3');
    audio.volume = 0.25;
    audio.play().catch(() => {
      // Autoplay may be blocked; ignore silently
    });
    return () => audio.pause();
  }, []);

  const resolvedSlides = slides.length > 0 ? slides : [FALLBACK_SLIDE];

  const carouselSlides = useMemo(
    () =>
      resolvedSlides.map((slide, index) => ({
        key: `${slide.src}-${index}`,
        label: slide.label ?? slide.alt,
        render: () => (
          <div className="relative h-full w-full min-h-[90vh]">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="h-full w-full object-cover"
              priority={index === 0}
              sizes="100vw"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"
              aria-hidden
            />
          </div>
        )
      })),
    [resolvedSlides]
  );

  return (
    <section ref={ref} className="relative flex min-h-[90vh] flex-col justify-end overflow-hidden">
      <Carousel
        slides={carouselSlides}
        ariaLabel="Iliadis hero showcase"
        className="absolute inset-0 h-full w-full"
        controlsClassName="px-6"
        loop
        autoPlay
        autoPlayInterval={6500}
        pauseOnHover
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.3),transparent_65%)]/60"
        aria-hidden
      />
        <motion.div style={{ y }} className="relative z-30 section-padding pb-40 sm:pb-48">
        <div className="surface-panel-strong max-w-3xl rounded-3xl border-white/15 p-8 sm:p-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-sm uppercase tracking-[0.6em] text-silver/80"
          >
            Redefining Luxury
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease: 'easeOut' }}
            className="mt-6 font-heading text-5xl text-white md:text-6xl lg:text-7xl"
          >
            A cinematic journey through the world&apos;s most prestigious executive vehicles.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: 'easeOut' }}
            className="mt-8 text-lg text-silver/80"
          >
            Iliadis Executive Cars orchestrates bespoke driving experiences with Ferrari, Lamborghini, Rolls-Royce, Bentley and
            more. Step into a digital atelier where each vehicle is presented with cinematic reverence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: 'easeOut' }}
            className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap"
          >
            <GlowButton href="/showroom" className="w-full sm:w-auto">
              Explore Collection
            </GlowButton>
            <GlowButton href="/test-drive" variant="secondary" className="w-full sm:w-auto">
              Book Test Drive
            </GlowButton>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute inset-x-0 bottom-10 z-20 hidden justify-center sm:flex"
      >
        <div className="pointer-events-none flex items-center gap-4 text-xs uppercase tracking-[0.5em] text-white">
          <span className="h-px w-12 bg-white" />
          Curated for Connoisseurs
          <span className="h-px w-12 bg-white" />
        </div>
      </motion.div>
    </section>
  );
}

// REQUIRED ASSETS (not included):
// none
