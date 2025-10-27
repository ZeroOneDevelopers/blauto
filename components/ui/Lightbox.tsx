'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

type Props = {
  images: string[];
  initial?: number;
  onClose: () => void;
};

export default function Lightbox({ images, initial = 0, onClose }: Props) {
  const [index, setIndex] = useState(() => Math.min(Math.max(initial, 0), images.length - 1));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ startX: number; dx: number } | null>(null);

  const go = useCallback((delta: number) => {
    setIndex((i) => Math.min(images.length - 1, Math.max(0, i + delta)));
  }, [images.length]);

  const goPrev = useCallback(() => go(-1), [go]);
  const goNext = useCallback(() => go(+1), [go]);

  // ESC / arrows
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, onClose]);

  // lock scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // close on backdrop click
  const onBackdrop = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) onClose();
  };

  // touch/drag to navigate
  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, dx: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    drag.current.dx = e.clientX - drag.current.startX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = drag.current.dx;
    const threshold = (e.currentTarget as HTMLElement).clientWidth * 0.15;
    if (dx > threshold) goPrev();
    else if (dx < -threshold) goNext();
    drag.current = null;
  };

  const src = images[index] ?? images[0];

  const portal = (
    <div
      ref={containerRef}
      onClick={onBackdrop}
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        aria-label="Close"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>

      {/* Prev */}
      <button
        type="button"
        onClick={goPrev}
        disabled={index === 0}
        className={clsx(
          'absolute left-4 sm:left-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white hover:border-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
          index === 0 && 'opacity-40'
        )}
        aria-label="Previous image"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>

      {/* Next */}
      <button
        type="button"
        onClick={goNext}
        disabled={index === images.length - 1}
        className={clsx(
          'absolute right-4 sm:right-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white hover:border-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
          index === images.length - 1 && 'opacity-40'
        )}
        aria-label="Next image"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* Image area */}
    <div
      className="relative mx-4 w-full max-w-6xl z-10"   // <-- z-10
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="relative aspect-video">
        <Image
          src={src}
          alt={`Image ${index + 1} of ${images.length}`}
          fill
          sizes="100vw"
          className="object-contain select-none"
          draggable={false}
          priority
        />
      </div>
      <div className="mt-3 text-center text-xs uppercase tracking-[0.35em] text-white/70">
        {index + 1} / {images.length}
      </div>
    </div>

    {/* Prev */}
    <button
      type="button"
      onClick={goPrev}
      disabled={index === 0}
      className={clsx(
        'absolute left-4 sm:left-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white hover:border-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 z-20', // <-- z-20
        index === 0 && 'opacity-40'
      )}
      aria-label="Previous image"
    >
      <ChevronLeftIcon className="h-6 w-6" />
    </button>

    {/* Next */}
    <button
      type="button"
      onClick={goNext}
      disabled={index === images.length - 1}
      className={clsx(
        'absolute right-4 sm:right-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white hover:border-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 z-20', // <-- z-20
        index === images.length - 1 && 'opacity-40'
      )}
      aria-label="Next image"
    >
      <ChevronRightIcon className="h-6 w-6" />
    </button>
    </div>
  );

  // render via portal
  const target = typeof window !== 'undefined' ? document.body : null;
  return target ? createPortal(portal, target) : null;
}
