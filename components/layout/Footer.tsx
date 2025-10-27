'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';

const footerLinks = [
  { label: 'Showroom', href: '/showroom' },
  { label: 'Test Drive', href: '/test-drive' },
  { label: 'Dashboard', href: '/dashboard' }
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-12">
        <div className="space-y-4 text-sm text-silver/70">
          <p className="uppercase tracking-[0.35em] text-silver">BL Auto Gallery</p>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-3">
              <MapPinIcon className="h-4 w-4 text-white" aria-hidden />
              <span>Varis Koropiou Ave 2, Voula 166 73</span>
            </p>
            <p className="flex items-center gap-3">
              <PhoneIcon className="h-4 w-4 text-white" aria-hidden />
              <a href="tel:+306946061486" className="transition hover:text-white">
                +30 694 606 1486
              </a>
            </p>
            <p className="flex items-center gap-3">
              <EnvelopeIcon className="h-4 w-4 text-white" aria-hidden />
              <a href="mailto:concierge@blautogallery.com" className="transition hover:text-white">
                concierge@blautogallery.com
              </a>
            </p>
          </div>
          <p>© {new Date().getFullYear()} BL Auto Gallery. Crafted for connoisseurs.</p>
        </div>
        <div className="flex flex-col items-start gap-4 text-xs uppercase tracking-[0.4em] md:flex-row md:items-center">
          {footerLinks.map((link) => (
            <motion.div whileHover={{ x: 4 }} key={link.href}>
              <Link
                href={link.href}
                className="text-silver/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </footer>
  );
}
