'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Overview', exact: true },
  { href: '/dashboard/vehicles', label: 'Vehicles' },
  { href: '/dashboard/leads', label: 'Leads' },
  { href: '/dashboard/bookings', label: 'Bookings' }
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="relative rounded-full border border-white/10 bg-black/40 backdrop-blur-md">
      <div className="overflow-x-auto">
        <ul className="flex min-w-max flex-nowrap items-center gap-2 px-3 py-3 sm:min-w-full sm:flex-wrap sm:justify-between sm:gap-3">
          {links.map((link) => {
            const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  className={`block rounded-full px-6 py-2.5 text-[0.7rem] uppercase tracking-[0.35em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 ${
                    isActive ? 'bg-white/20 text-white shadow-glow' : 'text-silver/70 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
