'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useId, useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Showroom', href: '/showroom' },
  { name: 'Test Drive', href: '/test-drive' },
  { name: 'Dashboard', href: '/dashboard' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // helper: active και για subroutes (π.χ. /dashboard/vehicles)
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 bg-graphite/80 backdrop-blur-lg overflow-visible"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-12">
        <Link href="/" className="flex items-center justify-center" onClick={() => setOpen(false)}>
          <div className="relative h-12 w-48 sm:h-14 sm:w-56 lg:h-16 lg:w-64">
            <Image
              src="/images/iliadisLogo.png"
              alt="Iliadis Executive Cars"
              fill
              priority
              sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 256px"
              className="object-contain object-center"
            />
          </div>
        </Link>




        {/* Desktop nav */}
        <nav className="hidden items-center gap-10 text-sm uppercase tracking-[0.35em] md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-current={active ? 'page' : undefined}
              >
                <span className={`transition-colors duration-300 ${active ? 'text-white' : 'text-silver/80 hover:text-white'}`}>
                  {link.name}
                </span>
                {active && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute -bottom-3 left-0 right-0 mx-auto h-[2px] w-full bg-white"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden rounded-full border border-white/20 p-2 text-white transition hover:border-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/60"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls={menuId}
        >
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu με AnimatePresence για smooth exit */}
      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="md:hidden"
            id={menuId}
          >
            <div className="space-y-4 px-6 pb-8 text-sm uppercase tracking-[0.35em]">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block border-b border-white/5 pb-4 transition ${active ? 'text-white' : 'text-silver/80 hover:text-white'}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
