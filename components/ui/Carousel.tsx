'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export type CarouselImage = {
  key?: string;
  render: () => React.ReactNode;
  label?: string;
};

export type CarouselProps = {
  slides: CarouselImage[];
  ariaLabel: string;
  className?: string;
  controlsClassName?: string;
  showDots?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  pauseOnHover?: boolean;

  /** Controlled API (optional) */
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  initialIndex?: number;
};

export default function Carousel({
  slides,
  ariaLabel,
  className,
  controlsClassName,
  showDots = true,
  loop = false,
  autoPlay = false,
  autoPlayInterval = 6000,
  pauseOnHover = false,
  activeIndex: controlledIndex,
  onActiveIndexChange,
  initialIndex = 0
}: CarouselProps) {
  const isControlled = controlledIndex != null;
  const [uncontrolledIndex, setUncontrolledIndex] = useState(initialIndex);
  const active = isControlled ? (controlledIndex as number) : uncontrolledIndex;

  const [announcement, setAnnouncement] = useState('');
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef<{ pointerId: number; startX: number; deltaX: number } | null>(null);
  const dragging = useRef(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);
  const trackId = useId();

  const normalize = useCallback((next: number) => {
    const len = slides.length || 1;
    if (loop) {
      return ((next % len) + len) % len;
    }
    return Math.min(len - 1, Math.max(0, next));
  }, [loop, slides.length]);

  const setActive = useCallback((next: number) => {
    const normalized = normalize(next);
    if (normalized === active) return;
    if (isControlled) {
      onActiveIndexChange?.(normalized);
    } else {
      setUncontrolledIndex(normalized);
      onActiveIndexChange?.(normalized);
    }
  }, [active, isControlled, normalize, onActiveIndexChange]);

  const goToPrevious = useCallback(() => setActive(active - 1), [active, setActive]);
  const goToNext     = useCallback(() => setActive(active + 1), [active, setActive]);

  // Ανακοίνωση/ARIA & live region, κάθε φορά που αλλάζει το active
  useEffect(() => {
    if (slides.length > 0) setAnnouncement(`Slide ${active + 1} of ${slides.length}`);
  }, [active, slides.length]);

  useEffect(() => {
  const onResize = () => { dragState.current = null; };
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}, []);


  // Auto-play
  useEffect(() => {
    if (!autoPlay || prefersReducedMotion || slides.length < 2) return;
    if ((pauseOnHover && isHovering) || isPointerDown || isFocused) return;

    const id = window.setInterval(() => {
      // χρησιμοποίησε την setActive με βάση το τρέχον active
      setActive(active + 1);
    }, autoPlayInterval);

    return () => window.clearInterval(id);
  }, [
    active,
    autoPlay,
    autoPlayInterval,
    isFocused,
    isHovering,
    isPointerDown,
    pauseOnHover,
    prefersReducedMotion,
    setActive,
    slides.length
  ]);

    // μέσα στο Carousel

    const DRAG_THRESHOLD = 14; // px

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      // ΜΟΝΟ κρατάμε state – ΔΕΝ κάνουμε setPointerCapture εδώ
      dragState.current = { pointerId: e.pointerId, startX: e.clientX, deltaX: 0 };
      dragging.current = false;
      setIsPointerDown(true);
    }, []);

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      const state = dragState.current;
      if (!state || state.pointerId !== e.pointerId) return;
      state.deltaX = e.clientX - state.startX;

      // Όταν ξεπεράσουμε το threshold, τότε κάνε capture & μπες σε drag
      if (!dragging.current && Math.abs(state.deltaX) > DRAG_THRESHOLD) {
        dragging.current = true;
        trackRef.current?.setPointerCapture(e.pointerId);
      }
    }, []);

    const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      const state = dragState.current;
      if (!state || state.pointerId !== e.pointerId) return;

      // Αν είχαμε πάρει capture, άφησέ το
      try { trackRef.current?.releasePointerCapture(e.pointerId); } catch {}

      const threshold = (trackRef.current?.clientWidth ?? 0) * 0.15;
      const didSwipe = Math.abs(state.deltaX) > threshold;

      if (state.deltaX > threshold) goToPrevious();
      else if (state.deltaX < -threshold) goToNext();

      // ΜΟΝΟ αν έγινε swipe, μπλόκαρε το click
      if (didSwipe) {
        e.preventDefault();
        e.stopPropagation();
      }

      dragState.current = null;
      dragging.current = false;
      setIsPointerDown(false);
    }, [goToNext, goToPrevious]);
 


  const offset = dragState.current?.deltaX ?? 0;

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); goToPrevious(); }
    if (event.key === 'ArrowRight') { event.preventDefault(); goToNext(); }
  }, [goToNext, goToPrevious]);

  return (
    <div
      className={clsx('relative', className)}
      onKeyDown={handleKeyDown}
      onMouseEnter={pauseOnHover ? () => setIsHovering(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setIsHovering(false) : undefined}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={() => setIsFocused(false)}
    >
      <div role="region" aria-roledescription="carousel" aria-label={ariaLabel} className="relative">
        <div
          id={trackId}
          ref={trackRef}
          className="flex touch-pan-y select-none"
          style={{
            transform: `translateX(calc(-${active} * 100% + ${offset}px))`,
            transition: dragState.current || prefersReducedMotion ? 'none' : 'transform 500ms ease'
          }}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.key ?? index}
              className="relative w-full flex-shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={slide.label ?? `Slide ${index + 1}`}
              aria-hidden={index === active ? undefined : true}
            >
              {slide.render()}
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <div className={clsx('pointer-events-none absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between', controlsClassName)}>
          <button
            type="button"
            className={clsx(
              'pointer-events-auto ml-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white shadow-lg transition hover:border-white/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
              !loop && active === 0 && 'opacity-40'
            )}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToPrevious(); }}
            aria-controls={trackId}
            aria-label="Previous slide"
            disabled={!loop && active === 0}
          >
            <ChevronLeftIcon className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            className={clsx(
              'pointer-events-auto mr-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white shadow-lg transition hover:border-white/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
              !loop && active === slides.length - 1 && 'opacity-40'
            )}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToNext(); }}
            aria-controls={trackId}
            aria-label="Next slide"
            disabled={!loop && active === slides.length - 1}
          >
            <ChevronRightIcon className="h-5 w-5" aria-hidden />
          </button>
        </div>
      )}

      {slides.length > 1 && showDots && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 py-2 backdrop-blur">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={clsx(
                  'h-2.5 w-2.5 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                  active === index ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                )}
                aria-label={`Go to slide ${index + 1}`}
                aria-controls={trackId}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActive(index); }}
              />
            ))}
          </div>
        </div>
      )}

      <span className="sr-only" aria-live="polite" aria-atomic>
        {announcement}
      </span>
    </div>
  );
}
