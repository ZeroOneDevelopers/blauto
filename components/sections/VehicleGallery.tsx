'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import Carousel from '@/components/ui/Carousel';
import Lightbox from '@/components/ui/Lightbox';
import { SHIMMER_DATA_URL } from '@/lib/images';

type Props = {
  images: string[];
  title: string;
  variant?: 'detail' | 'hero';
  priority?: boolean;
  enableLightbox?: boolean;
  fit?: 'contain' | 'cover';
};

export default function VehicleGallery({
  images,
  title,
  variant = 'detail',
  priority = false,
  enableLightbox,
  fit = 'cover'
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  const aspectClass = variant === 'hero' ? 'aspect-[16/9]' : 'aspect-[4/3] md:aspect-[16/9]';
  const isDetailVariant = variant === 'detail';
  const sizes =
    variant === 'hero'
      ? '(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 60vw'
      : '(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 40vw';

  const slides = useMemo(
    () =>
      images.map((src, index) => ({
        key: `${src}-${index}`,
        label: `${title} image ${index + 1}`,
        render: () => {
          const objectFitClass = fit === 'cover' ? 'object-cover' : 'object-contain';
          const frameBackground = isDetailVariant ? 'bg-[#050505]' : 'bg-black';
          const frame = (
            <div
              className={clsx(
                'group relative block h-full w-full overflow-hidden rounded-3xl',
                frameBackground,
                enableLightbox ? 'focus-within:ring-2 focus-within:ring-white/40' : ''
              )}
            >
              <div className="relative h-full w-full">
                <Image
                  src={src}
                  alt={`${title} image ${index + 1}`}
                  fill
                  className={clsx(objectFitClass, 'object-center transition-transform duration-500 group-hover:scale-[1.015]')}
                  sizes={sizes}
                  quality={variant === 'hero' ? 95 : 94}
                  priority={priority && index === 0}
                  placeholder="blur"
                  blurDataURL={SHIMMER_DATA_URL}
                  loading={priority && index === 0 ? 'eager' : 'lazy'}
                  draggable={false}
                  style={{ backgroundColor: isDetailVariant ? '#050505' : '#000000' }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" aria-hidden />
              </div>
            </div>
          );

          if (!enableLightbox) return <div className={clsx('relative w-full', aspectClass)}>{frame}</div>;

          return (
            <div className={clsx('relative w-full', aspectClass)}>
              <button
                type="button"
                onClick={() => setLightbox({ open: true, index })}
                className="group relative block h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label={`Open ${title} image ${index + 1} in a lightbox`}
              >
                {frame}
              </button>
            </div>
          );
        }
      })),
    [aspectClass, enableLightbox, fit, images, priority, sizes, title, variant, isDetailVariant]
  );

  return (
    <div className={clsx('relative overflow-hidden rounded-3xl shadow-innerGlow', variant === 'hero' ? 'surface-panel-strong' : 'surface-panel')}>
      <Carousel
        slides={slides}
        ariaLabel={`${title} gallery`}
        className="relative"
        controlsClassName="px-2"
        onActiveIndexChange={(i) => setActiveIndex(i)} 
      />



      {enableLightbox && lightbox.open && (
        <Lightbox
          images={images}
          initial={lightbox.index}
          onClose={() => setLightbox({ open: false, index: activeIndex })}
        />
      )}

    </div>
  );
}
