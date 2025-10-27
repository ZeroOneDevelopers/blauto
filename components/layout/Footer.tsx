'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const footerLinks = [
  { label: 'Showroom', href: '/showroom' },
  { label: 'Test Drive', href: '/test-drive' },
  { label: 'Dashboard', href: '/dashboard' }
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-12">
        <div className="space-y-3 text-sm text-silver/70">
          <p className="uppercase tracking-[0.35em] text-silver">Iliadis Executive Cars</p>
          <p>Varis Koropiou Ave 2, Voula 166 73 | +30 694 606 1486</p>
          <p>© {new Date().getFullYear()} Iliadis Executive Cars. Crafted for connoisseurs.</p>
        </div>
        <div className="flex flex-col items-start gap-4 text-sm uppercase tracking-[0.35em] md:flex-row md:items-center">
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
